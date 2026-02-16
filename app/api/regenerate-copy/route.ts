import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { buildKavelArchitectArticle, buildKavelArchitectSummary, buildZwijsenArticle } from '@/lib/listingCopy';

export async function POST() {
    try {
        // Fetch all published listings
        const { data: listings, error: fetchError } = await supabaseAdmin
            .from('listings')
            .select('*')
            .eq('status', 'published');

        if (fetchError) throw fetchError;
        if (!listings || listings.length === 0) {
            return NextResponse.json({ success: true, message: 'Geen gepubliceerde kavels gevonden', count: 0 });
        }

        let updated = 0;
        let errors = 0;

        for (const listing of listings) {
            try {
                const kaSummary = buildKavelArchitectSummary(listing);
                const kaArticle = buildKavelArchitectArticle(listing);
                const zwArticle = buildZwijsenArticle(listing);

                const { error } = await supabaseAdmin
                    .from('listings')
                    .update({
                        seo_summary: kaSummary,
                        seo_summary_ka: kaSummary,
                        seo_article_html: kaArticle,
                        seo_article_html_ka: kaArticle,
                        seo_article_html_zw: zwArticle,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('kavel_id', listing.kavel_id);

                if (error) {
                    console.error(`Failed to update ${listing.kavel_id}:`, error);
                    errors++;
                } else {
                    updated++;
                }
            } catch (e) {
                console.error(`Error processing ${listing.kavel_id}:`, e);
                errors++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `${updated} kavels bijgewerkt${errors > 0 ? `, ${errors} fouten` : ''}`,
            count: updated,
            errors,
        });
    } catch (error: any) {
        console.error('REGENERATE COPY ERROR:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
