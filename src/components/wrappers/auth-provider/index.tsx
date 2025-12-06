'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/zustand/stores/auth-store';
import { UserCheckpoint } from '@/enums/auth-enums';

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
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Don't redirect while loading (e.g., during initial auth check)
    if (isLoading) {
      return;
    }

    const isAuthRoute = pathname?.startsWith('/auth');
    const isOnboardingRoute = pathname?.startsWith('/onboarding');

    // If user is authenticated and trying to access auth routes, redirect to home
    if (isAuthenticated && isAuthRoute) {
      router.replace('/');
      return;
    }

    // If user is authenticated and on onboarding, redirect to onboarding
    if (isAuthenticated && user?.checkpoint === UserCheckpoint.ONBOARDING && !isOnboardingRoute) {
      router.replace('/onboarding');
      return;
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && !isAuthRoute) {
      router.replace('/auth/login');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Show loading state while checking authentication
  // This prevents flash of content before redirect
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-foreground">Loading RentFit</p>
            <p className="text-xs text-muted-foreground">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
