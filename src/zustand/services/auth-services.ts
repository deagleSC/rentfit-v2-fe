import { apiCall, getAuthToken } from '@/lib/api-client';
import { api } from '@/configs/api';
import { handleError } from '@/lib/handle-error';
import type { LoginResponse, LoginFormValues, CurrentUserProfileResponse } from '@/types/auth';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

/**
 * Authentication service functions
 * Handles all API calls related to authentication
 */

/**
 * Register with email and password
 */
export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await apiCall<LoginResponse>({
      method: 'POST',
      url: api.auth.register(),
      data: {
        name,
        email,
        password,
        roles: [], // Empty roles array as per requirement
      },
    });

    return response.data;
  } catch (error: unknown) {
    handleError(error, 'Registration failed. Please try again.');
    throw error;
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(credentials: LoginFormValues): Promise<LoginResponse> {
  try {
    const response = await apiCall<LoginResponse>({
      method: 'POST',
      url: api.auth.login(),
      data: credentials,
    });

    return response.data;
  } catch (error: unknown) {
    handleError(error, 'Login failed. Please try again.');
    throw error;
  }
}

/**
 * Login with Google
 * Signs in with Firebase Google Auth and then authenticates with backend
 */
export async function loginWithGoogle(): Promise<LoginResponse> {
  try {
    // Sign in with Google using Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get the ID token from Firebase
    const idToken = await user.getIdToken();

    // Send ID token to backend for verification and JWT generation
    const response = await apiCall<LoginResponse>({
      method: 'POST',
      url: api.auth.firebase(),
      data: { idToken },
    });

    return response.data;
  } catch (error: unknown) {
    // Handle Firebase errors
    if (error instanceof Error) {
      // Check if it's a Firebase auth error
      if (error.message.includes('auth/')) {
        handleError(error, 'Google sign-in was cancelled or failed. Please try again.');
      } else {
        handleError(error, 'Google login failed. Please try again.');
      }
    } else {
      handleError(error, 'Google login failed. Please try again.');
    }
    throw error;
  }
}

/**
 * Get current user profile
 * Fetches the current user profile from the backend
 */
export async function getCurrentUserProfile(): Promise<CurrentUserProfileResponse> {
  try {
    const response = await apiCall<CurrentUserProfileResponse>({
      method: 'GET',
      url: api.auth.me(),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error, 'Failed to get current user profile.');
    throw error;
  }
}
