'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePictureUpload } from '@/components/ui/profile-picture-upload';
import { FileUpload } from '@/components/ui/file-upload';
import { Building2, CreditCard, Banknote, Phone, MapPin } from 'lucide-react';
import { landlordProfileSchema, type LandlordProfileFormValues } from '@/types/profile';

interface UpdateLandlordProfileFormProps {
  onSubmit?: (data: LandlordProfileFormValues) => void;
  defaultValues?: Partial<LandlordProfileFormValues>;
}

export default function UpdateLandlordProfileForm({
  onSubmit,
  defaultValues: propDefaultValues,
}: UpdateLandlordProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LandlordProfileFormValues>({
    resolver: zodResolver(landlordProfileSchema),
    defaultValues: {
      image: propDefaultValues?.image || '',
      phone: propDefaultValues?.phone || '',
      address: propDefaultValues?.address || '',
      city: propDefaultValues?.city || '',
      state: propDefaultValues?.state || '',
      pincode: propDefaultValues?.pincode || '',
      upiId: propDefaultValues?.upiId || '',
      bankDetails: {
        accountNumber: propDefaultValues?.bankDetails?.accountNumber || '',
        ifscCode: propDefaultValues?.bankDetails?.ifscCode || '',
        accountHolderName: propDefaultValues?.bankDetails?.accountHolderName || '',
        bankName: propDefaultValues?.bankDetails?.bankName || '',
        branchName: propDefaultValues?.bankDetails?.branchName || '',
      },
      documents: {
        aadhaarDocument: propDefaultValues?.documents?.aadhaarDocument || '',
      },
    },
  });

  const handleFormSubmit = async (data: LandlordProfileFormValues) => {
    console.log('Landlord profile data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6 w-full">
      <Card className="border-none shadow-none sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Landlord Profile Information
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
            Complete your landlord profile to start renting out properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Profile Picture - Full Width */}
          <div className="col-span-2">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ProfilePictureUpload
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url || '')}
                  error={errors.image?.message}
                />
              )}
            />
          </div>

          {/* Form Fields - 2 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  className={errors.phone ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  maxLength={10}
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* UPI ID */}
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="upiId"
                  type="text"
                  placeholder="yourname@upi"
                  className={errors.upiId ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.upiId ? 'true' : 'false'}
                  {...register('upiId')}
                />
              </div>
              {errors.upiId && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.upiId.message}
                </p>
              )}
            </div>

            {/* Address - Full Width */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  className={errors.address ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.address ? 'true' : 'false'}
                  {...register('address')}
                />
              </div>
              {errors.address && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City, State, Pincode - 3 Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  className={errors.city ? 'border-destructive' : ''}
                  aria-invalid={errors.city ? 'true' : 'false'}
                  {...register('city')}
                />
                {errors.city && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  className={errors.state ? 'border-destructive' : ''}
                  aria-invalid={errors.state ? 'true' : 'false'}
                  {...register('state')}
                />
                {errors.state && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="Pincode"
                  className={errors.pincode ? 'border-destructive' : ''}
                  aria-invalid={errors.pincode ? 'true' : 'false'}
                  maxLength={6}
                  {...register('pincode')}
                />
                {errors.pincode && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Details Section - Full Width */}
          <div className="space-y-4 pt-4 border-t md:col-span-2">
            <h3 className="font-semibold text-sm sm:text-base">Bank Details</h3>

            {/* Bank Details - 2 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="Enter account number"
                    className={
                      errors.bankDetails?.accountNumber ? 'pl-10 border-destructive' : 'pl-10'
                    }
                    aria-invalid={errors.bankDetails?.accountNumber ? 'true' : 'false'}
                    {...register('bankDetails.accountNumber')}
                  />
                </div>
                {errors.bankDetails?.accountNumber && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.bankDetails.accountNumber.message}
                  </p>
                )}
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="ifscCode"
                    type="text"
                    placeholder="ABCD0123456"
                    className={
                      errors.bankDetails?.ifscCode
                        ? 'pl-10 border-destructive uppercase'
                        : 'pl-10 uppercase'
                    }
                    aria-invalid={errors.bankDetails?.ifscCode ? 'true' : 'false'}
                    {...register('bankDetails.ifscCode')}
                    maxLength={11}
                  />
                </div>
                {errors.bankDetails?.ifscCode && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.bankDetails.ifscCode.message}
                  </p>
                )}
              </div>

              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="accountHolderName"
                    type="text"
                    placeholder="Enter account holder name"
                    className={
                      errors.bankDetails?.accountHolderName ? 'pl-10 border-destructive' : 'pl-10'
                    }
                    aria-invalid={errors.bankDetails?.accountHolderName ? 'true' : 'false'}
                    {...register('bankDetails.accountHolderName')}
                  />
                </div>
                {errors.bankDetails?.accountHolderName && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.bankDetails.accountHolderName.message}
                  </p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="Enter bank name"
                  className={errors.bankDetails?.bankName ? 'border-destructive' : ''}
                  aria-invalid={errors.bankDetails?.bankName ? 'true' : 'false'}
                  {...register('bankDetails.bankName')}
                />
                {errors.bankDetails?.bankName && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.bankDetails.bankName.message}
                  </p>
                )}
              </div>

              {/* Branch Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  id="branchName"
                  type="text"
                  placeholder="Enter branch name"
                  className={errors.bankDetails?.branchName ? 'border-destructive' : ''}
                  aria-invalid={errors.bankDetails?.branchName ? 'true' : 'false'}
                  {...register('bankDetails.branchName')}
                />
                {errors.bankDetails?.branchName && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.bankDetails.branchName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section - Full Width */}
          <div className="space-y-4 pt-4 border-t md:col-span-2">
            <h3 className="font-semibold text-sm sm:text-base">Documents</h3>

            {/* Aadhaar Document */}
            <Controller
              name="documents.aadhaarDocument"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Aadhaar Document"
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url || '')}
                  accept="image/*,application/pdf"
                  error={errors.documents?.aadhaarDocument?.message}
                  category="aadhaar"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full md:max-w-xs h-11 sm:h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
