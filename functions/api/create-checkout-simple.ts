// Simplified checkout session using official Stripe SDK
import Stripe from 'stripe';

export const onRequest = async (context: any) => {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { planId, userId, couponCode, billingInterval = 'month' } = await request.json();

    console.log('Simple checkout request:', { planId, userId, couponCode, billingInterval });

    if (!planId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe configuration missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use official Stripe SDK
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Plan configuration
    const plans = {
      starter: {
        monthly: { price: 1000, name: 'Starter Plan (Monthly)' },
        yearly: { price: 11000, name: 'Starter Plan (Yearly)' }
      }
    };

    const planConfig = plans[planId]?.[billingInterval];
    if (!planConfig) {
      return new Response(JSON.stringify({ error: 'Invalid plan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create or get customer
    let customer;
    try {
      const customers = await stripe.customers.list({ email: `${userId}@cuzata.app` });
      customer = customers.data[0];
      
      if (!customer) {
        customer = await stripe.customers.create({
          email: `${userId}@cuzata.app`,
          metadata: { userId }
        });
      }
    } catch (error) {
      console.error('Customer error:', error);
      throw error;
    }

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planConfig.name,
              description: 'Cuzata Starter Plan - Multiple catalogs and 1000 images',
            },
            unit_amount: planConfig.price,
            recurring: {
              interval: billingInterval === 'year' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/app?success=true`,
      cancel_url: `${request.headers.get('origin')}/app?canceled=true`,
      metadata: {
        userId,
        planId,
        interval: billingInterval
      },
    };

    // Add coupon if provided
    if (couponCode && couponCode.trim()) {
      sessionConfig.discounts = [{
        coupon: couponCode.trim().toUpperCase()
      }];
    }

    console.log('Creating session with config:', JSON.stringify(sessionConfig, null, 2));
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    console.log('Session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Simple checkout error:', error);
    return new Response(JSON.stringify({ 
      error: error?.message || 'Failed to create checkout session',
      details: error?.stack || 'No additional details'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
