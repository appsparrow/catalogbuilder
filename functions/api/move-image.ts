// Cloudflare Pages Function: Move an object within R2 (copy then delete)
// POST JSON: { fromKey: string, toKey: string }

export const onRequest: PagesFunction<{ R2_BUCKET: R2Bucket; R2_PUBLIC_BASE_URL: string }> = async (context) => {
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
    const body = await request.json().catch(() => ({}));
    const fromKey = body.fromKey as string;
    const toKey = body.toKey as string;

    if (!fromKey || !toKey) {
      return new Response(JSON.stringify({ error: 'fromKey and toKey are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    // Copy then delete
    const object = await env.R2_BUCKET.get(fromKey);
    if (!object) {
      return new Response(JSON.stringify({ error: 'Source not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
      });
    }

    const contentType = object.httpMetadata?.contentType || 'application/octet-stream';
    const data = await object.arrayBuffer();

    await env.R2_BUCKET.put(toKey, data, { httpMetadata: { contentType } });
    await env.R2_BUCKET.delete(fromKey);

    const base = env.R2_PUBLIC_BASE_URL;
    const url = `${base.replace(/\/$/, '')}/${toKey}`;

    return new Response(JSON.stringify({ url, key: toKey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request) },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Move failed' }), {
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


