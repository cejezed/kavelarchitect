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
            naam
        } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: "Email verplicht" }, { status: 400 });
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

        // Send Welcome Email (Optional, if Resend is configured)
        if (resend && !existing) {
            try {
                await resend.emails.send({
                    from: 'KavelArchitect <onboarding@resend.dev>',
                    to: email,
                    subject: 'Welkom bij KavelArchitect',
                    html: `<p>Beste ${customerData.naam},</p><p>Bedankt voor uw aanmelding!</p>`
                });
            } catch (e) {
                console.error('Failed to send welcome email', e);
            }
        }

        return NextResponse.json({ success: true, message: "KavelAlert geactiveerd!" });

    } catch (error: any) {
        console.error("Customer save error:", error);
        return NextResponse.json({ success: false, message: "Opslaan mislukt" }, { status: 500 });
    }
}
