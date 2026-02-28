import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { listingId, price, description, email, name, metadata, productName } = body;

        const stripe = getStripe();

        if (!listingId || !email || !name) {
            return NextResponse.json(
                { success: false, error: 'Ontbrekende verplichte velden (listingId, email, name).' },
                { status: 400 }
            );
        }

        const amountInCents = Math.round(Number(price) * 100);
        if (!Number.isFinite(amountInCents) || amountInCents < 50) {
            return NextResponse.json(
                { success: false, error: 'Ongeldige prijs voor betaling.' },
                { status: 400 }
            );
        }

        const requestOrigin = req.headers.get('origin');
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestOrigin || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'ideal'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productName || 'KavelRapport',
                            description: description || `Rapport voor kavel ${listingId}`,
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            locale: 'nl',
            success_url: `${siteUrl}/betaling/succes?listingId=${listingId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/aanbod/${listingId}`,
            customer_email: email,
            metadata: {
                listingId,
                name,
                ...metadata,
            },
        });

        return NextResponse.json({
            success: true,
            checkoutUrl: session.url,
        });
    } catch (error: any) {
        console.error('Stripe Payment Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
