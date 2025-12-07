'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePictureUpload } from '@/components/ui/profile-picture-upload';
import { FileUpload } from '@/components/ui/file-upload';
import { Home, Briefcase, Phone, MapPin, DollarSign, User } from 'lucide-react';
import { tenantProfileSchema, type TenantProfileFormValues } from '@/types/profile';

interface UpdateTenantProfileFormProps {
  onSubmit?: (data: TenantProfileFormValues) => void;
}

export default function UpdateTenantProfileForm({ onSubmit }: UpdateTenantProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TenantProfileFormValues>({
    resolver: zodResolver(tenantProfileSchema),
    defaultValues: {
      image: '',
      phone: '',
      gender: undefined,
      currentEmployer: '',
      jobTitle: '',
      employmentType: undefined,
      monthlyIncome: undefined,
      permanentAddress: '',
      city: '',
      state: '',
      pincode: '',
      documents: {
        aadhaarDocument: '',
        employmentLetterDocument: '',
      },
    },
  });

  const handleFormSubmit = async (data: TenantProfileFormValues) => {
    console.log('Tenant profile data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6 w-full">
      <Card className="border-none shadow-none sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            Tenant Profile Information
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
            Complete your tenant profile to help landlords know more about you
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

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Current Employer */}
            <div className="space-y-2">
              <Label htmlFor="currentEmployer">Current Employer</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="currentEmployer"
                  type="text"
                  placeholder="Enter your current employer name"
                  className={errors.currentEmployer ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.currentEmployer ? 'true' : 'false'}
                  {...register('currentEmployer')}
                />
              </div>
              {errors.currentEmployer && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.currentEmployer.message}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="Enter your job title"
                  className={errors.jobTitle ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.jobTitle ? 'true' : 'false'}
                  {...register('jobTitle')}
                />
              </div>
              {errors.jobTitle && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" id="employmentType">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="self_employed">Self Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employmentType && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.employmentType.message}
                </p>
              )}
            </div>

            {/* Monthly Income */}
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter monthly income"
                  className={errors.monthlyIncome ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.monthlyIncome ? 'true' : 'false'}
                  {...register('monthlyIncome', {
                    setValueAs: (value) => (value === '' ? undefined : Number(value)),
                  })}
                />
              </div>
              {errors.monthlyIncome && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.monthlyIncome.message}
                </p>
              )}
            </div>

            {/* Permanent Address - Full Width */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="permanentAddress"
                  type="text"
                  placeholder="Enter your permanent address"
                  className={errors.permanentAddress ? 'pl-10 border-destructive' : 'pl-10'}
                  aria-invalid={errors.permanentAddress ? 'true' : 'false'}
                  {...register('permanentAddress')}
                />
              </div>
              {errors.permanentAddress && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.permanentAddress.message}
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

            {/* Employment Letter Document */}
            <Controller
              name="documents.employmentLetterDocument"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Employment Letter Document"
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url || '')}
                  accept="image/*,application/pdf"
                  error={errors.documents?.employmentLetterDocument?.message}
                  category="employment_letter"
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
