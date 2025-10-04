import { apiClient } from './api';
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  User,
  ProfileUpdateData,
  PasswordChangeData,
  ResetPasswordData,
  Session,
  DeviceInfo,
} from '@/types/auth.types';

/**
 * Get device information for session tracking
 */
function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      browser: 'Unknown',
      os: 'Unknown',
    };
  }

  return {
    browser: navigator.userAgent,
    os: navigator.platform,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
  };
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterFormData): Promise<void> => {
    return apiClient.post('/user/register', {
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      company: data.company,
      accept_terms: data.accept_terms,
      marketing_consent: data.marketing_consent,
    });
  },

  /**
   * Login user and get JWT token
   */
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    return apiClient.post('/user/login', {
      email: data.email,
      password: data.password,
      remember_me: data.remember_me,
      device_info: getDeviceInfo(),
    });
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    return apiClient.post('/user/logout');
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<User> => {
    return apiClient.post('/user/verify-email', { token });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<void> => {
    return apiClient.post('/user/resend-verification', { email });
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get('/user/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    return apiClient.put('/user/profile', data);
  },

  /**
   * Change password
   */
  changePassword: async (data: PasswordChangeData): Promise<void> => {
    return apiClient.post('/user/change-password', data);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    return apiClient.post('/user/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    return apiClient.post('/user/reset-password', data);
  },

  /**
   * Get user sessions
   */
  getSessions: async (): Promise<Session[]> => {
    return apiClient.get('/user/sessions');
  },

  /**
   * Revoke a specific session
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    return apiClient.delete(`/user/sessions/${sessionId}`);
  },

  /**
   * Terminate all sessions except current
   */
  terminateAllSessions: async (): Promise<void> => {
    return apiClient.delete('/user/sessions');
  },
};
