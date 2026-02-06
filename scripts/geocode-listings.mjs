import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env or .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const delayMs = Number(process.env.GEOCODE_MIN_DELAY_MS || 1100);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function geocodeAddress(address) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    url.searchParams.set('q', address);

    const res = await fetch(url.toString(), {
        headers: {
            'User-Agent': 'KavelArchitect-Geocoder/1.0 (admin@kavelarchitect.nl)'
        }
    });

    if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return {
        lat: Number(data[0].lat),
        lng: Number(data[0].lon)
    };
}

async function run() {
    const { data: listings, error } = await supabase
        .from('listings')
        .select('kavel_id, adres, plaats, provincie, lat, lng')
        .or('lat.is.null,lng.is.null');

    if (error) {
        console.error('Supabase fetch error:', error.message);
        process.exit(1);
    }

    if (!listings || listings.length === 0) {
        console.log('No listings without coordinates.');
        return;
    }

    console.log(`Found ${listings.length} listings without coordinates.`);

    for (const listing of listings) {
        const address = `${listing.adres}, ${listing.plaats}, Nederland`;
        try {
            const result = await geocodeAddress(address);
            if (!result) {
                console.warn(`No result for ${listing.kavel_id}: ${address}`);
            } else {
                const { error: updateError } = await supabase
                    .from('listings')
                    .update({ lat: result.lat, lng: result.lng })
                    .eq('kavel_id', listing.kavel_id);

                if (updateError) {
                    console.error(`Update failed for ${listing.kavel_id}:`, updateError.message);
                } else {
                    console.log(`Updated ${listing.kavel_id}: ${result.lat}, ${result.lng}`);
                }
            }
        } catch (err) {
            console.error(`Geocode error for ${listing.kavel_id}:`, err.message || err);
        }

        await sleep(delayMs);
    }
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
