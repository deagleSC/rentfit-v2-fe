import * as z from 'zod';

// Common profile picture schema
const profilePictureSchema = z.string().url().optional().or(z.literal(''));

// Landlord profile form schema
export const landlordProfileSchema = z.object({
  image: profilePictureSchema,
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      'Phone number must be a valid 10-digit Indian mobile number'
    ),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  upiId: z.string().optional(),
  bankDetails: z
    .object({
      accountNumber: z.string().optional(),
      ifscCode: z
        .string()
        .optional()
        .refine(
          (val) => !val || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val),
          'IFSC code must be in format: ABCD0123456'
        ),
      accountHolderName: z.string().optional(),
      bankName: z.string().optional(),
      branchName: z.string().optional(),
    })
    .optional(),
  documents: z
    .object({
      aadhaarDocument: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

// Tenant profile form schema
export const tenantProfileSchema = z.object({
  image: profilePictureSchema,
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      'Phone number must be a valid 10-digit Indian mobile number'
    ),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  employmentType: z
    .enum(['full_time', 'part_time', 'contract', 'self_employed', 'unemployed', 'student'])
    .optional(),
  monthlyIncome: z
    .number()
    .positive()
    .optional()
    .or(z.string().transform((val) => (val === '' ? undefined : Number(val)))),
  permanentAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  documents: z
    .object({
      aadhaarDocument: z.string().url().optional().or(z.literal('')),
      employmentLetterDocument: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

// Infer TypeScript types from Zod schemas
export type LandlordProfileFormValues = z.infer<typeof landlordProfileSchema>;
export type TenantProfileFormValues = z.infer<typeof tenantProfileSchema>;
