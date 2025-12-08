/**
 * Handle 401 Unauthorized errors
 * Clears all stores and logs out the user
 * This should be called whenever a 401 response is received
 *
 * Note: This function uses dynamic imports to avoid circular dependencies
 * and should only be called on the client side
 */
export async function handle401Error(): Promise<void> {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Dynamically import stores to avoid circular dependencies
    const { useAuthStore } = await import('@/zustand/stores/auth-store');
    const { useOnboardingStore } = await import('@/zustand/stores/onboarding-store');

    // Clear auth store (logout)
    const logout = useAuthStore.getState().logout;
    logout();

    // Clear onboarding store
    const reset = useOnboardingStore.getState().reset;
    reset();

    // Clear auth token from localStorage (already done by logout, but ensure it's cleared)
    localStorage.removeItem('auth_token');

    // Redirect to login page using window.location to ensure full page reload
    // This ensures all state is cleared
    if (window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    // Fallback: just clear localStorage and redirect
    console.error('Error handling 401:', error);
    localStorage.removeItem('auth_token');
    if (window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/login';
    }
  }
}
