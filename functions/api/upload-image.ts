// Cloudflare Pages Function: Upload image/file to R2 and return public URL
// Expects multipart/form-data with fields: file (File), prefix (string), filename (string, optional)

export const onRequest: PagesFunction<{ R2_BUCKET: R2Bucket; R2_PUBLIC_BASE_URL: string }> = async (context) => {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: buildCorsHeaders(request) });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...buildCorsHeaders(request),
      },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const prefix = (formData.get('prefix') as string) || 'uploads';
    const providedFilename = formData.get('filename') as string | null;

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'Missing file' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...buildCorsHeaders(request),
        },
      });
    }

    const safePrefix = prefix.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/\/+$/g, '');
    const filename = providedFilename && providedFilename.trim().length > 0
      ? providedFilename
      : `upload_${Date.now()}`;
    const key = `${safePrefix}/${filename}`;

    const body = await file.arrayBuffer();

    await env.R2_BUCKET.put(key, body, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
    });

    const base = env.R2_PUBLIC_BASE_URL;
    if (!base) {
      return new Response(JSON.stringify({
        error: 'R2_PUBLIC_BASE_URL is not configured',
        key,
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...buildCorsHeaders(request),
        },
      });
    }

    const url = `${base.replace(/\/$/, '')}/${key}`;

    return new Response(JSON.stringify({ url, key }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...buildCorsHeaders(request),
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Upload failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...buildCorsHeaders(request),
      },
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


