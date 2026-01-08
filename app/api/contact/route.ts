import { NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimit = new Map<string, { count: number; ts: number }>();

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.ts > RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

function formatList(value: string | string[] | undefined) {
  if (!value) return '';
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value;
}

function buildMessage(body: any) {
  const parts: string[] = [];

  if (body.provincies) parts.push(`Regio(s): ${formatList(body.provincies)}`);
  if (body.provincie) parts.push(`Regio: ${body.provincie}`);
  if (body.plaats) parts.push(`Plaats: ${body.plaats}`);
  if (body.min_oppervlakte) parts.push(`Min. oppervlakte: ${body.min_oppervlakte} m2`);
  if (body.bouwbudget) parts.push(`Budget: ${body.bouwbudget}`);
  if (body.maxPrijs) parts.push(`Max prijs: ${body.maxPrijs}`);
  if (body.type_wens) parts.push(`Woningtype: ${body.type_wens}`);
  if (body.tijdslijn) parts.push(`Tijdslijn: ${body.tijdslijn}`);
  if (body.kavel_type) parts.push(`Kavel type: ${body.kavel_type}`);
  if (body.opmerkingen) parts.push(`Opmerkingen: ${body.opmerkingen}`);
  if (body.early_access_rapport !== undefined) {
    parts.push(`Early access rapport: ${body.early_access_rapport ? 'ja' : 'nee'}`);
  }

  if (body.message) parts.push(`Bericht: ${body.message}`);

  return parts.length ? parts.join('\n') : 'KavelAlert aanmelding.';
}

export async function POST(req: Request) {
  try {
    const wordpressUrl = process.env.WORDPRESS_URL;
    const defaultFormId = process.env.CF7_FORM_ID;
    const quickscanFormId = process.env.CF7_QUICKSCAN_FORM_ID;

    if (!wordpressUrl || !defaultFormId) {
      return NextResponse.json(
        { success: false, message: 'WORDPRESS_URL of CF7_FORM_ID ontbreekt.' },
        { status: 500 }
      );
    }

    const body = await req.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Te veel aanvragen. Probeer het later opnieuw.' },
        { status: 429 }
      );
    }

    const email = body.email || body['your-email'];
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email verplicht.' }, { status: 400 });
    }

    const formType = body.formType || body['form-type'];
    const formId = formType === 'quickscan' && quickscanFormId ? quickscanFormId : defaultFormId;
    const formEndpoint = `${wordpressUrl.replace(/\/$/, '')}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

    const name = body.name || body['your-name'] || email.split('@')[0] || 'KavelAlert';
    const phone = body.telefoonnummer || body.phone || body['your-phone'] || '-';
    const message = body['your-message'] || buildMessage(body);
    const region = formatList(body.provincies || body.regio || body.provincie) || '';
    const location = body.locatie || body.plaats || body.location || '';

    const formData = new FormData();
    formData.append('your-name', name);
    formData.append('your-email', email);
    formData.append('your-phone', phone);
    formData.append('your-message', message);
    formData.append('regio', region);
    formData.append('locatie', location);
    formData.append('project-type', body.type_wens || body['project-type'] || '');
    formData.append('budget', body.bouwbudget || body.budget || body.maxPrijs || '');
    formData.append('timeframe', body.tijdslijn || body.timeframe || '');
    formData.append('has-location', body['has-location'] || (body.provincies ? 'ja' : 'nee'));
    formData.append('form-type', formType || 'kavelalert');
    formData.append('_wpcf7_unit_tag', `wpcf7-${formId}-${Date.now()}`);

    const response = await fetch(formEndpoint, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'CF7 request failed', details: data },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Onbekende fout' },
      { status: 500 }
    );
  }
}
