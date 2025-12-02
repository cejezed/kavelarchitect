const WP_API_URL = process.env.WP_ZWIJSEN_URL;
const WP_USER = process.env.WP_ZWIJSEN_USER;
const WP_PASSWORD = process.env.WP_ZWIJSEN_APP_PASSWORD;

export async function createWordPressPost(listing: any) {
    if (!WP_API_URL || !WP_USER || !WP_PASSWORD) {
        console.warn('WordPress credentials missing, skipping WP post creation');
        return null;
    }

    const auth = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');

    // 1. Upload Image (if exists)
    let featuredMediaId = 0;
    if (listing.image_url) {
        try {
            // Fetch image buffer
            const imgRes = await fetch(listing.image_url);
            const imgBuffer = await imgRes.arrayBuffer();

            const filename = `kavel-${listing.kavel_id}.jpg`;

            const uploadRes = await fetch(`${WP_API_URL}/wp-json/wp/v2/media`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Content-Type': 'image/jpeg'
                },
                body: Buffer.from(imgBuffer)
            });

            if (uploadRes.ok) {
                const mediaData = await uploadRes.json();
                featuredMediaId = mediaData.id;
            }
        } catch (e) {
            console.error('Failed to upload image to WP', e);
        }
    }

    // 2. Create Post
    const postData = {
        title: listing.seo_title || listing.adres,
        content: listing.seo_article_html || listing.seo_summary || 'Geen omschrijving.',
        status: 'publish',
        featured_media: featuredMediaId,
        meta: {
            // Add custom fields if needed (e.g. ACF or Yoast)
            // '_yoast_wpseo_title': listing.seo_title,
            // '_yoast_wpseo_metadesc': listing.seo_summary
        }
    };

    const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(`WP Post Failed: ${err.message}`);
    }

    return await res.json();
}
