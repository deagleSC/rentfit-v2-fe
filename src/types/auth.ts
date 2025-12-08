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

// User type matching frontend camelCase format (converted from backend snake_case)
export interface User {
  id: string; // Converted from _id
  name: string;
  email: string;
  roles: ('landlord' | 'tenant' | 'admin')[];
  checkpoint: 'onboarding' | 'complete';
  image?: string;
  landlordProfile?: {
    verificationStatus: 'pending' | 'verified' | 'rejected';
    phone?: string;
    alternatePhone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    upiId?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    gstNumber?: string;
    companyName?: string;
    companyRegistrationNumber?: string;
    bankDetails?: {
      accountNumber?: string;
      ifscCode?: string;
      accountHolderName?: string;
      bankName?: string;
      branchName?: string;
    };
    documents?: {
      panDocument?: string;
      aadhaarDocument?: string;
      bankStatement?: string;
      gstCertificate?: string;
    };
  };
  tenantProfile?: {
    kycStatus: 'pending' | 'verified' | 'rejected';
    phone?: string;
    alternatePhone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    currentEmployer?: string;
    jobTitle?: string;
    employmentType?:
      | 'full_time'
      | 'part_time'
      | 'contract'
      | 'self_employed'
      | 'unemployed'
      | 'student';
    monthlyIncome?: number;
    permanentAddress?: string;
    currentAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    emergencyContact?: {
      name?: string;
      phone?: string;
      relation?: string;
      email?: string;
    };
    previousLandlordContact?: {
      name?: string;
      phone?: string;
      email?: string;
    };
    employerContact?: {
      name?: string;
      phone?: string;
      email?: string;
      designation?: string;
    };
    documents?: {
      panDocument?: string;
      aadhaarDocument?: string;
      employmentLetterDocument?: string;
      salarySlip?: string;
      previousRentAgreement?: string;
    };
  };
  subscription?: {
    planType: 'free' | 'basic' | 'premium';
    expiresAt?: string;
    paymentMethod?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Update profile payload type (camelCase for frontend)
export interface UpdateProfilePayload {
  name?: string;
  image?: string;
  checkpoint?: 'onboarding' | 'complete';
  roles?: ('landlord' | 'tenant' | 'admin')[];
  landlordProfile?: User['landlordProfile'];
  tenantProfile?: User['tenantProfile'];
}

// Auth actions type
export interface AuthActions {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  loginWithGoogle: (onSuccess?: () => void) => Promise<void>;
  logout: () => void;
  getCurrentUserProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
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
