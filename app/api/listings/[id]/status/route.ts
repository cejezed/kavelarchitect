import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await request.json();

        if (!['published', 'sold', 'pending', 'skipped'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status value' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('listings')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('kavel_id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            listing: data,
            message: `Kavel status bijgewerkt naar: ${status}`
        });
    } catch (error: any) {
        console.error('Update listing status error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
