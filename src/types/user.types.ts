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
  name: 'free' | 'starter' | 'creator' | 'professional' | 'business' | 'enterprise';
  display_name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  features: PlanFeature[];
  limits: PlanLimits;
  target_audience: string;
  popular?: boolean;
  recommended?: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PlanLimits {
  url_checks_per_day: number;
  deep_scans_per_month: number;
  bulk_checks_per_month: number;
  api_calls_per_day: number;
  projects_limit: number;
  team_members_limit: number;
  data_retention_days: number;
}

export interface DetailedUsage {
  current_period: UsagePeriod;
  daily_usage: DailyUsage[];
  monthly_usage: MonthlyUsage[];
  approaching_limits: LimitWarning[];
  upgrade_recommendations: UpgradeRecommendation[];
}

export interface UsagePeriod {
  start_date: string;
  end_date: string;
  days_remaining: number;
}

export interface DailyUsage {
  date: string;
  url_checks: number;
  api_calls: number;
  deep_scans: number;
  bulk_checks: number;
}

export interface MonthlyUsage {
  month: string;
  url_checks: number;
  api_calls: number;
  deep_scans: number;
  bulk_checks: number;
  projects_created: number;
}

export interface LimitWarning {
  usage_type: string;
  current_usage: number;
  limit: number;
  percentage_used: number;
  warning_level: 'info' | 'warning' | 'critical';
}

export interface UpgradeRecommendation {
  recommended_plan: string;
  reason: string;
  benefits: string[];
  estimated_savings?: number;
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
