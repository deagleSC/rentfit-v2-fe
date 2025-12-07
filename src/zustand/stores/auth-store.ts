import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthActions } from '@/types/auth';
import {
  registerAction,
  loginAction,
  googleLoginAction,
  logoutAction,
  clearErrorAction,
  setLoadingAction,
  getCurrentUserProfileAction,
  updateProfileAction,
} from '@/zustand/actions/auth-actions';
import { getAuthToken } from '@/lib/api-client';

/**
 * Auth store using Zustand
 * Manages authentication state and actions
 */

const initialState: AuthState = {
  user: null,
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => {
      return {
        // Initial state
        ...initialState,

        // Auth actions
        register: async (name: string, email: string, password: string) => {
          try {
            await registerAction(name, email, password, set);
          } catch (error) {
            // Error is already handled by handleError in services
            // Update loading state and re-throw so caller knows registration failed
            set({ isLoading: false, isAuthenticated: false });
            throw error;
          }
        },
        login: async (email: string, password: string, onSuccess?: () => void) => {
          try {
            await loginAction(email, password, set);
            onSuccess?.();
          } catch (error) {
            // Error is already handled by handleError in services
            // Update loading state and re-throw so caller knows login failed
            set({ isLoading: false, isAuthenticated: false });
            throw error;
          }
        },
        loginWithGoogle: async (onSuccess?: () => void) => {
          try {
            await googleLoginAction(set);
            onSuccess?.();
          } catch (error) {
            // Error is already handled by handleError in services
            // Update loading state and re-throw so caller knows login failed
            set({ isLoading: false, isAuthenticated: false });
            throw error;
          }
        },
        logout: () => logoutAction(set),
        getCurrentUserProfile: async () => {
          try {
            await getCurrentUserProfileAction(set);
          } catch (error) {
            // Error is already handled by handleError in services
            set({ isLoading: false });
            throw error;
          }
        },
        updateProfile: async (data) => {
          try {
            await updateProfileAction(data, set);
          } catch (error) {
            // Error is already handled by handleError in services
            set({ isLoading: false });
            throw error;
          }
        },
        clearError: () => clearErrorAction(set),
        setLoading: (loading: boolean) => setLoadingAction(loading, set),
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
