import { baseApi } from './api';

/**
 * Property API Service.
 * Manages estate listings, landlord inventory, and property status.
 */
export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/properties - Get all verified properties
    getProperties: builder.query({
      query: (params) => ({
        url: '/properties',
        params, // { category: 'for-rent'|'for-sale', property_type, etc }
      }),
      providesTags: (result) => {
        const items = result?.data?.data || result?.data || [];
        return Array.isArray(items)
          ? [...items.map(({ id }) => ({ type: 'Property', id })), { type: 'Property', id: 'LIST' }]
          : [{ type: 'Property', id: 'LIST' }];
      },
    }),

    // GET /api/properties/:id - Get single detailed listing
    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),

    getPropertiesByLandlord: builder.query({
      query: (id) => `/properties/landlord/${id}`,
      providesTags: (result) => {
        const properties = result?.data?.data || result?.data || [];
        return Array.isArray(properties)
          ? [...properties.map(({ id }) => ({ type: 'Property', id })), { type: 'Property', id: 'LANDLORD_LIST' }]
          : [{ type: 'Property', id: 'LANDLORD_LIST' }];
      },
    }),

    // POST /api/properties - Create a new estate listing
    createProperty: builder.mutation({
      query: (propertyData) => ({
        url: '/properties',
        method: 'POST',
        body: propertyData,
      }),
      invalidatesTags: [{ type: 'Property', id: 'LIST' }, { type: 'Property', id: 'LANDLORD_LIST' }],
    }),

    // PUT /api/properties/:id/status - Update availability (verified, rented, sold)
    updatePropertyStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/properties/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetPropertiesByLandlordQuery,
  useCreatePropertyMutation,
  useUpdatePropertyStatusMutation,
} = propertyApi;
