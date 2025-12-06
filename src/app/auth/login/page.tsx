'use client';

import LoginForm from '@/components/forms/auth/login-form';
import AuthLayout from '@/layouts/auth-layout';
import { type LoginFormValues } from '@/types/auth';
import { useAuthStore } from '@/zustand/stores/auth-store';
import { toast } from 'sonner';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const getCurrentUserProfile = useAuthStore((state) => state.getCurrentUserProfile);

  const handleFormSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password, () => {
        getCurrentUserProfile();
        toast.success('Login successful');
      });
    } catch {
      // Error is already handled by handleError in services
      // Just prevent uncaught promise rejection
      // Don't show success toast on error
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(() => {
        getCurrentUserProfile();
        toast.success('Google login successful');
      });
    } catch {
      // Error is already handled by handleError in services
      // Just prevent uncaught promise rejection
      // Don't show success toast on error
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <LoginForm onSubmit={handleFormSubmit} onGoogleLogin={handleGoogleLogin} />
      </div>
    </AuthLayout>
  );
}
