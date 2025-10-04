'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileEditForm } from '@/components/auth/ProfileEditForm';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Edit, Key } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Account Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm">{user.email}</p>
                {user.is_verified ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-sm mt-1">{user.role}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Created</p>
              <p className="text-sm mt-1">{format(new Date(user.created_at), 'PPP')}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Status</p>
              <p className="text-sm mt-1">
                {user.is_active ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Information */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{user.subscription_plan.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.subscription_plan.tier} Plan
              </p>
            </div>
            {user.subscription_plan.tier === 'FREE' && (
              <Button>Upgrade Plan</Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Daily Checks</p>
              <p className="text-2xl font-bold">
                {user.subscription_plan.limits.daily_checks}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Checks</p>
              <p className="text-2xl font-bold">
                {user.subscription_plan.limits.monthly_checks}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Calls/Day</p>
              <p className="text-2xl font-bold">
                {user.subscription_plan.limits.api_calls_per_day}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Edit Form */}
      {isEditing ? (
        <ProfileEditForm user={user} onCancel={() => setIsEditing(false)} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-sm mt-1">{user.full_name}</p>
              </div>

              {user.company && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm mt-1">{user.company}</p>
                </div>
              )}

              {user.timezone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timezone</p>
                  <p className="text-sm mt-1">{user.timezone}</p>
                </div>
              )}

              {user.language && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Language</p>
                  <p className="text-sm mt-1">{user.language}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Marketing Emails</p>
                <p className="text-sm mt-1">
                  {user.marketing_consent ? 'Subscribed' : 'Not subscribed'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
