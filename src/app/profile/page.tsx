'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import UpdateTenantProfileForm from '@/components/forms/profile/update-tenant-profile-form';
import UpdateLandlordProfileForm from '@/components/forms/profile/update-landlord-profile-form';
import { useAuthStore } from '@/zustand/stores/auth-store';
import { toast } from 'sonner';
import type { TenantProfileFormValues, LandlordProfileFormValues } from '@/types/profile';
import type { UpdateProfilePayload } from '@/types/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getCurrentUserProfile, updateProfile } = useAuthStore();

  // Fetch user profile on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      getCurrentUserProfile();
    }
  }, [isAuthenticated, user, getCurrentUserProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Determine user role
  const isLandlord = useMemo(() => {
    return user?.roles?.includes('landlord') ?? false;
  }, [user?.roles]);

  const isTenant = useMemo(() => {
    return user?.roles?.includes('tenant') ?? false;
  }, [user?.roles]);

  // Prepare default values for tenant form
  const tenantDefaultValues = useMemo<Partial<TenantProfileFormValues>>(() => {
    if (!user?.tenantProfile) return {};

    return {
      image: user.image || '',
      phone: user.tenantProfile.phone || '',
      gender: user.tenantProfile.gender as TenantProfileFormValues['gender'],
      currentEmployer: user.tenantProfile.currentEmployer || '',
      jobTitle: user.tenantProfile.jobTitle || '',
      employmentType: user.tenantProfile
        .employmentType as TenantProfileFormValues['employmentType'],
      monthlyIncome: user.tenantProfile.monthlyIncome,
      permanentAddress: user.tenantProfile.permanentAddress || '',
      city: user.tenantProfile.city || '',
      state: user.tenantProfile.state || '',
      pincode: user.tenantProfile.pincode || '',
      documents: {
        aadhaarDocument: user.tenantProfile.documents?.aadhaarDocument || '',
        employmentLetterDocument: user.tenantProfile.documents?.employmentLetterDocument || '',
      },
    };
  }, [user]);

  // Prepare default values for landlord form
  const landlordDefaultValues = useMemo<Partial<LandlordProfileFormValues>>(() => {
    if (!user?.landlordProfile) return {};

    return {
      image: user.image || '',
      phone: user.landlordProfile.phone || '',
      address: user.landlordProfile.address || '',
      city: user.landlordProfile.city || '',
      state: user.landlordProfile.state || '',
      pincode: user.landlordProfile.pincode || '',
      upiId: user.landlordProfile.upiId || '',
      bankDetails: {
        accountNumber: user.landlordProfile.bankDetails?.accountNumber || '',
        ifscCode: user.landlordProfile.bankDetails?.ifscCode || '',
        accountHolderName: user.landlordProfile.bankDetails?.accountHolderName || '',
        bankName: user.landlordProfile.bankDetails?.bankName || '',
        branchName: user.landlordProfile.bankDetails?.branchName || '',
      },
      documents: {
        aadhaarDocument: user.landlordProfile.documents?.aadhaarDocument || '',
      },
    };
  }, [user]);

  // Handle tenant form submission
  const handleTenantSubmit = async (data: TenantProfileFormValues) => {
    try {
      const payload: UpdateProfilePayload = {
        image: data.image || undefined,
        tenantProfile: {
          phone: data.phone || undefined,
          gender: data.gender,
          currentEmployer: data.currentEmployer || undefined,
          jobTitle: data.jobTitle || undefined,
          employmentType: data.employmentType,
          monthlyIncome: data.monthlyIncome,
          permanentAddress: data.permanentAddress || undefined,
          city: data.city || undefined,
          state: data.state || undefined,
          pincode: data.pincode || undefined,
          documents: data.documents
            ? {
                aadhaarDocument: data.documents.aadhaarDocument || undefined,
                employmentLetterDocument: data.documents.employmentLetterDocument || undefined,
              }
            : undefined,
        } as UpdateProfilePayload['tenantProfile'],
      };

      await updateProfile(payload);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update tenant profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Handle landlord form submission
  const handleLandlordSubmit = async (data: LandlordProfileFormValues) => {
    try {
      const payload: UpdateProfilePayload = {
        image: data.image || undefined,
        landlordProfile: {
          phone: data.phone || undefined,
          address: data.address || undefined,
          city: data.city || undefined,
          state: data.state || undefined,
          pincode: data.pincode || undefined,
          upiId: data.upiId || undefined,
          bankDetails: data.bankDetails
            ? {
                accountNumber: data.bankDetails.accountNumber || undefined,
                ifscCode: data.bankDetails.ifscCode || undefined,
                accountHolderName: data.bankDetails.accountHolderName || undefined,
                bankName: data.bankDetails.bankName || undefined,
                branchName: data.bankDetails.branchName || undefined,
              }
            : undefined,
          documents: data.documents
            ? {
                aadhaarDocument: data.documents.aadhaarDocument || undefined,
              }
            : undefined,
        } as UpdateProfilePayload['landlordProfile'],
      };

      await updateProfile(payload);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update landlord profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Show loading state
  if (isLoading || !user) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Loading your profile...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  // Show error if user has no role
  if (!isLandlord && !isTenant) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Unable to determine user role</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please contact support or complete your onboarding to set up your profile.
            </p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full">
        {isLandlord ? (
          <UpdateLandlordProfileForm
            defaultValues={landlordDefaultValues}
            onSubmit={handleLandlordSubmit}
          />
        ) : (
          <UpdateTenantProfileForm
            defaultValues={tenantDefaultValues}
            onSubmit={handleTenantSubmit}
          />
        )}
      </div>
    </AppLayout>
  );
}
