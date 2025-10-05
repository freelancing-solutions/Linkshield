'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  AlertTriangle,
  Activity,
  UserPlus,
  Settings,
  FileText,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'scan' | 'alert' | 'project' | 'team' | 'settings' | 'report';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  maxItems?: number;
}

/**
 * Recent Activity Component
 * 
 * Displays a list of recent user activities with timestamps and icons.
 * Groups activities by date and provides links to relevant sections.
 */
export function RecentActivity({ activities = [], maxItems = 10 }: RecentActivityProps) {
  // Limit activities to maxItems
  const displayedActivities = activities.slice(0, maxItems);

  // Group activities by date
  const groupedActivities = groupActivitiesByDate(displayedActivities);

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No recent activity to display
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/projects">Get Started</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and updates</CardDescription>
        </div>
        {activities.length > maxItems && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/activity" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{date}</h4>
              <div className="space-y-3">
                {dateActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Individual Activity Item
 */
function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = getActivityIcon(activity.type);
  const iconColor = getActivityIconColor(activity.type);

  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-lg ${iconColor.bg}`}>
        <Icon className={`h-4 w-4 ${iconColor.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none mb-1">{activity.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );

  if (activity.link) {
    return (
      <Link href={activity.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * Get icon for activity type
 */
function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'scan':
      return Activity;
    case 'alert':
      return AlertTriangle;
    case 'project':
      return CheckCircle2;
    case 'team':
      return UserPlus;
    case 'settings':
      return Settings;
    case 'report':
      return FileText;
    default:
      return Activity;
  }
}

/**
 * Get icon colors for activity type
 */
function getActivityIconColor(type: Activity['type']) {
  switch (type) {
    case 'scan':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'alert':
      return { bg: 'bg-red-100', text: 'text-red-600' };
    case 'project':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    case 'team':
      return { bg: 'bg-purple-100', text: 'text-purple-600' };
    case 'settings':
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
    case 'report':
      return { bg: 'bg-orange-100', text: 'text-orange-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
}

/**
 * Group activities by date
 */
function groupActivitiesByDate(activities: Activity[]): Record<string, Activity[]> {
  const groups: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const date = new Date(activity.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel: string;

    if (isSameDay(date, today)) {
      dateLabel = 'Today';
    } else if (isSameDay(date, yesterday)) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(activity);
  });

  return groups;
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
