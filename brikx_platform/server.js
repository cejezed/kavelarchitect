import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import fs from 'fs';
import util from 'util'; // Added for execPromise
const execPromise = util.promisify(exec); // Added for execPromise

// Configuratie laden
dotenv.config();

// Gebruik omgevingsvariabele voor poort (nodig voor Render/Railway/Heroku) of fallback naar 8765
const PORT = process.env.PORT || 8765;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// VERWIJZING NAAR HET NIEUWE SYNC SCRIPT
const SYNC_SCRIPT = path.join(__dirname, 'backend', 'sync_worker.py');

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️  WAARSCHUWING: Geen Supabase credentials gevonden in .env. De server zal falen bij data requests.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Resend Setup
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/maps', express.static(path.join(__dirname, 'public', 'maps')));

// Serve static assets from dist folder with no-cache headers
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
    setHeaders: (res) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
}));

// --- State tracking ---
let currentSyncStatus = {
    status: 'unknown',
    message: 'Nog niet gecheckt',
    lastCheck: null
};

// --- API Endpoints ---

// 1. Listings Ophalen (Pending)
app.get('/api/pending-listings', async (req, res) => {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'pending');

    if (error) return res.status(500).json({ error: error.message });

    // Voeg potential matches toe
    const pendingWithMatches = await Promise.all(data.map(async (listing) => {
        const matches = await findMatchesForListing(listing);
        return { ...listing, potential_matches: matches };
    }));

    res.json(pendingWithMatches);
});

// 2. Listings Ophalen (Published)
app.get('/api/published-listings', async (req, res) => {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 3. Klanten Ophalen
app.get('/api/customers', async (req, res) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 4. Nieuwe Klant Registreren (Scorecard)
app.post('/api/customers', async (req, res) => {
    const {
        email, telefoonnummer,
        provincies, min_oppervlakte,
        bouwstijl, tijdslijn, bouwbudget,
        kavel_type, opmerkingen, early_access_rapport,
        naam
    } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email verplicht" });
    }

    // Check bestaande klant
    const { data: existing } = await supabase
        .from('customers')
        .select('klant_id')
        .eq('email', email)
        .single();

    const customerData = {
        naam: naam || email.split('@')[0],
        email,
        telefoonnummer: telefoonnummer || '',
        provincies: provincies || [],
        min_oppervlakte: Number(min_oppervlakte) || 0,
        bouwstijl: bouwstijl || '',
        tijdslijn: tijdslijn || '',
        bouwbudget: bouwbudget || '',
        kavel_type: kavel_type || '',
        opmerkingen: opmerkingen || '',
        early_access_rapport: !!early_access_rapport,
        dienstverlening: 'zoek',
        status: 'actief',
        updated_at: new Date().toISOString()
    };

    let error;

    if (existing) {
        // Update
        const result = await supabase
            .from('customers')
            .update(customerData)
            .eq('klant_id', existing.klant_id);
        error = result.error;
    } else {
        // Insert
        const result = await supabase
            .from('customers')
            .insert({
                klant_id: randomUUID(),
                ...customerData
            });
        error = result.error;
    }

    if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ success: false, message: "Opslaan mislukt" });
    }

    // --- MAIL VERSTUREN MET RESEND (Welkomstmail) ---

    res.json({ success: true, message: "KavelAlert geactiveerd!" });
});

// 5. Publiceren & Matchen
// 4. Handmatig toevoegen
app.post('/api/listings/manual', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: "URL is verplicht" });
    }

    // Basic validation
    if (!url.startsWith('http')) {
        return res.status(400).json({ success: false, message: "Moet een geldige URL zijn (beginnend met http)" });
    }

    try {
        console.log(`Processing manual URL: ${url}`);
        // Use path.join and replace backslashes with forward slashes for Python
        const scriptPath = path.join(process.cwd(), 'backend', 'sync_worker.py').replace(/\\/g, '/');
        const { stdout, stderr } = await execPromise(`python "${scriptPath}" --url "${url}"`);

        console.log('Sync output:', stdout);
        if (stderr) console.error('Sync stderr:', stderr);

        // Check if successful
        if (stdout.includes('Successfully processed URL')) {
            return res.json({ success: true, message: "Kavel succesvol toegevoegd" });
        } else if (stdout.includes('already exists')) {
            return res.status(409).json({ success: false, message: "Kavel bestaat al" });
        } else {
            return res.status(500).json({ success: false, message: "Kon kavel niet verwerken. Zie logs." });
        }
    } catch (error) {
        console.error('Manual sync failed:', error);
        return res.status(500).json({ success: false, message: "Fout bij toevoegen: " + error.message });
    }
});

