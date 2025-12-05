'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/types/auth';

interface LoginFormProps {
  onSubmit?: (data: LoginFormValues) => void | Promise<void>;
  onGoogleLogin?: () => void | Promise<void>;
}

export default function LoginForm({ onSubmit, onGoogleLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginFormValues) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      console.log('Form data:', data);
    }
  };

  const handleGoogleLogin = async () => {
    if (onGoogleLogin) {
      await onGoogleLogin();
    } else {
      console.log('Google login clicked');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 w-full max-w-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to RentFit.</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={errors.email ? 'pl-10 border-destructive' : 'pl-10'}
              aria-invalid={errors.email ? 'true' : 'false'}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={errors.password ? 'pl-10 pr-10 border-destructive' : 'pl-10 pr-10'}
              aria-invalid={errors.password ? 'true' : 'false'}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive mt-1" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="flex items-center justify-end">
        <a href="/auth/forgot-password" className="text-sm text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Login Button */}
      <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
        <Image
          src="/assets/google.png"
          alt="Google"
          width={16}
          height={16}
          className="mr-2"
          aria-hidden="true"
        />
        Continue with Google
      </Button>

      {/* Sign Up Link */}
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a href="/auth/register" className="text-primary hover:underline font-medium">
          Sign up
        </a>
      </div>
    </form>
  );
}
