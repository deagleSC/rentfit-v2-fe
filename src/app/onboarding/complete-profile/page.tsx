'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/zustand/stores/onboarding-store';
import UpdateLandlordProfileForm from '@/components/forms/profile/update-landlord-profile-form';
import UpdateTenantProfileForm from '@/components/forms/profile/update-tenant-profile-form';
import type { LandlordProfileFormValues, TenantProfileFormValues } from '@/types/profile';

export default function CompleteProfilePage() {
  const router = useRouter();
  const selectedRole = useOnboardingStore((state) => state.selectedRole);
  const setProfileData = useOnboardingStore((state) => state.setProfileData);

  const handleSubmit = (data: LandlordProfileFormValues | TenantProfileFormValues) => {
    // Store profile data in onboarding store
    if (selectedRole === 'landlord') {
      setProfileData({ landlord: data as LandlordProfileFormValues });
    } else if (selectedRole === 'tenant') {
      setProfileData({ tenant: data as TenantProfileFormValues });
    }

    // Navigate back to onboarding page after profile completion
    router.push('/onboarding');
  };

  if (!selectedRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No Role Selected</h1>
          <p className="text-muted-foreground mt-2">Please select a role first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full">
        {selectedRole === 'landlord' ? (
          <UpdateLandlordProfileForm onSubmit={handleSubmit} />
        ) : (
          <UpdateTenantProfileForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
