import { baseApi } from './api';

/**
 * Transaction API Service.
 * Manages financial payments, revenue summaries, and accounting for audits/bookings.
 */
export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/transactions/user/:userId - Get payment history for a client
    getTransactionsByUser: builder.query({
      query: (userId) => `/transactions/user/${userId}`,
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ id }) => ({ type: 'Transaction', id })), { type: 'Transaction', id: 'LIST' }]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    // GET /api/transactions/landlord/:landlordId - Get payout/earning history for an owner
    getTransactionsByLandlord: builder.query({
      query: (landlordId) => `/transactions/landlord/${landlordId}`,
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ id }) => ({ type: 'Transaction', id })), { type: 'Transaction', id: 'LIST' }]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    // POST /api/transactions - Create a new payment (MTN/Orange Mobile Money)
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: '/transactions',
        method: 'POST',
        body: transactionData, // { amount, currency, payment_method, type, reference_id }
      }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
    }),

    // GET /api/transactions/revenue-summary - Admin overview of PWA revenue
    getRevenueSummary: builder.query({
      query: () => '/transactions/revenue-summary',
      providesTags: [{ type: 'Transaction', id: 'SUMMARY' }],
    }),

    // GET /api/transactions - Admin view of all platform transactions
    getAllTransactions: builder.query({
      query: (params) => ({
        url: '/transactions',
        params, // ?status=, ?type=
      }),
      providesTags: (result) => 
        result?.data 
          ? [...result.data.map(({ id }) => ({ type: 'Transaction', id })), { type: 'Transaction', id: 'LIST' }]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    // GET /api/transactions/:id - View single transaction details
    getTransactionById: builder.query({
      query: (id) => `/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transaction', id }],
    }),

    // PUT /api/transactions/:id/status - Admin updating payment status
    updateTransactionStatus: builder.mutation({
      query: ({ id, status, reference_id }) => ({
        url: `/transactions/${id}/status`,
        method: 'PUT',
        body: { status, reference_id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transaction', id },
        { type: 'Transaction', id: 'LIST' },
        { type: 'Transaction', id: 'SUMMARY' }
      ],
    }),
  }),
});

export const {
  useGetTransactionsByUserQuery,
  useGetTransactionsByLandlordQuery,
  useCreateTransactionMutation,
  useGetRevenueSummaryQuery,
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useUpdateTransactionStatusMutation,
} = transactionApi;
