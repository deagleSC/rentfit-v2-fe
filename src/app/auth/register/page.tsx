'use client';

import RegisterForm from '@/components/forms/auth/register-form';
import AuthLayout from '@/layouts/auth-layout';
import { type RegisterFormValues } from '@/types/auth';
import { useAuthStore } from '@/zustand/stores/auth-store';
import { toast } from 'sonner';

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const handleFormSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data.name, data.email, data.password);
      // Only show success if register didn't throw an error
      toast.success('Account created successfully');
    } catch {
      // Error is already handled by handleError in services
      // Just prevent uncaught promise rejection
      // Don't show success toast on error
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Only show success if login didn't throw an error
      toast.success('Login successful');
    } catch {
      // Error is already handled by handleError in services
      // Just prevent uncaught promise rejection
      // Don't show success toast on error
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <RegisterForm onSubmit={handleFormSubmit} onGoogleLogin={handleGoogleLogin} />
      </div>
    </AuthLayout>
  );
}
