// Cloudflare Pages Function: Cancel Stripe subscription and sync Supabase
export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context as any;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(request) });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json', ...corsHeaders(request) },
    });
  }

  try {
    const { subscriptionId } = await request.json();
    if (!subscriptionId) {
      return new Response(JSON.stringify({ message: 'Missing subscriptionId' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders(request) },
      });
    }

    const stripeSecret = env.STRIPE_SECRET_KEY as string;
    if (!stripeSecret) {
      return new Response(JSON.stringify({ message: 'Stripe not configured' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders(request) },
      });
    }

    // Set cancel_at_period_end on the subscription (safe default)
    const form = new URLSearchParams();
    form.append('cancel_at_period_end', 'true');
    const stripeResp = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });

    if (!stripeResp.ok) {
      const errText = await stripeResp.text();
      return new Response(JSON.stringify({ message: `Stripe error ${stripeResp.status}: ${errText}` }), {
        status: 502,
        headers: { 'content-type': 'application/json', ...corsHeaders(request) },
      });
    }

    // Sync Supabase subscription row
    const SUPABASE_URL = env.SUPABASE_URL as string;
    const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      await fetch(`${SUPABASE_URL}/rest/v1/user_subscriptions?stripe_subscription_id=eq.${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ cancel_at_period_end: true }),
      });
    }

    return new Response(null, { status: 204, headers: corsHeaders(request) });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || 'Failed to cancel subscription' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders(request) },
    });
  }
};

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Cloudflare Pages Function: Cancel Stripe Subscription (at period end)
// POST JSON: { subscriptionId: string }

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
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return new Response(JSON.stringify({ error: 'Missing subscriptionId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    if (!env.STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe configuration missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    // Set cancel_at_period_end = true (safer than immediate delete)
    const formData = new URLSearchParams();
    formData.append('cancel_at_period_end', 'true');

    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Stripe API error: ${response.status} ${errorText}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, subscription: { id: result.id, status: result.status, cancel_at_period_end: result.cancel_at_period_end } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Failed to cancel subscription' }), {
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
