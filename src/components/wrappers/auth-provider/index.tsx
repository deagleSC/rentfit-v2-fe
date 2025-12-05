'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * Handles authentication-based route protection and redirects:
 * - If user is authenticated and on /auth routes -> redirect to "/"
 * - If user is not authenticated and on non-/auth routes -> redirect to "/auth/login"
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Don't redirect while loading (e.g., during initial auth check)
    if (isLoading) {
      return;
    }

    const isAuthRoute = pathname?.startsWith('/auth');

    // If user is authenticated and trying to access auth routes, redirect to home
    if (isAuthenticated && isAuthRoute) {
      router.replace('/');
      return;
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && !isAuthRoute) {
      router.replace('/auth/login');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state while checking authentication
  // This prevents flash of content before redirect
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
