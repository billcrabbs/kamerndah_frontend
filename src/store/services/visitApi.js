import { baseApi } from './api';

/**
 * Visit API Service.
 * Manages physical property audits/visits.
 */
export const visitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/visits - Schedule a new property audit
    scheduleVisit: builder.mutation({
      query: (visitData) => ({
        url: '/visits',
        method: 'POST',
        body: visitData, // { property_id, user_id, scheduled_date, visit_type, notes }
      }),
      invalidatesTags: (result, error, { property_id }) => [
        { type: 'Visit', id: 'LIST' },
        { type: 'Property', id: property_id }
      ],
    }),

    // GET /api/visits/user/:userId - Get all visits for a tenant
    getVisitsByUser: builder.query({
      query: (userId) => `/visits/user/${userId}`,
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ id }) => ({ type: 'Visit', id })), { type: 'Visit', id: 'LIST' }]
          : [{ type: 'Visit', id: 'LIST' }],
    }),

    // GET /api/visits/landlord/:landlordId - Get viewings for a landlord
    getVisitsByLandlord: builder.query({
      query: (landlordId) => `/visits/landlord/${landlordId}`,
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ id }) => ({ type: 'Visit', id })), { type: 'Visit', id: 'LIST' }]
          : [{ type: 'Visit', id: 'LIST' }],
    }),

    // PUT /api/visits/:id/status - Update visit status (Confirm/Cancel)
    updateVisitStatus: builder.mutation({
      query: ({ id, status, notes }) => ({
        url: `/visits/${id}/status`,
        method: 'PUT',
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Visit', id }],
    }),

    // GET /api/visits - Admin view of all visits
    getAllVisits: builder.query({
      query: (params) => ({
        url: '/visits',
        params, // ?status=
      }),
      providesTags: (result) => 
        result?.data 
          ? [...result.data.map(({ id }) => ({ type: 'Visit', id })), { type: 'Visit', id: 'LIST' }]
          : [{ type: 'Visit', id: 'LIST' }],
    }),

    // GET /api/visits/property/:propertyId - Track visits per property
    getVisitsByProperty: builder.query({
      query: (propertyId) => `/visits/property/${propertyId}`,
      providesTags: (result) => 
        result?.data 
          ? [...result.data.map(({ id }) => ({ type: 'Visit', id })), { type: 'Visit', id: 'LIST' }]
          : [{ type: 'Visit', id: 'LIST' }],
    }),

    // GET /api/visits/:id - Single visit detail
    getVisitById: builder.query({
      query: (id) => `/visits/${id}`,
      providesTags: (result, error, id) => [{ type: 'Visit', id }],
    }),
  }),
});

export const {
  useScheduleVisitMutation,
  useGetVisitsByUserQuery,
  useGetVisitsByLandlordQuery,
  useUpdateVisitStatusMutation,
  useGetAllVisitsQuery,
  useGetVisitsByPropertyQuery,
  useGetVisitByIdQuery,
} = visitApi;
