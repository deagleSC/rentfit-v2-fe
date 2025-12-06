import * as z from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Register form validation schema
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Infer the TypeScript types from the Zod schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

// User type matching backend response
export interface User {
  _id: string;
  name: string;
  email: string;
  roles: ('landlord' | 'tenant' | 'admin')[];
  checkpoint: 'onboarding' | 'complete';
  image?: string;
  landlord_profile?: {
    verification_status: 'pending' | 'verified' | 'rejected';
    upi_id?: string;
    pan_number?: string;
    bank_details?: {
      account_number?: string;
      ifsc_code?: string;
      account_holder_name?: string;
    };
  };
  tenant_profile?: {
    kyc_status: 'pending' | 'verified' | 'rejected';
    current_employer?: string;
    permanent_address?: string;
    emergency_contact?: {
      name?: string;
      phone?: string;
      relation?: string;
    };
  };
  subscription?: {
    plan_type: 'free' | 'basic' | 'premium';
    expires_at?: string;
    payment_method?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions type
export interface AuthActions {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  loginWithGoogle: (onSuccess?: () => void) => Promise<void>;
  logout: () => void;
  getCurrentUserProfile: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Login response type
export interface LoginResponse {
  user: User;
  token: string;
}

// Current user profile response type
export interface CurrentUserProfileResponse {
  user: User;
}
