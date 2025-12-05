import { setAuthToken } from '@/lib/api-client';
import * as authServices from '@/zustand/services/auth-services';
import type { AuthState } from '@/types/auth';

type SetState = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;

/**
 * Login action
 * Handles login logic and state updates
 */
export async function loginAction(email: string, password: string, set: SetState): Promise<void> {
  set({ isLoading: true, error: null });

  const response = await authServices.loginWithEmail({ email, password });

  // Store token in localStorage
  setAuthToken(response.token);

  // Update state
  set({
    user: response.user,
    token: response.token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
}

/**
 * Logout action
 * Handles logout logic and state updates
 */
export function logoutAction(set: SetState): void {
  // Clear token from localStorage
  setAuthToken(null);

  // Reset state
  set({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
  });
}

/**
 * Clear error action
 */
export function clearErrorAction(set: SetState): void {
  set({ error: null });
}

/**
 * Set loading action
 */
export function setLoadingAction(loading: boolean, set: SetState): void {
  set({ isLoading: loading });
}

/**
 * Google login action
 * Handles Google login logic and state updates
 */
export async function googleLoginAction(set: SetState): Promise<void> {
  set({ isLoading: true, error: null });

  const response = await authServices.loginWithGoogle();

  // Store token in localStorage
  setAuthToken(response.token);

  // Update state
  set({
    user: response.user,
    token: response.token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
}
