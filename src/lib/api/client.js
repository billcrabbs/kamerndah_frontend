import axios from 'axios';

/**
 * Axios API Client for KamerNdah.
 *
 * Uses the Next.js proxy at /api/backend so all requests are same-origin.
 * The proxy forwards them server-to-server to the real backend,
 * completely bypassing browser CORS and the Ngrok interstitial page.
 *
 * To change the backend URL, update NEXT_PUBLIC_API_BASE_URL in .env.local
 * and restart the Next.js dev server.
 */
export const apiClient = axios.create({
  // ✅ Proxy route — same origin, zero CORS issues
  baseURL: '/api/backend',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — attach auth token if available
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — surface errors cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);