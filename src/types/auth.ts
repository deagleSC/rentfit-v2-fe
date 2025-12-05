import * as z from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Infer the TypeScript type from the Zod schema
export type LoginFormValues = z.infer<typeof loginSchema>;

// User type matching backend response
export interface User {
  _id: string;
  name: string;
  email: string;
  roles: ('landlord' | 'tenant' | 'admin')[];
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
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Login response type
export interface LoginResponse {
  user: User;
  token: string;
}
