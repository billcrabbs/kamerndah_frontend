import { apiClient } from './client';

// Helper to log API requests & responses
const logRequest = async (label, fn) => {
  try {
    console.log(`🟢 [API REQUEST]: ${label}`);
    const response = await fn();
    console.log(`✅ [API SUCCESS]: ${label}`, {
      status: response.status,
      data: response.data,
    });
    return response;
  } catch (error) {
    console.error(`❌ [API ERROR]: ${label}`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// ==================== PROPERTIES API ====================
export const propertiesApi = {
  getAll: (params) =>
    logRequest(`/properties (GET) with params`, () =>
      apiClient.get('/properties', { params })
    ),

  getById: (id) =>
    logRequest(`/properties/${id} (GET)`, () =>
      apiClient.get(`/properties/${id}`)
    ),

  create: (data) =>
    logRequest(`/properties (POST)`, () =>
      apiClient.post('/properties', data)
    ),

  updateStatus: (id, data) =>
    logRequest(`/properties/${id}/status (PUT)`, () =>
      apiClient.put(`/properties/${id}/status`, data)
    ),

  getByLandlord: (landlordId) =>
    logRequest(`/properties/landlord/${landlordId} (GET)`, () =>
      apiClient.get(`/properties/landlord/${landlordId}`)
    ),
};

// ==================== USERS API ====================
export const usersApi = {
  getAll: () => logRequest(`/users (GET)`, () => apiClient.get('/users')),

  getById: (id) =>
    logRequest(`/users/${id} (GET)`, () => apiClient.get(`/users/${id}`)),

  getByEmail: (email) =>
    logRequest(`/users/email/${email} (GET)`, () =>
      apiClient.get(`/users/email/${email}`)
    ),

  getByPhone: (phone) =>
    logRequest(`/users/phone/${phone} (GET)`, () =>
      apiClient.get(`/users/phone/${phone}`)
    ),

  create: (data) =>
    logRequest(`/users (POST)`, () => apiClient.post('/users', data)),

  update: (id, data) =>
    logRequest(`/users/${id} (PUT)`, () => apiClient.put(`/users/${id}`, data)),

  convertToLandlord: (id) =>
    logRequest(`/users/${id}/convert-landlord (PUT)`, () =>
      apiClient.put(`/users/${id}/convert-landlord`)
    ),
};

// ==================== TRANSACTIONS API ====================
export const transactionsApi = {
  getAll: () => logRequest(`/transactions (GET)`, () => apiClient.get('/transactions')),

  getById: (id) =>
    logRequest(`/transactions/${id} (GET)`, () =>
      apiClient.get(`/transactions/${id}`)
    ),

  getByUser: (userId) =>
    logRequest(`/transactions/user/${userId} (GET)`, () =>
      apiClient.get(`/transactions/user/${userId}`)
    ),

  getByLandlord: (landlordId) =>
    logRequest(`/transactions/landlord/${landlordId} (GET)`, () =>
      apiClient.get(`/transactions/landlord/${landlordId}`)
    ),

  create: (data) =>
    logRequest(`/transactions (POST)`, () =>
      apiClient.post('/transactions', data)
    ),

  updateStatus: (id, data) =>
    logRequest(`/transactions/${id}/status (PUT)`, () =>
      apiClient.put(`/transactions/${id}/status`, data)
    ),
};

// ==================== LIKES API ====================
export const likesApi = {
  like: (data) =>
    logRequest(`/likes (POST)`, () => apiClient.post('/likes', data)),

  unlike: (data) =>
    logRequest(`/likes (DELETE)`, () => apiClient.delete('/likes', { data })),

  check: (params) =>
    logRequest(`/likes/check (GET)`, () =>
      apiClient.get('/likes/check', { params })
    ),

  getUserLikes: (userId) =>
    logRequest(`/likes/user/${userId} (GET)`, () =>
      apiClient.get(`/likes/user/${userId}`)
    ),

  getPropertyLikesCount: (propertyId) =>
    logRequest(`/likes/property/${propertyId}/count (GET)`, () =>
      apiClient.get(`/likes/property/${propertyId}/count`)
    ),
};

// ==================== VISITS API ====================
export const visitsApi = {
  getAll: () => logRequest(`/visits (GET)`, () => apiClient.get('/visits')),

  getById: (id) =>
    logRequest(`/visits/${id} (GET)`, () =>
      apiClient.get(`/visits/${id}`)
    ),

  getByUser: (userId) =>
    logRequest(`/visits/user/${userId} (GET)`, () =>
      apiClient.get(`/visits/user/${userId}`)
    ),

  getByProperty: (propertyId) =>
    logRequest(`/visits/property/${propertyId} (GET)`, () =>
      apiClient.get(`/visits/property/${propertyId}`)
    ),

  getByLandlord: (landlordId) =>
    logRequest(`/visits/landlord/${landlordId} (GET)`, () =>
      apiClient.get(`/visits/landlord/${landlordId}`)
    ),

  schedule: (data) =>
    logRequest(`/visits (POST)`, () =>
      apiClient.post('/visits', data)
    ),

  updateStatus: (id, data) =>
    logRequest(`/visits/${id}/status (PUT)`, () =>
      apiClient.put(`/visits/${id}/status`, data)
    ),
};
