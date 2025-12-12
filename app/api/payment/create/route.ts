import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { listingId, price, description, email, name, metadata } = body;

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // Maak Stripe Checkout Session aan
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'ideal', 'paypal'], // Paypal vereist speciale activatie in Dashboard, Card voegt Google Pay/Apple Pay toe
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'KavelRapport™',
                            description: description || `Rapport voor kavel ${listingId}`,
                            // images: ['https://uwdomein.nl/assets/rapport-cover.jpg'], // Optioneel
                        },
                        unit_amount: Math.round(Number(price) * 100), // Stripe rekent in centen
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${siteUrl}/betaling/succes?listingId=${listingId}`,
            cancel_url: `${siteUrl}/aanbod/${listingId}`,
            customer_email: email,
            metadata: {
                listingId,
                name,
                ...metadata
            }
        });

        return NextResponse.json({
            success: true,
            checkoutUrl: session.url
        });

    } catch (error: any) {
        console.error('Stripe Payment Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
