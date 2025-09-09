export const onRequestGet: PagesFunction = async (context) => {
  const SUPABASE_URL = context.env.SUPABASE_URL as string;
  const SUPABASE_SERVICE_ROLE_KEY = context.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const ADMIN_API_TOKEN = context.env.ADMIN_API_TOKEN as string | undefined;

  // Simple admin guard using header token to avoid exposing service key
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

  const getCountFromContentRange = (res: Response) => {
    const range = res.headers.get('content-range');
    if (!range) return null;
    const total = range.split('/')[1];
    return total ? parseInt(total, 10) : null;
  };

  try {
    // Totals via HEAD requests
    const [prodHead, catHead, subsHead] = await Promise.all([
      rest('/products?select=id', { method: 'HEAD' }),
      rest('/catalogs?select=id', { method: 'HEAD' }),
      rest('/user_subscriptions?select=id', { method: 'HEAD' }),
    ]);

    const totalProducts = getCountFromContentRange(prodHead) ?? 0;
    const totalCatalogs = getCountFromContentRange(catHead) ?? 0;
    const totalSubscriptions = getCountFromContentRange(subsHead) ?? 0;

    // Active subs and plan breakdown
    const subsRes = await rest('/user_subscriptions?select=plan_id,status');
    const subsList = await subsRes.json();
    const planBreakdown: Record<string, { active: number; canceled: number; past_due: number; unpaid: number }> = {};
    let activeSubscriptions = 0;
    for (const row of subsList || []) {
      const plan = row.plan_id || 'unknown';
      if (!planBreakdown[plan]) {
        planBreakdown[plan] = { active: 0, canceled: 0, past_due: 0, unpaid: 0 };
      }
      const st = (row.status || 'unknown') as keyof typeof planBreakdown[string];
      if (st in planBreakdown[plan]) (planBreakdown[plan] as any)[st]++;
      if (row.status === 'active') activeSubscriptions++;
    }

    // Top users by products and catalogs
    const topProductsRes = await rest('/products?select=user_id,count=id&group=user_id&order=count.desc&limit=10');
    const topCatalogsRes = await rest('/catalogs?select=user_id,count=id&group=user_id&order=count.desc&limit=10');
    const topProducts = await topProductsRes.json();
    const topCatalogs = await topCatalogsRes.json();

    const payload = {
      totals: {
        totalProducts,
        totalCatalogs,
        totalSubscriptions,
        activeSubscriptions,
      },
      breakdown: planBreakdown,
      topProducts,
      topCatalogs,
    };

    return new Response(JSON.stringify(payload), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err?.message || 'Failed to load analytics' }), { status: 500 });
  }
};


