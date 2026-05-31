/**
 * Next.js API Proxy Route
 *
 * This file proxies ALL requests from the frontend to the backend.
 * Because the proxy runs on the Next.js server (Node.js), it is:
 *   - Not subject to browser CORS restrictions
 *   - Not blocked by Ngrok's browser interstitial page
 *
 * Frontend calls:  GET /api/backend/properties
 * This proxy:      GET https://[ngrok-url]/api/properties  (server-to-server)
 *
 * To change the backend URL, update NEXT_PUBLIC_API_BASE_URL in .env.local
 * and restart the Next.js dev server.
 */

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
).trim();

async function proxyRequest(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path ?? [];
  const path = pathSegments.join('/');

  // Reconstruct query string from the incoming request
  const { search } = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/api/${path}${search}`;

  console.log(`[Proxy] ${request.method} ${targetUrl}`);

  // Build headers to forward to the backend
  const proxyHeaders = new Headers();
  proxyHeaders.set('Accept', 'application/json');
  proxyHeaders.set('Content-Type', 'application/json');

  // ✅ This is the key: sent server-to-server, always bypasses Ngrok interstitial
  proxyHeaders.set('ngrok-skip-browsing-warning', 'true');

  // Forward Authorization header if present (for authenticated requests)
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    proxyHeaders.set('Authorization', authHeader);
  }

  const fetchOptions = {
    method: request.method,
    headers: proxyHeaders,
  };

  // Forward request body for non-GET requests
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const body = await request.text();
    if (body) fetchOptions.body = body;
  }

  try {
    const backendResponse = await fetch(targetUrl, fetchOptions);
    const data = await backendResponse.json();

    return Response.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('[Proxy Error]', error.message);
    return Response.json(
      {
        success: false,
        error: 'Backend proxy request failed',
        message: error.message,
        targetUrl,
      },
      { status: 502 }
    );
  }
}

export const GET     = proxyRequest;
export const POST    = proxyRequest;
export const PUT     = proxyRequest;
export const DELETE  = proxyRequest;
export const PATCH   = proxyRequest;
