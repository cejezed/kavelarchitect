import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            email, telefoonnummer,
            provincies, min_oppervlakte,
            bouwstijl, tijdslijn, bouwbudget,
            kavel_type, opmerkingen, early_access_rapport,
            naam, plaats, provincie, prijs, source
        } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: "Email verplicht" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, message: "Ongeldig email adres" }, { status: 400 });
        }

        // Check existing
        const { data: existing } = await supabaseAdmin
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
        let isNewCustomer = !existing;

        if (existing) {
            const result = await supabaseAdmin
                .from('customers')
                .update(customerData)
                .eq('klant_id', existing.klant_id);
            error = result.error;
        } else {
            const result = await supabaseAdmin
                .from('customers')
                .insert({
                    klant_id: randomUUID(),
                    ...customerData
                });
            error = result.error;
        }

        if (error) throw error;

        // Email templates
        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .badge { background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: bold; margin: 10px 0; }
        .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details h3 { margin-top: 0; color: #1e3a8a; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .button { background: #1e3a8a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0;">🔔 KavelAlert Geactiveerd!</h1>
        </div>
        <div class="content">
            <p>Beste ${customerData.naam},</p>
            
            <p>Bedankt voor je aanmelding! Je KavelAlert is nu <strong>actief</strong>. We houden het aanbod voor je in de gaten en sturen je direct een melding zodra er een kavel beschikbaar komt die aan jouw wensen voldoet.</p>
            
            <div class="details">
                <h3>Jouw Zoekprofiel:</h3>
                <p><strong>📍 Regio's:</strong> ${Array.isArray(provincies) ? provincies.join(', ') : provincies || plaats || provincie || 'Alle regio\'s'}</p>
                ${min_oppervlakte ? `<p><strong>📏 Min. Oppervlakte:</strong> ${min_oppervlakte}m²</p>` : ''}
                ${bouwbudget ? `<p><strong>💰 Budget:</strong> ${bouwbudget}</p>` : ''}
                ${bouwstijl ? `<p><strong>🏠 Woningtype:</strong> ${bouwstijl}</p>` : ''}
                ${tijdslijn ? `<p><strong>⏰ Tijdslijn:</strong> ${tijdslijn}</p>` : ''}
            </div>
            
            <p><strong>Wat gebeurt er nu?</strong></p>
            <ul>
                <li>✅ We scannen dagelijks alle nieuwe kavels</li>
                <li>✅ Bij een match ontvang je meteen een email</li>
                <li>✅ Je kunt je profiel altijd aanpassen door opnieuw in te schrijven</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="https://kavelarchitect.nl/aanbod" class="button">Bekijk Huidige Aanbod</a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                <strong>Tip:</strong> Voeg info@kavelarchitect.nl toe aan je contacten zodat onze meldingen niet in je spam terechtkomen.
            </p>
        </div>
        <div class="footer">
            <p>KavelArchitect - Powered by Architectenbureau Zwijsen</p>
            <p>Liever geen meldingen meer? <a href="mailto:info@kavelarchitect.nl?subject=Uitschrijven%20KavelAlert">Klik hier om uit te schrijven</a></p>
        </div>
    </div>
</body>
</html>`;

        const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 20px; border: 1px solid #e5e7eb; }
        .new-badge { background: #fbbf24; color: #78350f; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .update-badge { background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">🎯 ${isNewCustomer ? 'Nieuwe' : 'Geüpdatete'} KavelAlert Aanmelding</h2>
            <span class="${isNewCustomer ? 'new-badge' : 'update-badge'}">${isNewCustomer ? 'NIEUW' : 'UPDATE'}</span>
        </div>
        <div class="content">
            <h3>Klantgegevens:</h3>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>👤 Naam:</strong> ${customerData.naam}</p>
            ${telefoonnummer ? `<p><strong>📱 Telefoon:</strong> ${telefoonnummer}</p>` : ''}
            
            <h3>Zoekprofiel:</h3>
            <p><strong>📍 Regio's:</strong> ${Array.isArray(provincies) ? provincies.join(', ') : provincies || 'Niet opgegeven'}</p>
            ${min_oppervlakte ? `<p><strong>📏 Min. Oppervlakte:</strong> ${min_oppervlakte}m²</p>` : ''}
            ${bouwbudget ? `<p><strong>💰 Budget:</strong> ${bouwbudget}</p>` : ''}
            ${bouwstijl ? `<p><strong>🏠 Woningtype:</strong> ${bouwstijl}</p>` : ''}
            ${tijdslijn ? `<p><strong>⏰ Tijdslijn:</strong> ${tijdslijn}</p>` : ''}
            ${kavel_type ? `<p><strong>🏘️ Kavel Type:</strong> ${kavel_type}</p>` : ''}
            ${opmerkingen ? `<p><strong>💬 Opmerkingen:</strong> ${opmerkingen}</p>` : ''}
            ${source ? `<p><strong>📊 Bron:</strong> ${source}</p>` : ''}
            
            <p><strong>Early Access Rapport:</strong> ${early_access_rapport ? '✅ Ja' : '❌ Nee'}</p>
            
            <p style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <strong>⏰ Aangemeld op:</strong> ${new Date().toLocaleString('nl-NL')}
            </p>
        </div>
    </div>
</body>
</html>`;

        let emailStatus = { sent: false, error: null as string | null };

        // Send emails (if Resend is configured)
        if (resend) {
            try {
                // Determine sender - Default to onboarding@resend.dev for testing if no custom domain set
                const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
                const adminEmail = process.env.ADMIN_EMAIL || 'info@kavelarchitect.nl';

                // Send welcome email to customer
                await resend.emails.send({
                    from: `KavelArchitect <${fromAddress}>`,
                    to: email,
                    subject: `✅ Je KavelAlert is ${isNewCustomer ? 'actief' : 'geüpdatet'}!`,
                    html: customerEmailHtml
                });

                // Send notification to admin
                await resend.emails.send({
                    from: `KavelArchitect Notificaties <${fromAddress}>`,
                    to: adminEmail,
                    subject: `🎯 ${isNewCustomer ? 'Nieuwe' : 'Geüpdatete'} KavelAlert: ${email}`,
                    html: adminEmailHtml,
                    replyTo: email
                });

                console.log(`✅ Emails sent successfully to ${email} & ${adminEmail}`);
                emailStatus.sent = true;
            } catch (emailError: any) {
                console.error('❌ Failed to send emails:', emailError);
                emailStatus.error = emailError.message;
            }
        } else {
            console.warn('⚠️ Resend API not configured - no emails sent. Key present:', !!process.env.RESEND_API_KEY);
            emailStatus.error = "Resend API Key missing";
        }

        return NextResponse.json({
            success: true,
            message: isNewCustomer ? "KavelAlert geactiveerd!" : "Je KavelAlert is bijgewerkt!",
            isNewCustomer,
            emailStatus // detailed status for debugging
        });

    } catch (error: any) {
        console.error("❌ Customer save error:", error);
        return NextResponse.json({
            success: false,
            message: "Er ging iets mis. Probeer het later opnieuw."
        }, { status: 500 });
    }
}

