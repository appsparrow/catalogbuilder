// Admin wipe endpoint (TESTING ONLY). DANGEROUS!
// POST JSON: { confirm: true, scope?: 'all' | 'storage' | 'db' }
// Requires env.ADMIN_TOKEN header: Authorization: Bearer <token>

export const onRequest: PagesFunction<{ R2_BUCKET: R2Bucket; ADMIN_TOKEN: string }> = async (context) => {
  const { request, env } = context as any;

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

  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.substring(7) : '';
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  }

  try {
    const { confirm, scope = 'all' } = await request.json();
    if (!confirm) {
      return new Response(JSON.stringify({ error: 'Confirmation required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    const results: any = { storage: null, db: null };

    if (scope === 'all' || scope === 'storage') {
      // Delete all objects from R2 bucket
      let cursor: string | undefined = undefined;
      let deleted = 0;
      do {
        const list = await env.R2_BUCKET.list({ cursor, limit: 1000 });
        cursor = list.truncated ? list.cursor : undefined;
        if (list.objects.length > 0) {
          await Promise.all(list.objects.map(obj => env.R2_BUCKET.delete(obj.key)));
          deleted += list.objects.length;
        }
      } while (cursor);
      results.storage = { deleted };
    }

    if (scope === 'all' || scope === 'db') {
      // Truncate application tables (order matters due to FKs)
      // NOTE: This assumes service role access is NOT available here. For safety, this is a no-op placeholder.
      // You should run the SQL below manually in Supabase SQL editor for a guaranteed wipe.
      results.db = { message: 'Run SQL wipe manually as described in README.', ok: true };
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Wipe failed' }), {
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
