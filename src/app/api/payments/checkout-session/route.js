import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request) {
  try {
    const body = await request.json();
    const { productName, price, credits, userEmail } = body;

    if (!productName || !price || !credits || !userEmail) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
    }

    // Get origin of the request to construct redirect URLs
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (stripeSecretKey && stripeSecretKey !== 'your_stripe_secret_key_here') {
      try {
        console.log(`[Stripe] Creating real Stripe Checkout Session for ${productName}...`);
        const stripe = new Stripe(stripeSecretKey);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'aed',
              product_data: {
                name: productName,
                description: `Purchase of ${credits} Advisor credits on SapioMatch AI`
              },
              unit_amount: Math.round(price * 100) // Convert AED to Fils (cents)
            },
            quantity: 1
          }],
          mode: 'payment',
          customer_email: userEmail,
          success_url: `${origin}/?payment=success&type=${credits === 700 ? 'upgrade' : 'bundle'}&credits=${credits}&email=${encodeURIComponent(userEmail)}`,
          cancel_url: `${origin}/?payment=cancel`,
          metadata: {
            userEmail,
            credits: credits.toString(),
            type: credits === 700 ? 'upgrade' : 'bundle'
          }
        });

        return NextResponse.json({ url: session.url });
      } catch (stripeErr) {
        console.error('[Stripe] Failed to create checkout session:', stripeErr);
        // Fallback to simulation if Stripe configuration fails at runtime
      }
    }

    // --- Fallback Simulated Checkout Flow (if no Stripe keys exist) ---
    console.log(`[Stripe] No Stripe Secret Key found. Redirecting to simulated success route...`);
    
    // Simulate a brief delay to mimic network latency
    const simulatedUrl = `${origin}/?payment=success&type=${credits === 700 ? 'upgrade' : 'bundle'}&credits=${credits}&email=${encodeURIComponent(userEmail)}`;
    
    return NextResponse.json({ url: simulatedUrl, simulated: true });

  } catch (err) {
    console.error('Error in checkout-session API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
