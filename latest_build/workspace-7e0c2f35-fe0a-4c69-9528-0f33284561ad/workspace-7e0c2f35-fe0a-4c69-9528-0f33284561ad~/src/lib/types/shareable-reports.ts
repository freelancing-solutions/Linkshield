import { Check, ShareEvent, AIAnalysis } from '@prisma/client';

// Extended Check interface with shareable report fields
export interface ShareableCheck extends Check {
  slug: string | null;
  shareCount: number;
  ogImageUrl: string | null;
  customTitle: string | null;
  customDescription: string | null;
  shareEvents?: ShareEvent[];
  aiAnalyses?: AIAnalysis[];
}

// Interface for creating shareable reports
export interface CreateShareableReportData {
  checkId: string;
  isPublic: boolean;
  customTitle?: string;
  customDescription?: string;
  includeAIInsights?: boolean;
}

// Interface for sharing options
export interface ShareOptions {
  isPublic: boolean;
  includeAIInsights: boolean;
  customTitle?: string;
  customDescription?: string;
}

// Interface for share data used in sharing functionality
export interface ShareData {
  url: string;
  title: string;
  text: string;
  hashtags: string[];
  via: string;
}

// Interface for recent reports display
export interface RecentReport {
  id: string;
  slug: string;
  url: string;
  domain: string;
  securityScore: number | null;
  createdAt: Date;
  hasAIAnalysis: boolean;
}

// Interface for formatted display reports
export interface DisplayReport {
  slug: string;
  displayUrl: string; // Truncated for display
  domain: string;
  securityScore: number;
  scoreColor: 'green' | 'yellow' | 'orange' | 'red';
  timeAgo: string; // "2 minutes ago"
  hasAI: boolean;
}

// Share method types
export type ShareMethod = 
  | 'native' 
  | 'copy' 
  | 'qr' 
  | 'twitter' 
  | 'linkedin' 
  | 'facebook' 
  | 'email';

// Interface for share event tracking
export interface ShareEventData {
  checkId: string;
  shareMethod: ShareMethod;
  success: boolean;
  userAgent?: string;
  referrer?: string;
  ipAddress?: string;
}

// Interface for Open Graph meta tags
export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: 'website';
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
}

// Interface for structured data
export interface StructuredData {
  '@context': 'https://schema.org';
  '@type': 'WebPage' | 'Report';
  name: string;
  description: string;
  url: string;
  datePublished: string;
  author: {
    '@type': 'Organization';
    name: 'LinkShield';
  };
  about: {
    '@type': 'WebSite';
    url: string;
  };
}

// Color coding system for security scores
export const SCORE_COLORS = {
  excellent: { range: [80, 100] as const, color: 'green' as const, class: 'text-green-600' },
  good: { range: [60, 79] as const, color: 'yellow' as const, class: 'text-yellow-600' },
  warning: { range: [40, 59] as const, color: 'orange' as const, class: 'text-orange-600' },
  danger: { range: [0, 39] as const, color: 'red' as const, class: 'text-red-600' }
} as const;

// Helper function to get score color
export function getScoreColor(score: number | null): 'green' | 'yellow' | 'orange' | 'red' {
  if (score === null || score < 0) return 'red';
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 40) return 'orange';
  return 'red';
}

// Helper function to get score color class
export function getScoreColorClass(score: number | null): string {
  const color = getScoreColor(score);
  return SCORE_COLORS[color === 'green' ? 'excellent' : 
                     color === 'yellow' ? 'good' : 
                     color === 'orange' ? 'warning' : 'danger'].class;
}