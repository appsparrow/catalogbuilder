// Simple test endpoint to debug Stripe connectivity
export const onRequest = async (context: any) => {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    // Test 1: Check environment variable
    if (!env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ 
        error: 'STRIPE_SECRET_KEY not found',
        test: 'env-check',
        status: 'failed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Test 2: Check Stripe API key format
    const keyPrefix = env.STRIPE_SECRET_KEY.substring(0, 7);
    if (!keyPrefix.startsWith('sk_test_') && !keyPrefix.startsWith('sk_live_')) {
      return new Response(JSON.stringify({ 
        error: 'Invalid Stripe key format',
        keyPrefix,
        test: 'key-format',
        status: 'failed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Test 3: Simple Stripe API call
    const response = await fetch('https://api.stripe.com/v1/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: 'Stripe API call failed',
        status: response.status,
        statusText: response.statusText,
        errorText,
        test: 'stripe-api',
        status: 'failed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accountData = await response.json();
    
    return new Response(JSON.stringify({ 
      message: 'All tests passed!',
      tests: {
        envCheck: 'passed',
        keyFormat: 'passed', 
        stripeApi: 'passed'
      },
      account: {
        id: accountData.id,
        country: accountData.country,
        default_currency: accountData.default_currency
      },
      status: 'success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Test failed',
      message: error?.message || 'Unknown error',
      test: 'catch-block',
      status: 'failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
