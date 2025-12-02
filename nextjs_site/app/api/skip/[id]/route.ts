import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const { error } = await supabaseAdmin
            .from('listings')
            .update({ status: 'skipped', updated_at: new Date().toISOString() })
            .eq('kavel_id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
