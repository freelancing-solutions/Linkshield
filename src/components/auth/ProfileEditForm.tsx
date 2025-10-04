'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '@/lib/validations/auth';
import { useUpdateProfile } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { User, ProfileUpdateData } from '@/types/auth.types';
import type { z } from 'zod';

interface ProfileEditFormProps {
  user: User;
  onCancel: () => void;
}

type ProfileFormData = z.infer<typeof profileUpdateSchema>;

export function ProfileEditForm({ user, onCancel }: ProfileEditFormProps) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user.full_name,
      company: user.company || '',
      profile_picture_url: user.profile_picture_url || '',
      timezone: user.timezone || '',
      language: user.language || '',
      marketing_consent: user.marketing_consent,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // Remove empty strings
    const cleanedData: ProfileUpdateData = {};
    if (data.full_name) cleanedData.full_name = data.full_name;
    if (data.company) cleanedData.company = data.company;
    if (data.profile_picture_url) cleanedData.profile_picture_url = data.profile_picture_url;
    if (data.timezone) cleanedData.timezone = data.timezone;
    if (data.language) cleanedData.language = data.language;
    cleanedData.marketing_consent = data.marketing_consent;

    updateProfile.mutate(cleanedData, {
      onSuccess: () => {
        onCancel();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                {...register('full_name')}
                disabled={updateProfile.isPending}
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                {...register('company')}
                disabled={updateProfile.isPending}
              />
              {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
            </div>

            {/* Profile Picture URL */}
            <div className="space-y-2">
              <Label htmlFor="profile_picture_url">Profile Picture URL</Label>
              <Input
                id="profile_picture_url"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register('profile_picture_url')}
                disabled={updateProfile.isPending}
              />
              {errors.profile_picture_url && (
                <p className="text-sm text-red-600">{errors.profile_picture_url.message}</p>
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                type="text"
                placeholder="America/New_York"
                {...register('timezone')}
                disabled={updateProfile.isPending}
              />
              {errors.timezone && (
                <p className="text-sm text-red-600">{errors.timezone.message}</p>
              )}
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                type="text"
                placeholder="en"
                {...register('language')}
                disabled={updateProfile.isPending}
              />
              {errors.language && (
                <p className="text-sm text-red-600">{errors.language.message}</p>
              )}
            </div>
          </div>

          {/* Marketing Consent */}
          <div className="flex items-center space-x-2">
            <input
              id="marketing_consent"
              type="checkbox"
              {...register('marketing_consent')}
              disabled={updateProfile.isPending}
            />
            <Label htmlFor="marketing_consent" className="text-sm font-normal cursor-pointer">
              I would like to receive product updates and marketing communications
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={updateProfile.isPending || !isDirty}
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
