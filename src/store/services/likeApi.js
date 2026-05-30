import { baseApi } from './api';

/**
 * Like API Service.
 * Handles property liking, unliking and status checking.
 */
export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/likes - Like a property
    likeProperty: builder.mutation({
      query: (data) => ({
        url: '/likes',
        method: 'POST',
        body: data, // { user_id, property_id }
      }),
      invalidatesTags: (result, error, { property_id }) => [
        { type: 'Property', id: property_id },
        { type: 'Property', id: 'LIST' },
        { type: 'Like', id: 'USER_LIST' }
      ],
    }),

    // DELETE /api/likes - Unlike a property
    unlikeProperty: builder.mutation({
      query: (data) => ({
        url: '/likes',
        method: 'DELETE',
        body: data, // { user_id, property_id }
      }),
      invalidatesTags: (result, error, { property_id }) => [
        { type: 'Property', id: property_id },
        { type: 'Property', id: 'LIST' },
        { type: 'Like', id: 'USER_LIST' }
      ],
    }),

    // GET /api/likes/check - Check if user liked a property
    checkLikeStatus: builder.query({
      query: ({ user_id, property_id }) => ({
        url: '/likes/check',
        params: { user_id, property_id },
      }),
      providesTags: (result, error, { property_id }) => [
        { type: 'Like', id: `CHECK_${property_id}` }
      ],
    }),

    // GET /api/likes/user/:userId - Get user's liked properties
    getUserLikes: builder.query({
      query: (userId) => `/likes/user/${userId}`,
      transformResponse: (response) => response?.data || [],
      providesTags: [{ type: 'Like', id: 'USER_LIST' }],
    }),

    // GET /api/likes/property/:propertyId/count - Get property likes count
    getPropertyLikesCount: builder.query({
      query: (propertyId) => `/likes/property/${propertyId}/count`,
      providesTags: (result, error, propertyId) => [
        { type: 'Property', id: propertyId }
      ],
    }),
  }),
});

export const {
  useLikePropertyMutation,
  useUnlikePropertyMutation,
  useCheckLikeStatusQuery,
  useGetUserLikesQuery,
  useGetPropertyLikesCountQuery,
} = likeApi;
