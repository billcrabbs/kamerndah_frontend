import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API Service for KamerNdah.
 *
 * Requests go through the Next.js proxy at /api/backend/*.
 * The proxy forwards them server-to-server to the real backend,
 * completely bypassing CORS restrictions and the Ngrok interstitial page.
 */
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    // ✅ Proxy route — same origin, zero CORS issues
    baseUrl: '/api/backend',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.idToken;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Property', 'User', 'Booking', 'Visit', 'Like', 'Transaction'],
  endpoints: () => ({}),
});