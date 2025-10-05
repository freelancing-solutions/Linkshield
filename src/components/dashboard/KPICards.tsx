'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, AlertTriangle, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import type { DashboardOverview } from '@/types/dashboard';

interface KPICardsProps {
  data: DashboardOverview;
}

/**
 * KPI Cards Component
 * 
 * Displays key performance indicators for the dashboard overview.
 * Shows total projects, active alerts, and recent scans with trend indicators.
 */
export function KPICards({ data }: KPICardsProps) {
  // Get metrics based on user's primary role
  const metrics = getMetricsForRole(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Link
          key={metric.id}
          href={metric.link}
          className="block transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
          aria-label={`View ${metric.label}: ${metric.value}${metric.subtitle ? `. ${metric.subtitle}` : ''}`}
          tabIndex={0}
          onKeyDown={(e) => {
            // Handle Enter and Space key navigation
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
        >
          <Card className="cursor-pointer hover:shadow-lg focus-within:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <div 
                className={`p-2 rounded-lg ${metric.iconBg}`}
                aria-hidden="true"
              >
                <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" aria-label={`${metric.value} ${metric.label}`}>
                {metric.value}
              </div>
              {metric.trend && (
                <div className="flex items-center gap-1 mt-1" role="img" aria-label={`Trend: ${metric.trend.direction} ${metric.trend.value} ${metric.trend.label}`}>
                  {metric.trend.direction === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" aria-hidden="true" />
                  )}
                  <span
                    className={`text-xs ${
                      metric.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.trend.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{metric.trend.label}</span>
                </div>
              )}
              {metric.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

/**
 * Get metrics based on user's primary role
 */
function getMetricsForRole(data: DashboardOverview) {
  const role = data.user_role;

  // Web Developer metrics
  if (role === 'web_developer' && data.web_developer) {
    return [
      {
        id: 'projects',
        label: 'Total Projects',
        value: data.web_developer.total_projects,
        icon: FolderKanban,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        link: '/dashboard/projects',
        subtitle: `${data.web_developer.active_monitoring} actively monitored`,
      },
      {
        id: 'alerts',
        label: 'Active Alerts',
        value: data.web_developer.active_alerts,
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        link: '/dashboard/alerts',
        subtitle: 'Requires attention',
      },
      {
        id: 'scans',
        label: 'Total Scans',
        value: data.web_developer.total_scans.toLocaleString(),
        icon: Activity,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        link: '/dashboard/url-analysis',
        subtitle: 'All time',
      },
      {
        id: 'api_usage',
        label: 'API Usage',
        value: `${data.web_developer.api_usage.percentage}%`,
        icon: Activity,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        link: '/dashboard/api-keys',
        subtitle: `${data.web_developer.api_usage.current_usage.toLocaleString()} / ${data.web_developer.api_usage.limit.toLocaleString()}`,
      },
    ];
  }

  // Social Media Manager metrics
  if (role === 'social_media' && data.social_media) {
    return [
      {
        id: 'platforms',
        label: 'Connected Platforms',
        value: data.social_media.connected_platforms,
        icon: FolderKanban,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        link: '/dashboard/social-media/platforms',
        subtitle: 'Active connections',
      },
      {
        id: 'risk',
        label: 'Risk Score',
        value: data.social_media.risk_score,
        icon: AlertTriangle,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        link: '/dashboard/social-media/risk',
        subtitle: 'Out of 100',
      },
      {
        id: 'algorithm',
        label: 'Algorithm Health',
        value: `${data.social_media.algorithm_health}%`,
        icon: Activity,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        link: '/dashboard/social-media/algorithm',
        subtitle: 'Overall health',
      },
      {
        id: 'crises',
        label: 'Active Crises',
        value: data.social_media.active_crises,
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        link: '/dashboard/social-media/crises',
        subtitle: 'Requires attention',
      },
    ];
  }

  // Brand Manager metrics
  if (role === 'brand_manager' && data.brand_manager) {
    return [
      {
        id: 'mentions',
        label: 'Brand Mentions',
        value: data.brand_manager.brand_mentions.toLocaleString(),
        icon: Activity,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        link: '/dashboard/brand/mentions',
        subtitle: 'Last 30 days',
      },
      {
        id: 'reputation',
        label: 'Reputation Score',
        value: data.brand_manager.reputation_score,
        icon: TrendingUp,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        link: '/dashboard/brand/reputation',
        subtitle: 'Out of 100',
      },
      {
        id: 'crises',
        label: 'Active Crises',
        value: data.brand_manager.active_crises,
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        link: '/dashboard/brand/crises',
        subtitle: 'Requires attention',
      },
      {
        id: 'sentiment',
        label: 'Sentiment Score',
        value: `${data.brand_manager.sentiment_score}%`,
        icon: Activity,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        link: '/dashboard/brand/sentiment',
        subtitle: 'Positive sentiment',
      },
    ];
  }

  // News/Media metrics
  if (role === 'news_media' && data.news_media) {
    return [
      {
        id: 'verified',
        label: 'Content Verified',
        value: data.news_media.content_verified.toLocaleString(),
        icon: Activity,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        link: '/dashboard/news/verified',
        subtitle: 'Total verifications',
      },
      {
        id: 'sources',
        label: 'Sources Checked',
        value: data.news_media.sources_checked.toLocaleString(),
        icon: FolderKanban,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        link: '/dashboard/news/sources',
        subtitle: 'All time',
      },
      {
        id: 'misinformation',
        label: 'Misinformation Detected',
        value: data.news_media.misinformation_detected,
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        link: '/dashboard/news/misinformation',
        subtitle: 'Flagged content',
      },
      {
        id: 'credibility',
        label: 'Credibility Score',
        value: `${data.news_media.credibility_score}%`,
        icon: TrendingUp,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        link: '/dashboard/news/credibility',
        subtitle: 'Average score',
      },
    ];
  }

  // Executive metrics
  if (role === 'executive' && data.executive) {
    return [
      {
        id: 'risk',
        label: 'Overall Risk Score',
        value: data.executive.overall_risk_score,
        icon: AlertTriangle,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        link: '/dashboard/executive/risk',
        subtitle: 'Out of 100',
      },
      {
        id: 'threats',
        label: 'Threats Prevented',
        value: data.executive.threats_prevented.toLocaleString(),
        icon: Activity,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        link: '/dashboard/executive/threats',
        subtitle: 'All time',
      },
      {
        id: 'savings',
        label: 'Cost Savings',
        value: `$${(data.executive.cost_savings / 1000).toFixed(1)}K`,
        icon: TrendingUp,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        link: '/dashboard/executive/roi',
        subtitle: 'Estimated savings',
      },
      {
        id: 'roi',
        label: 'ROI',
        value: `${data.executive.roi_percentage}%`,
        icon: TrendingUp,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        link: '/dashboard/executive/roi',
        subtitle: 'Return on investment',
      },
    ];
  }

  // Default metrics if no role-specific data
  return [
    {
      id: 'projects',
      label: 'Total Projects',
      value: 0,
      icon: FolderKanban,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/dashboard/projects',
      subtitle: 'No projects yet',
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: 0,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/dashboard/alerts',
      subtitle: 'No alerts',
    },
    {
      id: 'scans',
      label: 'Total Scans',
      value: 0,
      icon: Activity,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/dashboard/url-analysis',
      subtitle: 'Get started',
    },
  ];
}
