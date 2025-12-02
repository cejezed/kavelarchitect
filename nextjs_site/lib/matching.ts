import { supabaseAdmin } from './supabaseAdmin';

export async function findMatchesForListing(listing: any) {
    const { data: customers } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('status', 'actief');

    if (!customers) return [];

    return customers.filter(c => {
        // Regio check
        const regioMatch = c.provincies && c.provincies.some((p: string) => listing.provincie.includes(p));

        // Oppervlakte check
        const oppMatch = !c.min_oppervlakte || listing.oppervlakte >= c.min_oppervlakte;

        // Budget check
        const budgetMatch = !c.max_prijs || listing.prijs <= c.max_prijs;

        return regioMatch && oppMatch && budgetMatch;
    });
}
