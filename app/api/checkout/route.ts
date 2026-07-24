import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, firstName, email, amount } = body as {
      topic?: string;
      firstName?: string;
      email?: string;
      amount?: number;
    };

    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_test_')) {
      return NextResponse.json(
        {
          error:
            'Stripe sandbox credentials are not configured. Add STRIPE_SECRET_KEY using a test-mode key to enable hosted checkout.',
        },
        { status: 500 },
      );
    }

    if (!topic || !firstName || !email || !amount) {
      return NextResponse.json({ error: 'Missing registration details.' }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecretKey);
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${topic} CEU Registration`,
              description: `Registration for ${topic} hosted by Heal & Harmony.`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        topic,
        firstName,
      },
      success_url: `${origin}/payment?status=success&topic=${encodeURIComponent(topic)}`,
      cancel_url: `${origin}/payment?status=cancelled&topic=${encodeURIComponent(topic)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      {
        error: 'Stripe checkout could not be completed. Please verify your sandbox key configuration.',
      },
      { status: 500 },
    );
  }
}
