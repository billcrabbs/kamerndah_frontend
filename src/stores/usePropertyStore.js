import { create } from 'zustand';
import { propertiesApi } from '@/lib/api/endpoints';

export const usePropertyStore = create((set, get) => ({
  properties: [],
  featuredProperties: [],
  filters: { category: 'for-rent' },
  loading: false,
  selectedProperty: null,
  error: null,
  
  // === ACTIONS ===

  setProperties: (properties) => {
    console.log('🟢 setProperties called:', properties);
    set({ properties, error: null });
  },

  setFilters: (filters) => {
    console.log('⚙️ setFilters called with:', filters);
    set({ 
      filters: { ...get().filters, ...filters } 
    });
  },

  setLoading: (loading) => {
    console.log(`⏳ setLoading(${loading})`);
    set({ loading });
  },

  setSelectedProperty: (property) => {
    console.log('🏡 setSelectedProperty called:', property);
    set({ selectedProperty: property, error: null });
  },

  setError: (error) => {
    console.error('❌ setError called:', error);
    set({ error });
  },

  // === API CALLS ===

  fetchProperties: async (filters = {}) => {
    console.log('🌍 fetchProperties called with filters:', filters);
    set({ loading: true, error: null });
    try {
      console.log('📡 Hitting endpoint: propertiesApi.getAll()');
      const response = await propertiesApi.getAll(filters);
      console.log('✅ Response from getAll:', response.data);
      if (response.data.success) {
        const rawData = response.data.data;
        const items = Array.isArray(rawData) ? rawData : (rawData?.data || []);
        set({ properties: items });
      } else {
        throw new Error(response.data.error || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('🚨 Error fetching properties:', error);
      set({ 
        properties: [],
        error: error.response?.data?.error || error.message || 'Failed to load properties'
      });
    } finally {
      console.log('🏁 fetchProperties finished');
      set({ loading: false });
    }
  },

  fetchFeaturedProperties: async () => {
    console.log('🌟 fetchFeaturedProperties called');
    try {
      console.log('📡 Hitting endpoint: propertiesApi.getAll({ status: "verified", limit: 6 })');
      const response = await propertiesApi.getAll({ 
        status: 'verified' 
      });
      console.log('✅ Response from featured getAll:', response.data);
      if (response.data.success) {
        const rawData = response.data.data;
        const items = Array.isArray(rawData) ? rawData : (rawData?.data || []);
        set({ featuredProperties: items });
      }
    } catch (error) {
      console.error('🚨 Error fetching featured properties:', error);
      set({ featuredProperties: [] });
    }
  },

  fetchPropertyById: async (id) => {
    console.log(`🏠 fetchPropertyById called with ID: ${id}`);
    set({ loading: true, error: null });
    try {
      console.log(`📡 Hitting endpoint: propertiesApi.getById(${id})`);
      const response = await propertiesApi.getById(id);
      console.log('✅ Response from getById:', response.data);
      if (response.data.success) {
        set({ selectedProperty: response.data.data });
      } else {
        throw new Error(response.data.error || 'Property not found');
      }
    } catch (error) {
      console.error('🚨 Error fetching property:', error);
      set({ 
        selectedProperty: null,
        error: error.response?.data?.error || error.message || 'Failed to load property'
      });
    } finally {
      console.log('🏁 fetchPropertyById finished');
      set({ loading: false });
    }
  },

  fetchSimilarProperties: async (filters = {}) => {
    console.log('🏘️ fetchSimilarProperties called with filters:', filters);
    try {
      console.log('📡 Hitting endpoint: propertiesApi.getAll() for similar properties');
      const response = await propertiesApi.getAll({
        ...filters,
        status: 'verified',
        limit: 3
      });
      console.log('✅ Response from similar getAll:', response.data);
      if (response.data.success) {
        const rawData = response.data.data;
        return Array.isArray(rawData) ? rawData : (rawData?.data || []);
      }
      return [];
    } catch (error) {
      console.error('🚨 Error fetching similar properties:', error);
      return [];
    }
  },
}));
