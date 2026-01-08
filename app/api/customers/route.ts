import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

const hasSupabase =
    !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

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
            return NextResponse.json({ success: false, message: 'Email verplicht' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, message: 'Ongeldig email adres' }, { status: 400 });
        }

        let existing: { klant_id: string } | null = null;
        if (hasSupabase) {
            const { data: existingRow } = await supabaseAdmin
                .from('customers')
                .select('klant_id')
                .eq('email', email)
                .single();
            existing = existingRow || null;
        }

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

        let error: any = null;
        const isNewCustomer = !existing;

        if (hasSupabase) {
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
        } else {
            console.warn('Supabase credentials missing - customer not persisted');
        }

        if (error) {
            console.error('Customer save error:', error);
        }

        return NextResponse.json({
            success: true,
            message: isNewCustomer ? 'KavelAlert geactiveerd!' : 'Je KavelAlert is bijgewerkt! ',
            isNewCustomer,
            persisted: !error && hasSupabase
        });

    } catch (error: any) {
        console.error('Customer save error:', error);
        return NextResponse.json({
            success: false,
            message: 'Er ging iets mis. Probeer het later opnieuw.'
        }, { status: 500 });
    }
}
