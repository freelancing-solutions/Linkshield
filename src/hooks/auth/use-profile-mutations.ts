import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import type { ProfileUpdateData, PasswordChangeData, ResetPasswordData } from '@/types/auth.types';

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProfileUpdateData) => authService.updateProfile(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(['profile']);

      // Optimistically update
      queryClient.setQueryData(['profile'], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousProfile };
    },
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      setUser(updatedUser);

      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast.success('Profile updated successfully');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
      }
      toast.error('Failed to update profile. Please try again.');
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: PasswordChangeData) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully. Please log in again.', { duration: 5000 });

      // Clear auth state and redirect to login
      setTimeout(() => {
        clearAuth();
        queryClient.clear();
        router.push('/login');
      }, 3000);
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'INVALID_CREDENTIALS') {
        toast.error('Current password is incorrect.');
      } else if (errorCode === 'PASSWORD_TOO_WEAK') {
        toast.error('New password does not meet security requirements.');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    },
  });
}

/**
 * Hook for forgot password request
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success(
        'If an account exists with this email, you will receive a password reset link.',
        { duration: 6000 }
      );
    },
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 429) {
        toast.error('Too many requests. Please wait a few minutes before trying again.');
      } else {
        // Always show success message for security (don't reveal if email exists)
        toast.success(
          'If an account exists with this email, you will receive a password reset link.',
          { duration: 6000 }
        );
      }
    },
  });
}

/**
 * Hook for resetting password with token
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;
      const status = error.response?.status;

      if (errorCode === 'INVALID_TOKEN' || status === 400) {
        toast.error('Invalid or expired reset link. Please request a new one.');
      } else if (errorCode === 'PASSWORD_TOO_WEAK') {
        toast.error('Password does not meet security requirements.');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    },
  });
}
