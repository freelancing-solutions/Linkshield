import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import type { LoginFormData, RegisterFormData } from '@/types/auth.types';

/**
 * Hook for user login
 */
export function useLogin() {
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

    return useMutation({
        mutationFn: (data: LoginFormData) => authService.login(data),
        onSuccess: (response) => {
            // Update auth store
            setToken(response.access_token);
            setUser(response.user);

            toast.success(`Welcome back, ${response.user.full_name}!`);

            // Redirect to dashboard or return URL
            const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
            router.push(returnUrl || '/dashboard');
        },
        onError: (error: any) => {
            const errorCode = error.response?.data?.error_code;

            if (errorCode === 'INVALID_CREDENTIALS') {
                toast.error('Invalid email or password. Please try again.');
            } else if (errorCode === 'ACCOUNT_LOCKED') {
                toast.error(
                    'Your account has been locked due to too many failed login attempts. Please try again in 30 minutes.'
                );
            } else if (errorCode === 'EMAIL_NOT_VERIFIED') {
                toast.error('Please verify your email address before logging in.');
            } else {
                toast.error('Login failed. Please try again.');
            }
        },
    });
}

/**
 * Hook for user registration
 */
export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterFormData) => authService.register(data),
        onSuccess: () => {
            toast.success(
                'Registration successful! Please check your email to verify your account.',
                { duration: 6000 }
            );
            router.push('/login');
        },
        onError: (error: any) => {
            const errorCode = error.response?.data?.error_code;

            if (errorCode === 'EMAIL_ALREADY_EXISTS') {
                toast.error('This email is already registered. Try logging in instead.');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        },
    });
}

/**
 * Hook for user logout
 */
export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Clear auth store
            clearAuth();

            // Clear all cached queries
            queryClient.clear();

            toast.success('Logged out successfully');
            router.push('/login');
        },
        onError: () => {
            // Even if API call fails, clear local state
            clearAuth();
            queryClient.clear();
            router.push('/login');
        },
    });
}

/**
 * Hook for email verification
 */
export function useVerifyEmail() {
    const router = useRouter();

    return useMutation({
        mutationFn: (token: string) => authService.verifyEmail(token),
        onSuccess: () => {
            toast.success('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        },
        onError: (error: any) => {
            const errorCode = error.response?.data?.error_code;

            if (errorCode === 'INVALID_TOKEN' || error.response?.status === 400) {
                toast.error('Invalid or expired verification link. Please request a new one.');
            } else {
                toast.error('Email verification failed. Please try again.');
            }
        },
    });
}

/**
 * Hook for resending verification email
 */
export function useResendVerification() {
    return useMutation({
        mutationFn: (email: string) => authService.resendVerification(email),
        onSuccess: () => {
            toast.success('Verification email sent. Please check your inbox.', { duration: 5000 });
        },
        onError: (error: any) => {
            const status = error.response?.status;

            if (status === 429) {
                toast.error('Too many requests. Please wait a few minutes before trying again.');
            } else if (status === 403) {
                toast.error('Email is already verified.');
            } else {
                toast.error('Failed to send verification email. Please try again.');
            }
        },
    });
}
