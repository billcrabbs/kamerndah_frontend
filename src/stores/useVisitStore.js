import { create } from 'zustand';
import { visitsApi, transactionsApi, usersApi } from '@/lib/api/endpoints';

export const useVisitStore = create((set, get) => ({
  visits: [],
  loading: false,
  error: null,

  scheduleVisit: async (visitData) => {
    set({ loading: true, error: null });
    try {
      // First create user if needed
      let userId = visitData.user_id;
      if (!userId && visitData.email) {
        const userResponse = await usersApi.create({
          email: visitData.email,
          name: visitData.name,
          phone: visitData.phone,
          user_type: 'visitor'
        });
        userId = userResponse.data.data.id;
      }

      // Schedule the visit
      const visitResponse = await visitsApi.schedule({
        property_id: visitData.property_id,
        user_id: userId,
        scheduled_date: visitData.visitDate + 'T' + visitData.visitTime + ':00Z',
        visit_type: visitData.visitType,
        notes: visitData.notes,
        status: 'requested'
      });

      // Create transaction if it's a paid service
      if (visitData.visitType === 'concierge') {
        await transactionsApi.create({
          amount: 5000,
          transaction_type: 'concierge-service',
          property_id: visitData.property_id,
          user_id: userId,
          service_details: {
            visit_type: 'concierge',
            scheduled_date: visitData.visitDate + 'T' + visitData.visitTime + ':00Z',
            notes: visitData.notes
          },
          transaction_status: 'pending'
        });
      }

      return visitResponse.data.data;
    } catch (error) {
      console.error('Error scheduling visit:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to schedule visit';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  getUserVisits: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await visitsApi.getByUser(userId);
      if (response.data.success) {
        set({ visits: response.data.data });
      } else {
        throw new Error(response.data.error || 'Failed to fetch visits');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      set({ 
        visits: [],
        error: error.response?.data?.error || error.message || 'Failed to load visits'
      });
    } finally {
      set({ loading: false });
    }
  }
}));