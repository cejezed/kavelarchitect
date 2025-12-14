import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const WP_API_URL = process.env.WP_ZWIJSEN_URL;
const WP_USER = process.env.WP_ZWIJSEN_USER;
const WP_PASSWORD = process.env.WP_ZWIJSEN_PASS;

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!WP_API_URL || !WP_USER || !WP_PASSWORD) {
      return NextResponse.json({ ok: false, error: 'WordPress credentials missing' }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: 'Bestand ontbreekt' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ ok: false, error: 'Alleen afbeelding toegestaan' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filename = `kavel-${params.id}-${Date.now()}.jpg`;
    const auth = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');

    // Upload naar WordPress media
    const uploadRes = await fetch(`${WP_API_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': file.type || 'image/jpeg',
      },
      body: Buffer.from(arrayBuffer),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return NextResponse.json({ ok: false, error: `Upload naar WordPress mislukt: ${err}` }, { status: 500 });
    }

    const mediaData = await uploadRes.json();
    const sourceUrl = mediaData?.source_url;
    const mediaId = mediaData?.id;

    // Update listing met nieuwe featured_image_url en media_id
    const { error } = await supabaseAdmin
      .from('listings')
      .update({
        featured_image_url: sourceUrl,
        featured_media_id: mediaId,
        updated_at: new Date().toISOString(),
      })
      .eq('kavel_id', params.id);

    if (error) throw error;

    return NextResponse.json({ ok: true, featured_image_url: sourceUrl, featured_media_id: mediaId });
  } catch (err: any) {
    console.error('featured-image upload error', err);
    return NextResponse.json({ ok: false, error: err.message || 'Onbekende fout' }, { status: 500 });
  }
}
