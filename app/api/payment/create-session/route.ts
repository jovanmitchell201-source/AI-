// API route for Stripe payment integration
// File: app/api/payment/create-session/route.ts

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, email } = body;

    if (!items || items.length === 0) {
      return Response.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Convert cart items to Stripe line items
    const lineItems: LineItem[] = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/marketplace`,
      customer_email: email,
    });

    return Response.json(
      {
        success: true,
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Stripe error:', error);
    return Response.json(
      { error: error.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
