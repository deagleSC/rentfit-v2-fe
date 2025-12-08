import { create } from 'zustand';
import type { PropertyState, PropertyActions } from '@/types/property';
import {
  getPropertiesAction,
  getPropertyAction,
  clearErrorAction,
  setLoadingAction,
  clearSelectedPropertyAction,
} from '@/zustand/actions/property-actions';

/**
 * Property store using Zustand
 * Manages property state and actions
 */

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,
};

export const usePropertyStore = create<PropertyState & PropertyActions>()((set) => {
  return {
    // Initial state
    ...initialState,

    // Property actions
    getProperties: async (params) => {
      try {
        await getPropertiesAction(params, set);
      } catch (error) {
        // Error is already handled by handleError in services
        set({ isLoading: false });
        throw error;
      }
    },
    getProperty: async (propertyId) => {
      try {
        await getPropertyAction(propertyId, set);
      } catch (error) {
        // Error is already handled by handleError in services
        set({ isLoading: false });
        throw error;
      }
    },
    clearError: () => clearErrorAction(set),
    setLoading: (loading: boolean) => setLoadingAction(loading, set),
    clearSelectedProperty: () => clearSelectedPropertyAction(set),
  };
});
