import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
        throw new Error("STRIPE_SECRET_KEY ontbreekt in de server environment.");
    }

    if (!stripeClient) {
        stripeClient = new Stripe(secretKey, {
            apiVersion: "2024-06-20" as any,
        });
    }

    return stripeClient;
}
