import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Pending count
        const { count: pendingCount, error: pendingError } = await supabaseAdmin
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Published today count
        const todayStr = new Date().toISOString().split('T')[0];
        const { count: publishedToday, error: publishedError } = await supabaseAdmin
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .gte('updated_at', todayStr);

        if (publishedError) throw publishedError;

        return NextResponse.json({
            pendingCount: pendingCount || 0,
            publishedToday: publishedToday || 0,
            totalMatches: 0, // Placeholder, calculation is heavy
            lastUpdated: new Date().toISOString(),
            syncStatus: { status: 'ok', message: 'Vercel hosted', lastCheck: new Date().toISOString() }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
