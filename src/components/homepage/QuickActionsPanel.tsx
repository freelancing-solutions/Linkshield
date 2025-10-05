/**
 * QuickActionsPanel Component
 * 
 * Provides quick access to common LinkShield features for authenticated users.
 * Displays action buttons and recent activity summary.
 * 
 * Features:
 * - Quick action buttons (Scan History, API Keys, Settings, Reports)
 * - Recent activity summary
 * - Responsive grid layout
 * - Icon-based navigation
 * 
 * @requires Authentication
 */

'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Key, 
  Settings, 
  FileText,
  Upload,
  Brain,
  ArrowRight,
  Clock
} from 'lucide-react';

/**
 * Quick action configuration
 */
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: typeof History;
  href: string;
  badge?: string;
  color: string;
}

/**
 * Component props
 */
interface QuickActionsPanelProps {
  className?: string;
  recentActivity?: {
    lastScan?: string;
    totalScans?: number;
    lastReport?: string;
  };
}

/**
 * QuickActionsPanel Component
 */
export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ 
  className = '',
  recentActivity 
}) => {
  const router = useRouter();

  /**
   * Quick actions configuration
   */
  const quickActions: QuickAction[] = [
    {
      id: 'scan-history',
      title: 'Scan History',
      description: 'View all your URL checks',
      icon: History,
      href: '/dashboard/url-analysis',
      badge: recentActivity?.totalScans ? `${recentActivity.totalScans}` : undefined,
      color: 'text-blue-600',
    },
    {
      id: 'bulk-check',
      title: 'Bulk URL Check',
      description: 'Check multiple URLs at once',
      icon: Upload,
      href: '/dashboard/url-analysis/bulk',
      color: 'text-purple-600',
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Analyze content with AI',
      icon: Brain,
      href: '/dashboard/ai-analysis',
      color: 'text-green-600',
    },
    {
      id: 'reports',
      title: 'View Reports',
      description: 'Community security reports',
      icon: FileText,
      href: '/dashboard/reports',
      color: 'text-orange-600',
    },
    {
      id: 'api-keys',
      title: 'API Keys',
      description: 'Manage your API keys',
      icon: Key,
      href: '/dashboard/api-keys',
      color: 'text-red-600',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Account preferences',
      icon: Settings,
      href: '/dashboard/profile',
      color: 'text-gray-600',
    },
  ];

  /**
   * Handle action click
   */
  const handleActionClick = (href: string) => {
    router.push(href);
  };

  /**
   * Format relative time
   */
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Fast access to your most-used features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleActionClick(action.href)}
                className="h-auto flex-col items-start p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Icon className={`h-5 w-5 ${action.color}`} />
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-left w-full">
                  <p className="font-semibold text-sm mb-1">{action.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Recent Activity Summary */}
        {recentActivity && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Recent Activity</h4>
            
            <div className="space-y-2">
              {recentActivity.lastScan && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Last scan</span>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {formatRelativeTime(recentActivity.lastScan)}
                  </span>
                </div>
              )}

              {recentActivity.totalScans !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <History className="h-4 w-4" />
                    <span>Total scans</span>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {recentActivity.totalScans.toLocaleString()}
                  </span>
                </div>
              )}

              {recentActivity.lastReport && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Last report</span>
                  </div>
                  <span className="text-gray-900 font-medium">
                    {formatRelativeTime(recentActivity.lastReport)}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleActionClick('/dashboard')}
              className="w-full justify-between"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
