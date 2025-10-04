export interface User {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  role: 'USER' | 'ADMIN';
  subscription_plan: SubscriptionPlan;
  is_active: boolean;
  is_verified: boolean;
  profile_picture_url?: string;
  timezone?: string;
  language?: string;
  marketing_consent: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  features: string[];
  limits: {
    daily_checks: number;
    monthly_checks: number;
    api_calls_per_day: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: User;
  session_id: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  company?: string;
  accept_terms: boolean;
  marketing_consent?: boolean;
}

export interface Session {
  id: string;
  user_id: string;
  device_info: {
    browser: string;
    os: string;
    ip_address: string;
  };
  created_at: string;
  last_active: string;
  expires_at: string;
  is_current: boolean;
}
