import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { findMatchesForListing } from '@/lib/matching';
import { createWordPressPost } from '@/lib/wordpress';
import { buildKavelArchitectArticle, buildKavelArchitectSummary, buildZwijsenArticle } from '@/lib/listingCopy';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { sites, analysis } = await req.json();

        // 1. Fetch Listing
        const { data: listing, error: fetchError } = await supabaseAdmin
            .from('listings')
            .select('*')
            .eq('kavel_id', id)
            .single();

        if (fetchError || !listing) {
            return NextResponse.json({ success: false, message: "Kavel niet gevonden" }, { status: 404 });
        }

        const kavelArchitectSummary = buildKavelArchitectSummary(listing);
        const kavelArchitectArticle = buildKavelArchitectArticle(listing);
        const zwijsenArticle = buildZwijsenArticle(listing);

        // 2. Publish to WordPress (if selected)
        if (sites && sites.includes('zwijsen')) {
            try {
                await createWordPressPost(listing, zwijsenArticle);
            } catch (error: any) {
                console.error('WordPress publish failed:', error);
                // Continue execution, don't block DB update
            }
        }

        // 3. Prepare Update Data
        const updateData: any = {
            status: 'published',
            published_sites: sites,
            updated_at: new Date().toISOString()
        };

        if (sites && sites.includes('kavelarchitect') && listing.status !== 'published') {
            updateData.seo_summary = kavelArchitectSummary;
            updateData.seo_article_html = kavelArchitectArticle;
        }

        if (analysis) {
            updateData.specs = {
                maxVolume: analysis.volume,
                maxHeight: analysis.height,
                gutterHeight: analysis.gutter,
                roofType: analysis.roof
            };
        }

        // 4. Update Database
        const { error } = await supabaseAdmin
            .from('listings')
            .update(updateData)
            .eq('kavel_id', id);

        if (error) throw error;

        // 5. Match Logic & Emailing
        let matchCount = 0;
        if (resend) {
            const matches = await findMatchesForListing(listing);
            matchCount = matches.length;

            for (const customer of matches) {
                try {
                    await resend.emails.send({
                        from: 'KavelArchitect <onboarding@resend.dev>',
                        to: customer.email,
                        subject: `🔔 Nieuwe Match: Bouwkavel in ${listing.plaats}`,
                        html: `<div style="font-family: sans-serif; color: #0F2B46; max-width: 600px;">
              <h2 style="font-family: serif; color: #0F2B46;">Nieuwe kavel gevonden!</h2>
              <p>Beste ${customer.naam || 'bouwer'},</p>
              <p>We hebben een nieuwe kavel gevonden die past bij uw zoekprofiel:</p>
              <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin:0;">${listing.adres}, ${listing.plaats}</h3>
                <p style="margin: 5px 0; color: #64748B;">${kavelArchitectSummary || listing.seo_summary || 'Geen omschrijving beschikbaar.'}</p>
                <ul style="font-size: 14px; color: #334155;">
                  <li><strong>Prijs:</strong> ${listing.prijs ? `€ ${listing.prijs.toLocaleString()}` : 'Op aanvraag'}</li>
                  <li><strong>Oppervlakte:</strong> ${listing.oppervlakte} m²</li>
                </ul>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kavelarchitect.nl'}/aanbod/${listing.kavel_id}" 
                   style="display: inline-block; background: #0F2B46; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
                   Bekijk Kavel & Bouwpotentie
                </a>
              </div>
              <p>Wilt u weten wat u hier mag bouwen? Bekijk dan de volledige analyse op onze site.</p>
              <br/>
              <p>Met vriendelijke groet,</p>
              <p><strong>Jules Zwijsen</strong><br/>KavelArchitect.nl</p>
            </div>`
                    });
                } catch (e) {
                    console.error(`Failed to email ${customer.email}`, e);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Gepubliceerd op ${sites.join(' & ')} en ${matchCount} match - emails verstuurd!`
        });

    } catch (error: any) {
        console.error('PUBLISH API ERROR:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Er is een onbekende fout opgetreden',
            details: error.stack
        }, { status: 500 });
    }
}
