import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API Service for KamerNdah.
 * Configured to connect to the backend tunnel via ngrok with the /api prefix.
 */
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    // Adding the /api suffix as requested/standard for this backend
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://67ed-105-113-121-43.ngrok-free.app'}/api`,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = getState().auth.idToken;
      
      // If we have a token, set the Authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Required to bypass the ngrok interstitial warning page which causes CORS issues
      headers.set('ngrok-skip-browsing-warning', 'true');
      headers.set('Accept', 'application/json');
      
      // Cache-busting: prevent stale 304 responses
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

      // Identifying as a standard browser to satisfy ngrok's security filters
      headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      return headers;
    },
  }),
  tagTypes: ['Property', 'User', 'Booking', 'Visit', 'Like', 'Transaction'],
  endpoints: () => ({}),
});
