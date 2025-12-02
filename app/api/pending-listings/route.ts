import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { findMatchesForListing } from '@/lib/matching';

export const dynamic = 'force-dynamic'; // Ensure this route is never cached

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('listings')
            .select('*')
            .eq('status', 'pending');

        if (error) throw error;

        // Add potential matches
        const pendingWithMatches = await Promise.all(data.map(async (listing) => {
            const matches = await findMatchesForListing(listing);
            return { ...listing, potential_matches: matches };
        }));

        return NextResponse.json(pendingWithMatches);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
