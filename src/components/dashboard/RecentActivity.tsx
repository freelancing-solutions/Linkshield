/**
 * @fileoverview Recent Activity Component for Dashboard
 * 
 * Displays a chronological list of user activities with timestamps, icons, and navigation links.
 * Groups activities by date and provides an empty state when no activities are available.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

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

/**
 * Activity item interface
 * 
 * Represents a single user activity with metadata for display and navigation.
 */
interface Activity {
  /** Unique identifier for the activity */
  id: string;
  /** Type of activity that determines icon and styling */
  type: 'scan' | 'alert' | 'project' | 'team' | 'settings' | 'report';
  /** Main title/description of the activity */
  title: string;
  /** Detailed description of what happened */
  description: string;
  /** ISO timestamp string of when the activity occurred */
  timestamp: string;
  /** Optional navigation link for the activity */
  link?: string;
}

/**
 * Props for the RecentActivity component
 */
interface RecentActivityProps {
  /** Array of activity items to display */
  activities?: Activity[];
  /** Maximum number of activities to show (default: 10) */
  maxItems?: number;
}

/**
 * Recent Activity Component
 * 
 * Displays a chronological list of user activities grouped by date with
 * appropriate icons, timestamps, and navigation links. Includes an empty
 * state when no activities are available.
 * 
 * @component
 * @example
 * ```tsx
 * import { RecentActivity } from '@/components/dashboard/RecentActivity';
 * 
 * function Dashboard() {
 *   const activities = [
 *     {
 *       id: '1',
 *       type: 'scan',
 *       title: 'URL Scan Completed',
 *       description: 'Scanned example.com for threats',
 *       timestamp: '2024-01-15T10:30:00Z',
 *       link: '/dashboard/scans/1'
 *     }
 *   ];
 *   
 *   return (
 *     <div>
 *       <RecentActivity activities={activities} maxItems={5} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @param props.activities - Array of activity items to display
 * @param props.maxItems - Maximum number of activities to show
 * @returns JSX element containing the recent activity card
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
          <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
            <p className="text-sm text-muted-foreground mb-4">
              No recent activity to display
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/projects" aria-label="Get started with creating projects">Get Started</Link>
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
            <Link href="/dashboard/activity" className="flex items-center gap-1" aria-label="View all recent activities">
              View All
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6" role="region" aria-label="Recent activities">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} role="group" aria-labelledby={`date-${date.replace(/\s+/g, '-').toLowerCase()}`}>
              <h4 
                className="text-sm font-medium text-muted-foreground mb-3"
                id={`date-${date.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {date}
              </h4>
              <div className="space-y-3" role="list">
                {dateActivities.map((activity) => (
                  <div key={activity.id} role="listitem">
                    <ActivityItem activity={activity} />
                  </div>
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
 * Individual Activity Item Component
 * 
 * Renders a single activity item with icon, title, description, and timestamp.
 * Wraps in a Link component if the activity has a navigation link.
 * 
 * @param props - Component props
 * @param props.activity - Activity data to display
 * @returns JSX element for the activity item
 */
function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = getActivityIcon(activity.type);
  const iconColor = getActivityIconColor(activity.type);

  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors focus-within:bg-muted/50">
      <div className={`p-2 rounded-lg ${iconColor.bg}`} aria-hidden="true">
        <Icon className={`h-4 w-4 ${iconColor.text}`} aria-hidden="true" />
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
      <Link 
        href={activity.link} 
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        aria-label={`${activity.title} - ${activity.description}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div aria-label={`${activity.title} - ${activity.description}`}>
      {content}
    </div>
  );
}

/**
 * Get icon component for activity type
 * 
 * Maps activity types to their corresponding Lucide React icon components.
 * Provides visual distinction between different types of activities.
 * 
 * @param type - The activity type
 * @returns Lucide icon component for the activity type
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
 * 
 * Returns background and text color classes for activity type icons.
 * Uses consistent color coding across the dashboard for activity types.
 * 
 * @param type - The activity type
 * @returns Object with background and text color classes
 * @returns {string} bg - Tailwind background color class
 * @returns {string} text - Tailwind text color class
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
 * Group activities by date for chronological display
 * 
 * Groups activities into date-based sections (Today, Yesterday, specific dates).
 * Provides a chronological organization of activities for better user experience.
 * 
 * @param activities - Array of activities to group
 * @returns Object with date labels as keys and activity arrays as values
 * 
 * @example
 * ```tsx
 * const activities = [
 *   { id: '1', timestamp: '2024-01-15T10:00:00Z', ... },
 *   { id: '2', timestamp: '2024-01-14T15:00:00Z', ... }
 * ];
 * 
 * const grouped = groupActivitiesByDate(activities);
 * // Returns: { 'Today': [...], 'Yesterday': [...] }
 * ```
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
 * Check if two dates are the same calendar day
 * 
 * Utility function to compare dates by year, month, and day only,
 * ignoring time components. Used for grouping activities by date.
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if both dates are on the same calendar day
 * 
 * @example
 * ```tsx
 * const today = new Date('2024-01-15T10:00:00Z');
 * const laterToday = new Date('2024-01-15T18:00:00Z');
 * const yesterday = new Date('2024-01-14T10:00:00Z');
 * 
 * isSameDay(today, laterToday); // true
 * isSameDay(today, yesterday); // false
 * ```
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