// 5. Publiceren & Matchen
app.post('/api/publish/:id', async (req, res) => {
    const { id } = req.params;
    const { sites, analysis } = req.body;

    // 1. Haal eerst de kavelgegevens op (nodig voor matching en validatie)
    const { data: listing, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('kavel_id', id)
        .single();

    if (fetchError || !listing) return res.status(404).json({ success: false, message: "Kavel niet gevonden" });

    // WordPress publishing disabled
    // 2. Bereid update data voor
    const updateData = {
        status: 'published',
        published_sites: sites,
        updated_at: new Date().toISOString()
    };

    if (analysis) {
        updateData.specs = {
            maxVolume: analysis.volume,
            maxHeight: analysis.height,
            gutterHeight: analysis.gutter,
            roofType: analysis.roof
        };
    }

    // 3. Update status in Database
    const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('kavel_id', id);

    if (error) return res.status(500).json({ success: false, message: error.message });

    // 4. MATCH LOGICA & EMAILING
    let matchCount = 0;
    if (resend) {
        const matches = await findMatchesForListing(listing);
        matchCount = matches.length;

        // Loop door matches en stuur mails
        // (In productie: gebruik resend.batch.send of een queue voor grote aantallen)
        for (const customer of matches) {
            try {
                await resend.emails.send({
                    from: 'KavelArchitect <onboarding@resend.dev>',
                    to: customer.email,
                    subject: `🔔 Nieuwe Match: Bouwkavel in ${listing.plaats} `,
                    html: `< div style = "font-family: sans-serif; color: #0F2B46; max-width: 600px;" ><h2 style="font-family: serif; color: #0F2B46;">Nieuwe kavel gevonden!</h2><p>Beste ${customer.naam || 'bouwer'},</p><p>We hebben een nieuwe kavel gevonden die past bij uw zoekprofiel:</p><div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3 style="margin:0;">${listing.adres}, ${listing.plaats}</h3><p style="margin: 5px 0; color: #64748B;">${listing.seo_summary || 'Geen omschrijving beschikbaar.'}</p><ul style="font-size: 14px; color: #334155;"><li><strong>Prijs:</strong> € ${listing.prijs.toLocaleString()}</li><li><strong>Oppervlakte:</strong> ${listing.oppervlakte} m²</li></ul><a href="${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:3000'}/aanbod/${listing.kavel_id}" style="display: inline-block; background: #0F2B46; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Bekijk Kavel & Bouwpotentie</a></div><p>Wilt u weten wat u hier mag bouwen? Bekijk dan de volledige analyse op onze site.</p><br/><p>Met vriendelijke groet,</p><p><strong>Jules Zwijsen</strong><br/>KavelArchitect.nl</p></div > `
                });
                console.log(`📧 Match mail verstuurd naar ${customer.email} `);
            } catch (e) {
                console.error(`Fout bij mailen ${customer.email}: `, e);
            }
        }
    }

    res.json({
        success: true,
        message: `Gepubliceerd op ${sites.join(' & ')} en ${matchCount} match - emails verstuurd!`
    });
});

// 5b. Publiceer alle pending listings
app.post('/api/publish-all', async (req, res) => {
    const { sites } = req.body;

    if (!sites || !Array.isArray(sites) || sites.length === 0) {
        return res.status(400).json({ success: false, message: "Sites array is verplicht" });
    }

    // Haal alle pending listings op
    const { data: pendingListings, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'pending');

    if (fetchError) {
        return res.status(500).json({ success: false, message: fetchError.message });
    }

    if (!pendingListings || pendingListings.length === 0) {
        return res.json({ success: true, message: "Geen pending kavels om te publiceren", count: 0 });
    }

    let successCount = 0;
    let errorCount = 0;

    // Loop door alle listings en publiceer ze
    for (const listing of pendingListings) {
        try {
            // WordPress publishing disabled
            // Update status in database
            const { error: updateError } = await supabase
                .from('listings')
                .update({
                    status: 'published',
                    published_sites: sites,
                    updated_at: new Date().toISOString()
                })
                .eq('kavel_id', listing.kavel_id);

            if (updateError) {
                console.error(`Failed to update ${listing.kavel_id}:`, updateError);
                errorCount++;
                continue;
            }

            // Match en mail klanten
            if (resend) {
                const matches = await findMatchesForListing(listing);
                for (const customer of matches) {
                    try {
                        await resend.emails.send({
                            from: 'KavelArchitect <onboarding@resend.dev>',
                            to: customer.email,
                            subject: `🔔 Nieuwe Match: Bouwkavel in ${listing.plaats}`,
                            html: `<div style="font-family: sans-serif; color: #0F2B46; max-width: 600px;"><h2 style="font-family: serif; color: #0F2B46;">Nieuwe kavel gevonden!</h2><p>Beste ${customer.naam || 'bouwer'},</p><p>We hebben een nieuwe kavel gevonden die past bij uw zoekprofiel:</p><div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3 style="margin:0;">${listing.adres}, ${listing.plaats}</h3><p style="margin: 5px 0; color: #64748B;">${listing.seo_summary || 'Geen omschrijving beschikbaar.'}</p><ul style="font-size: 14px; color: #334155;"><li><strong>Prijs:</strong> € ${listing.prijs.toLocaleString()}</li><li><strong>Oppervlakte:</strong> ${listing.oppervlakte} m²</li></ul><a href="${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:3000'}/aanbod/${listing.kavel_id}" style="display: inline-block; background: #0F2B46; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Bekijk Kavel & Bouwpotentie</a></div><p>Wilt u weten wat u hier mag bouwen? Bekijk dan de volledige analyse op onze site.</p><br/><p>Met vriendelijke groet,</p><p><strong>Jules Zwijsen</strong><br/>KavelArchitect.nl</p></div>`
                        });
                        console.log(`📧 Match mail verstuurd naar ${customer.email}`);
                    } catch (e) {
                        console.error(`Fout bij mailen ${customer.email}:`, e);
                    }
                }
            }

            successCount++;
        } catch (error) {
            console.error(`Error publishing ${listing.kavel_id}:`, error);
            errorCount++;
        }
    }

    res.json({
        success: true,
        message: `${successCount} kavels gepubliceerd op ${sites.join(' & ')}${errorCount > 0 ? ` (${errorCount} fouten)` : ''}`,
        count: successCount
    });
});

// 6. Overslaan
app.post('/api/skip/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('listings')
        .update({ status: 'skipped', updated_at: new Date().toISOString() })
        .eq('kavel_id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// 6b. Update Listing (PATCH)
app.patch('/api/listings/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Filter allowed fields
    const allowedFields = [
        'specs',
        'seo_title', 'seo_summary', 'seo_article_html',
        'seo_title_ka', 'seo_summary_ka', 'seo_article_html_ka',
        'seo_title_zw', 'seo_summary_zw', 'seo_article_html_zw',
        'prijs', 'oppervlakte', 'adres', 'plaats', 'postcode', 'provincie'
    ];
    const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = updates[key];
            return obj;
        }, {});

    filteredUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
        .from('listings')
        .update(filteredUpdates)
        .eq('kavel_id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// 7. Stats
app.get('/api/stats', async (req, res) => {
    const { count: pendingCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    const todayStr = new Date().toISOString().split('T')[0];
    const { count: publishedToday } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('updated_at', todayStr);

    res.json({
        pendingCount: pendingCount || 0,
        publishedToday: publishedToday || 0,
        totalMatches: 0,
        lastUpdated: new Date().toISOString(),
        syncStatus: currentSyncStatus
    });
});

// 8. Sync Trigger (Check Funda)
app.post('/api/sync', (req, res) => {
    console.log("🔄 Sync aangevraagd...");
    currentSyncStatus.message = "Bezig met ophalen...";
    currentSyncStatus.status = "warning";
    currentSyncStatus.lastCheck = new Date().toISOString();

    if (!fs.existsSync(SYNC_SCRIPT)) {
        console.error(`❌ Kan sync script niet vinden: ${SYNC_SCRIPT} `);
        return res.status(500).json({ success: false, message: "Script niet gevonden" });
    }

    // Voer het Python script uit
    exec(`python "${SYNC_SCRIPT}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Python Error: ${error.message} `);
            console.error(`Stderr: ${stderr} `);
            currentSyncStatus = { status: 'error', message: 'Sync mislukt', lastCheck: new Date().toISOString() };
            return res.status(500).json({ success: false });
        }

        console.log(`✅ Python Output: ${stdout} `);
        currentSyncStatus = { status: 'ok', message: 'Nieuwe kavels opgehaald', lastCheck: new Date().toISOString() };
        res.json({ success: true });
    });
});

// --- Helper: Match Logica ---
async function findMatchesForListing(listing) {
    const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('status', 'actief');

    if (!customers) return [];

    return customers.filter(c => {
        // Regio check (als klant geen regio's heeft, match alles? Nee, wees strikt)
        const regioMatch = c.provincies && c.provincies.some(p => listing.provincie.includes(p));

        // Oppervlakte check (kavel moet groter/gelijk zijn aan wens)
        const oppMatch = !c.min_oppervlakte || listing.oppervlakte >= c.min_oppervlakte;

        // Budget check (kavelprijs moet binnen budget vallen, hier nemen we max_prijs)
        // Let op: 'bouwbudget' is string in scorecard, 'max_prijs' is numeric. We gebruiken max_prijs als fallback.
        const budgetMatch = !c.max_prijs || listing.prijs <= c.max_prijs;

        return regioMatch && oppMatch && budgetMatch;
    });
}

// Serve static files from dist directory (Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// --- API Endpoints ---
// (API routes remain unchanged)

// ... (keep existing API routes) ...

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Don't intercept API calls
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Luister op de poort die Render/Railway toewijst
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Brikx Backend(Supabase) draait op poort ${PORT} `);
});
