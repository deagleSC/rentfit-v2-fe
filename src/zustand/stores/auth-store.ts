import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthActions } from '@/types/auth';
import {
  loginAction,
  googleLoginAction,
  logoutAction,
  clearErrorAction,
  setLoadingAction,
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
        login: async (email: string, password: string) => {
          try {
            await loginAction(email, password, set);
          } catch (error) {
            // Error is already handled by handleError in services
            // Update loading state and re-throw so caller knows login failed
            set({ isLoading: false, isAuthenticated: false });
            throw error;
          }
        },
        loginWithGoogle: async () => {
          try {
            await googleLoginAction(set);
          } catch (error) {
            // Error is already handled by handleError in services
            // Update loading state and re-throw so caller knows login failed
            set({ isLoading: false, isAuthenticated: false });
            throw error;
          }
        },
        logout: () => logoutAction(set),
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
