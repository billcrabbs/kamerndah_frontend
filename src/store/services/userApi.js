import { baseApi } from './api';

/**
 * User API Service.
 * Manages user profiles, roles, and identity discovery.
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/users/:id - Get a user profile by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // GET /api/users/email/:email - Lookup user by email
    getUserByEmail: builder.query({
      query: (email) => `/users/email/${email}`,
    }),

    // POST /api/users - Create/Sync profile after Firebase Signup
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PUT /api/users/:id - Update user profile (Name, Phone, Bio, Role)
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' }
      ],
    }),

    // GET /api/users - Get all users (Admin only)
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // GET /api/users/type/:userType - Get users by type (landlord, renter)
    getUsersByType: builder.query({
      query: (userType) => `/users/type/${userType}`,
      providesTags: (result) => 
        result?.data 
          ? [...result.data.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // GET /api/users/phone/:phone - Lookup user by phone
    getUserByPhone: builder.query({
      query: (phone) => `/users/phone/${phone}`,
    }),

    // PUT /api/users/:id/role - Admin endpoint to set user roles
    setUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useLazyGetUserByIdQuery,
  useGetAllUsersQuery,
  useGetUsersByTypeQuery,
  useGetUserByPhoneQuery,
  useSetUserRoleMutation,
} = userApi;
