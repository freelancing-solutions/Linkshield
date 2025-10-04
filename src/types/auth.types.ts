import { User, SubscriptionPlan, Session } from './user.types';

// Login & Registration
export interface LoginFormData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  full_name: string;
  company?: string;
  accept_terms: boolean;
  marketing_consent?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: User;
  session_id: string;
}

// Profile Management
export interface ProfileUpdateData {
  full_name?: string;
  company?: string;
  profile_picture_url?: string;
  timezone?: string;
  language?: string;
  marketing_consent?: boolean;
}

// Password Management
export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
}

// Device Info
export interface DeviceInfo {
  browser: string;
  os: string;
  screen_resolution?: string;
}

// Re-export from user.types for convenience
export type { User, SubscriptionPlan, Session };
