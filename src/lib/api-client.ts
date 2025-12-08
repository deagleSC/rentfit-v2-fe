import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { convertKeysToCamelCase, convertKeysToSnakeCase } from './convert-keys';
import { handle401Error } from './handle-401';

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Handle common errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data as { error?: { message?: string } };

        if (status === 401) {
          // Unauthorized - clear all stores and logout
          try {
            await handle401Error();
          } catch (err) {
            console.error('Error in handle401Error:', err);
          }
        }

        // Return a more user-friendly error
        return Promise.reject({
          message: data?.error?.message || error.message,
          status,
          data: error.response.data,
        });
      }

      // Network error or other issues
      return Promise.reject({
        message: error.message || 'Network error. Please try again.',
        status: 0,
      });
    }
  );

  return client;
};

// Export the configured axios instance
export const apiClient = createApiClient();

/**
 * Generic API call utility function
 * Automatically converts:
 * - Request data: camelCase -> snake_case (for backend)
 * - Response data: snake_case -> camelCase (for frontend)
 */
export async function apiCall<T>(
  config: AxiosRequestConfig
): Promise<{ data: T; message?: string }> {
  try {
    // Convert request data from camelCase to snake_case if present
    const requestConfig = { ...config };
    if (requestConfig.data && typeof requestConfig.data === 'object') {
      requestConfig.data = convertKeysToSnakeCase(requestConfig.data);
    }

    const response = await apiClient.request<{
      success: boolean;
      data?: T;
      message?: string;
      error?: { message?: string };
    }>(requestConfig);

    if (response.data.success && response.data.data) {
      // Convert snake_case keys to camelCase
      const convertedData = convertKeysToCamelCase(response.data.data);
      return {
        data: convertedData as T,
        message: response.data.message,
      };
    }

    // If response has error, throw it with proper structure
    if (response.data.error) {
      throw {
        message: response.data.error.message || 'API request failed',
        status: response.status,
        data: response.data,
      };
    }

    throw {
      message: 'API request failed',
      status: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    throw error;
  }
}

/**
 * Set auth token in localStorage and axios headers
 */
export function setAuthToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}
