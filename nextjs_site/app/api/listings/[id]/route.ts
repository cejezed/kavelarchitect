import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const updates = await req.json();

        // Filter allowed fields
        const allowedFields = [
            'specs', 'seo_title', 'seo_summary', 'seo_article_html',
            'prijs', 'oppervlakte', 'adres', 'plaats', 'postcode', 'provincie'
        ];

        const filteredUpdates: any = {};
        for (const key of Object.keys(updates)) {
            if (allowedFields.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        }

        filteredUpdates.updated_at = new Date().toISOString();

        const { error } = await supabaseAdmin
            .from('listings')
            .update(filteredUpdates)
            .eq('kavel_id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
