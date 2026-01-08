import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { AnalysisType, Goal, KavelrapportIntakeRequest, Stage, TimeHorizon } from '@/types/kavelrapport';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const hasSupabase =
  !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validStage: Stage[] = ['orientation', 'considering_offer', 'offer_made'];
const validHorizon: TimeHorizon[] = ['0_6', '6_12', '12_plus'];
const validGoal: Goal[] = ['renovate', 'rebuild', 'unsure'];
const wordpressUrl = process.env.WORDPRESS_URL;
const intakeFormId = process.env.CF7_INTAKE_FORM_ID || process.env.CF7_FORM_ID;

function buildCf7Message(payload: KavelrapportIntakeRequest) {
  return [
    `Analyse type: ${payload.analysisType}`,
    `Adres: ${payload.address}`,
    payload.link ? `Link: ${payload.link}` : null,
    `Fase: ${payload.stage}`,
    `Tijdshorizon: ${payload.timeHorizon}`,
    `Email: ${payload.email}`,
    payload.goal ? `Doel: ${payload.goal}` : null,
    payload.notes ? `Opmerkingen: ${payload.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendToCf7(payload: KavelrapportIntakeRequest) {
  if (!wordpressUrl || !intakeFormId) {
    console.warn('CF7 intake not configured - skipping WP send');
    return;
  }

  const endpoint = `${wordpressUrl.replace(/\/$/, '')}/wp-json/contact-form-7/v1/contact-forms/${intakeFormId}/feedback`;
  const formData = new FormData();
  formData.append('your-name', payload.email.split('@')[0] || 'KavelRapport intake');
  formData.append('your-email', payload.email);
  formData.append('your-phone', '');
  formData.append('your-message', buildCf7Message(payload));
  formData.append('locatie', payload.address);
  formData.append('regio', '');
  formData.append('project-type', payload.analysisType);
  formData.append('budget', '');
  formData.append('timeframe', payload.timeHorizon);
  formData.append('has-location', 'ja');
  formData.append('form-type', 'kavelrapport-intake');
  formData.append('_wpcf7_unit_tag', `wpcf7-${intakeFormId}-${Date.now()}`);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('CF7 intake failed', data);
  }
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function validate(body: any): { ok: true; data: KavelrapportIntakeRequest } | { ok: false; error: string } {
  const {
    analysisType,
    address,
    link,
    stage,
    timeHorizon,
    email,
    notes,
    goal,
  } = body || {};

  if (!analysisType || !['plot', 'existing_property'].includes(analysisType)) return { ok: false, error: 'analysisType verplicht' };
  if (!address || typeof address !== 'string' || !address.trim()) return { ok: false, error: 'Adres is verplicht' };
  if (analysisType === 'plot' && (!link || typeof link !== 'string' || !link.trim())) {
    return { ok: false, error: 'Link is verplicht' };
  }
  if (!validStage.includes(stage)) return { ok: false, error: 'Ongeldige fase' };
  if (!validHorizon.includes(timeHorizon)) return { ok: false, error: 'Ongeldige tijdshorizon' };
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) return { ok: false, error: 'Ongeldig e-mailadres' };
  if (notes && (typeof notes !== 'string' || notes.length > 500)) return { ok: false, error: 'Opmerkingen max 500 tekens' };
  if (analysisType === 'existing_property' && goal && !validGoal.includes(goal)) return { ok: false, error: 'Ongeldig doel' };

  const payload: KavelrapportIntakeRequest = {
    analysisType,
    address: address.trim(),
    link: (link || '').trim(),
    stage,
    timeHorizon,
    email: email.trim(),
    notes: notes?.trim() || undefined,
    goal: analysisType === 'existing_property' ? goal || undefined : undefined,
  };

  return { ok: true, data: payload };
}

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validation = validate(json);
    if (!validation.ok) {
      return errorResponse(validation.error);
    }
    const payload = validation.data;

    // Persist (Supabase if available)
    if (hasSupabase) {
      try {
        const { error } = await supabaseAdmin.from('kavelrapport_intakes').insert({
          analysis_type: payload.analysisType,
          address: payload.address,
          link: payload.link,
          stage: payload.stage,
          time_horizon: payload.timeHorizon,
          email: payload.email,
          goal: payload.goal || null,
          notes: payload.notes || null,
          status: 'new',
        });
        if (error) {
          console.error('Failed to insert intake', error);
        }
      } catch (err) {
        console.error('Supabase insert error', err);
      }
    } else {
      console.warn('Supabase credentials missing - intake not persisted');
    }

    // Send to CF7
    await sendToCf7(payload);

    // Emails (if Resend configured)
    const adminEmail = process.env.INTAKE_ADMIN_EMAIL || process.env.RESEND_FROM || 'info@kavelarchitect.nl';
    const fromEmail = process.env.RESEND_FROM || 'no-reply@kavelarchitect.nl';

    if (resend && adminEmail && fromEmail) {
      try {
        // Admin mail
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: 'Nieuwe KavelRapport intake',
          html: `
            <h2>Nieuwe KavelRapport intake</h2>
            <ul>
              <li><strong>Type:</strong> ${payload.analysisType}</li>
              <li><strong>Adres:</strong> ${payload.address}</li>
              <li><strong>Link:</strong> ${payload.link}</li>
              <li><strong>Fase:</strong> ${payload.stage}</li>
              <li><strong>Tijdshorizon:</strong> ${payload.timeHorizon}</li>
              <li><strong>Email:</strong> ${payload.email}</li>
              ${payload.goal ? `<li><strong>Doel:</strong> ${payload.goal}</li>` : ''}
              ${payload.notes ? `<li><strong>Opmerkingen:</strong> ${payload.notes}</li>` : ''}
            </ul>
          `,
        });

        // User confirmation
        await resend.emails.send({
          from: fromEmail,
          to: payload.email,
          subject: 'Bevestiging intake KavelRapport',
          html: `
            <p>Bedankt voor uw aanvraag voor het KavelRapportƒ"½.</p>
            <p>Wij beoordelen uw gegevens en sturen u een voorstel met vervolgstappen.</p>
            <p>Samenvatting:</p>
            <ul>
              <li><strong>Type:</strong> ${payload.analysisType}</li>
              <li><strong>Adres:</strong> ${payload.address}</li>
              <li><strong>Link:</strong> ${payload.link}</li>
            </ul>
          `,
        });
      } catch (err) {
        console.error('Resend error', err);
      }
    } else {
      console.warn('Resend not configured - no emails sent');
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Intake handler error', err);
    return errorResponse('Onbekende fout', 500);
  }
}
