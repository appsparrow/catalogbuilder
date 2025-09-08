// Cloudflare Pages Function: Create Stripe Checkout Session
// POST JSON: { planId: string, userId: string, couponCode?: string }

export const onRequest = async (context: any) => {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: buildCorsHeaders(request) });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  }

  try {
    const { planId, userId, couponCode } = await request.json();

    if (!planId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    // Initialize Stripe (simplified for Cloudflare Workers)
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    // Plan configuration
    const plans = {
      starter: {
        monthly: { price: 1000, name: 'Starter Plan (Monthly)' }, // $10/month
      }
    };

    const planConfig = plans[planId]?.monthly; // Only monthly for now
    if (!planConfig) {
      return new Response(JSON.stringify({ error: 'Invalid plan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    // Create or get Stripe customer
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
      console.error('Error creating/getting customer:', error);
      return new Response(JSON.stringify({ error: 'Failed to create customer' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    // Create checkout session
    const sessionConfig: any = {
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
              interval: 'month',
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
        interval: 'month'
      },
    };

    // Validate coupon if provided
    if (couponCode && couponCode.trim()) {
      const trimmedCouponCode = couponCode.trim().toUpperCase();
      
      try {
        // First validate the coupon exists and is valid
        const coupon = await stripe.coupons.retrieve(trimmedCouponCode);
        
        // Check if coupon is valid (not expired, not deleted, etc.)
        if (!coupon.valid) {
          return new Response(JSON.stringify({ 
            error: 'Invalid coupon code',
            code: 'INVALID_COUPON',
            message: 'The coupon code you entered is not valid or has expired'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
          });
        }
        
        // Add valid coupon to session config
        sessionConfig.discounts = [{
          coupon: trimmedCouponCode
        }];
      } catch (couponError: any) {
        // Handle coupon not found or other coupon-related errors
        if (couponError.message?.includes('No such coupon') || couponError.message?.includes('No such promotion')) {
          return new Response(JSON.stringify({ 
            error: 'Invalid coupon code',
            code: 'INVALID_COUPON',
            message: 'The coupon code you entered does not exist'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
          });
        }
        
        // Re-throw other coupon errors
        throw couponError;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to create checkout session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  }
};

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Simplified Stripe implementation for Cloudflare Workers
class Stripe {
  constructor(private secretKey: string) {}

  customers = {
    list: async (params: any) => {
      const queryParams = new URLSearchParams();
      if (params.email) {
        queryParams.append('email', params.email);
      }
      
      const url = `https://api.stripe.com/v1/customers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stripe API error: ${response.status} ${errorText}`);
      }
      
      return { data: await response.json() };
    },
    create: async (params: any) => {
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            formData.append(`${key}[${subKey}]`, String(subValue));
          }
        } else {
          formData.append(key, String(value));
        }
      }

      const response = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stripe API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    }
  };

  coupons = {
    retrieve: async (couponId: string) => {
      const response = await fetch(`https://api.stripe.com/v1/coupons/${couponId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stripe API error: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    }
  };

  checkout = {
    sessions: {
      create: async (params: any) => {
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (key === 'line_items' && Array.isArray(value)) {
            value.forEach((item: any, index: number) => {
              for (const [itemKey, itemValue] of Object.entries(item)) {
                if (itemKey === 'price_data' && typeof itemValue === 'object' && itemValue !== null) {
                  for (const [priceKey, priceValue] of Object.entries(itemValue)) {
                    if (priceKey === 'recurring' && typeof priceValue === 'object' && priceValue !== null) {
                      for (const [recurKey, recurValue] of Object.entries(priceValue)) {
                        formData.append(`line_items[${index}][price_data][recurring][${recurKey}]`, String(recurValue));
                      }
                    } else if (priceKey === 'product_data' && typeof priceValue === 'object' && priceValue !== null) {
                      for (const [prodKey, prodValue] of Object.entries(priceValue)) {
                        formData.append(`line_items[${index}][price_data][product_data][${prodKey}]`, String(prodValue));
                      }
                    } else {
                      formData.append(`line_items[${index}][price_data][${priceKey}]`, String(priceValue));
                    }
                  }
                } else {
                  formData.append(`line_items[${index}][${itemKey}]`, String(itemValue));
                }
              }
            });
          } else if (key === 'metadata' && typeof value === 'object' && value !== null) {
            for (const [metaKey, metaValue] of Object.entries(value)) {
              formData.append(`metadata[${metaKey}]`, String(metaValue));
            }
          } else if (key === 'payment_method_types' && Array.isArray(value)) {
            // Handle payment_method_types array properly
            value.forEach((method, index) => {
              formData.append(`payment_method_types[${index}]`, String(method));
            });
          } else if (key === 'discounts' && Array.isArray(value)) {
            // Handle discounts array properly
            value.forEach((discount, index) => {
              if (typeof discount === 'object' && discount !== null) {
                for (const [discountKey, discountValue] of Object.entries(discount)) {
                  formData.append(`discounts[${index}][${discountKey}]`, String(discountValue));
                }
              }
            });
          } else {
            formData.append(key, String(value));
          }
        }

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Stripe API error: ${response.status} ${errorText}`);
        }
        
        return await response.json();
      }
    }
  };
}

