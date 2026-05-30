import { baseApi } from './api';

/**
 * Booking API Service.
 * Manages final lease and purchase agreements.
 */
export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/bookings - Finalize a lease or purchase
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData, // { property_id, booking_type, move_in_date, etc }
      }),
      invalidatesTags: (result, error, { property_id }) => [
        { type: 'Booking', id: 'LIST' },
        { type: 'Property', id: property_id }
      ],
    }),

    // GET /api/bookings/user/:userId - Get active agreements for a user
    getBookingsByUser: builder.query({
      query: (userId) => `/bookings/user/${userId}`,
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ id }) => ({ type: 'Booking', id })), { type: 'Booking', id: 'LIST' }]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    // GET /api/bookings/landlord/:landlordId - Get property bookings for owners
    getBookingsByLandlord: builder.query({
      query: (landlordId) => `/bookings/landlord/${landlordId}`,
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ id }) => ({ type: 'Booking', id })), { type: 'Booking', id: 'LIST' }]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    // GET /api/bookings - Admin view of all bookings
    getAllBookings: builder.query({
      query: (params) => ({
        url: '/bookings',
        params, // Supports ?status= filtering
      }),
      providesTags: (result) => 
        result?.data 
          ? [...result.data.map(({ id }) => ({ type: 'Booking', id })), { type: 'Booking', id: 'LIST' }]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    // GET /api/bookings/:id - Single booking details
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // PUT /api/bookings/:id/status - Update booking status
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
        { type: 'Property', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsByUserQuery,
  useGetBookingsByLandlordQuery,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
} = bookingApi;
