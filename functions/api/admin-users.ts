export const onRequestGet: PagesFunction = async (context) => {
  const SUPABASE_URL = context.env.SUPABASE_URL as string;
  const SUPABASE_SERVICE_ROLE_KEY = context.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const ADMIN_API_TOKEN = context.env.ADMIN_API_TOKEN as string | undefined;

  const headerToken = context.request.headers.get('x-admin-token') || '';
  if (ADMIN_API_TOKEN && headerToken !== ADMIN_API_TOKEN) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const rest = (path: string, init?: RequestInit) =>
    fetch(`${SUPABASE_URL}/rest/v1${path}`, {
      ...init,
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'count=exact',
        ...(init?.headers || {}),
      },
    });

  try {
    // Join auth.users (id,email) with user_plans, plus usage counts from products/catalogs
    const usersRes = await rest('/auth.users?select=id,email&limit=1000', { headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } });
    const users = await usersRes.json();

    const plansRes = await rest('/user_plans');
    const plans = await plansRes.json();
    const plansByUser: Record<string, any> = {};
    for (const p of plans || []) plansByUser[p.user_id] = p;

    const prodRes = await rest('/products?select=user_id,count=id&group=user_id');
    const catRes = await rest('/catalogs?select=user_id,count=id&group=user_id');
    const prod = await prodRes.json();
    const cat = await catRes.json();
    const prodByUser: Record<string, number> = {};
    const catByUser: Record<string, number> = {};
    for (const r of prod || []) prodByUser[r.user_id] = r.count;
    for (const r of cat || []) catByUser[r.user_id] = r.count;

    const rows = (users || []).map((u: any) => ({
      user_id: u.id,
      email: u.email,
      plan_id: plansByUser[u.id]?.plan_id || 'free',
      status: plansByUser[u.id]?.status || 'active',
      current_period_end: plansByUser[u.id]?.current_period_end || null,
      images: prodByUser[u.id] || 0,
      catalogs: catByUser[u.id] || 0,
    }));

    return new Response(JSON.stringify({ users: rows }), { headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || 'Failed to load users' }), { status: 500 });
  }
};


