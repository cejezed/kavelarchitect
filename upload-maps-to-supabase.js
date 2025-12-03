import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MAPS_DIR = path.join(__dirname, '_old_root', 'public', 'maps');

async function uploadMapsToSupabase() {
    console.log('📤 Uploading maps to Supabase Storage...\n');

    // Check if maps directory exists
    if (!fs.existsSync(MAPS_DIR)) {
        console.error(`❌ Maps directory not found: ${MAPS_DIR}`);
        process.exit(1);
    }

    // Get all PNG files
    const mapFiles = fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.png'));
    console.log(`Found ${mapFiles.length} map images\n`);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const filename of mapFiles) {
        const filePath = path.join(MAPS_DIR, filename);
        const fileBuffer = fs.readFileSync(filePath);

        try {
            // Upload to Supabase Storage in 'maps' bucket
            const { data, error } = await supabase.storage
                .from('maps')
                .upload(filename, fileBuffer, {
                    contentType: 'image/png',
                    upsert: true // Overwrite if exists
                });

            if (error) {
                console.error(`❌ Failed to upload ${filename}:`, error.message);
                failed++;
            } else {
                console.log(`✅ Uploaded ${filename}`);
                uploaded++;
            }
        } catch (err) {
            console.error(`❌ Error uploading ${filename}:`, err.message);
            failed++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Uploaded: ${uploaded}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);

    // Now update the listings table to use Supabase Storage URLs
    console.log('\n📝 Updating listings table with Supabase Storage URLs...');
    await updateListingsUrls();
}

async function updateListingsUrls() {
    // Get all listings
    const { data: listings, error } = await supabase
        .from('listings')
        .select('*');

    if (error) {
        console.error('❌ Failed to fetch listings:', error.message);
        return;
    }

    console.log(`Found ${listings.length} listings to update\n`);

    let updated = 0;
    for (const listing of listings) {
        const kavelId = listing.kavel_id;
        const newImageUrl = `${supabaseUrl}/storage/v1/object/public/maps/${kavelId}.png`;

        const { error: updateError } = await supabase
            .from('listings')
            .update({
                image_url: newImageUrl,
                map_url: newImageUrl
            })
            .eq('kavel_id', kavelId);

        if (updateError) {
            console.error(`❌ Failed to update listing ${kavelId}:`, updateError.message);
        } else {
            console.log(`✅ Updated listing ${kavelId}`);
            updated++;
        }
    }

    console.log(`\n✅ Updated ${updated} listings with Supabase Storage URLs`);
}

uploadMapsToSupabase().catch(console.error);
