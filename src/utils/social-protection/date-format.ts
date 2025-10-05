/**
 * Date Formatting Utilities for Social Protection
 * 
 * Specialized date formatting utilities for social protection features.
 * Provides social media context-aware formatting, relative time displays,
 * and time-sensitive formatting for alerts, scans, and monitoring data.
 * 
 * Features:
 * - Social media timestamp formatting
 * - Relative time with social context
 * - Alert and notification timestamps
 * - Scan and monitoring time displays
 * - Time zone handling
 * - Localized formatting
 */

/**
 * Time display formats for different contexts
 */
export enum TimeFormat {
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
  DETAILED = 'detailed',
  COMPACT = 'compact',
  SOCIAL = 'social',
}

/**
 * Time context for social protection features
 */
export enum TimeContext {
  ALERT = 'alert',
  SCAN = 'scan',
  MONITORING = 'monitoring',
  ACTIVITY = 'activity',
  REPORT = 'report',
  GENERAL = 'general',
}

/**
 * Formatting options for social protection dates
 */
export interface SocialDateFormatOptions {
  format: TimeFormat;
  context: TimeContext;
  includeTime: boolean;
  includeSeconds: boolean;
  showRelative: boolean;
  maxRelativeDays: number;
  timezone?: string;
  locale?: string;
}

/**
 * Default formatting options
 */
export const DEFAULT_FORMAT_OPTIONS: SocialDateFormatOptions = {
  format: TimeFormat.RELATIVE,
  context: TimeContext.GENERAL,
  includeTime: true,
  includeSeconds: false,
  showRelative: true,
  maxRelativeDays: 7,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  locale: 'en-US',
};

/**
 * Time intervals in milliseconds
 */
const TIME_INTERVALS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

/**
 * Format date for social protection context
 * 
 * @param date - Date to format (string, Date, or timestamp)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatSocialDate(
  date: string | Date | number,
  options: Partial<SocialDateFormatOptions> = {}
): string {
  const opts = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const dateObj = normalizeDate(date);
  
  if (!dateObj) return 'Invalid date';
  
  switch (opts.format) {
    case TimeFormat.RELATIVE:
      return formatRelativeTime(dateObj, opts);
    case TimeFormat.ABSOLUTE:
      return formatAbsoluteTime(dateObj, opts);
    case TimeFormat.DETAILED:
      return formatDetailedTime(dateObj, opts);
    case TimeFormat.COMPACT:
      return formatCompactTime(dateObj, opts);
    case TimeFormat.SOCIAL:
      return formatSocialTime(dateObj, opts);
    default:
      return formatRelativeTime(dateObj, opts);
  }
}

/**
 * Normalize date input to Date object
 * 
 * @param date - Date input
 * @returns Date object or null if invalid
 */
function normalizeDate(date: string | Date | number): Date | null {
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  if (typeof date === 'number') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 * 
 * @param date - Date object
 * @param options - Formatting options
 * @returns Relative time string
 */
function formatRelativeTime(date: Date, options: SocialDateFormatOptions): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const isFuture = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);
  
  // If beyond max relative days, show absolute date
  if (absDiffMs > options.maxRelativeDays * TIME_INTERVALS.DAY) {
    return formatAbsoluteTime(date, options);
  }
  
  // Context-specific formatting
  const suffix = isFuture ? 'from now' : 'ago';
  const prefix = isFuture ? 'in ' : '';
  
  // Special handling for very recent times
  if (absDiffMs < TIME_INTERVALS.MINUTE) {
    return options.context === TimeContext.ALERT ? 'Just now' : 'Now';
  }
  
  if (absDiffMs < TIME_INTERVALS.HOUR) {
    const minutes = Math.floor(absDiffMs / TIME_INTERVALS.MINUTE);
    const unit = minutes === 1 ? 'minute' : 'minutes';
    return `${prefix}${minutes} ${unit} ${suffix}`;
  }
  
  if (absDiffMs < TIME_INTERVALS.DAY) {
    const hours = Math.floor(absDiffMs / TIME_INTERVALS.HOUR);
    const unit = hours === 1 ? 'hour' : 'hours';
    return `${prefix}${hours} ${unit} ${suffix}`;
  }
  
  if (absDiffMs < TIME_INTERVALS.WEEK) {
    const days = Math.floor(absDiffMs / TIME_INTERVALS.DAY);
    const unit = days === 1 ? 'day' : 'days';
    return `${prefix}${days} ${unit} ${suffix}`;
  }
  
  const weeks = Math.floor(absDiffMs / TIME_INTERVALS.WEEK);
  const unit = weeks === 1 ? 'week' : 'weeks';
  return `${prefix}${weeks} ${unit} ${suffix}`;
}

/**
 * Format absolute time with context awareness
 * 
 * @param date - Date object
 * @param options - Formatting options
 * @returns Absolute time string
 */
function formatAbsoluteTime(date: Date, options: SocialDateFormatOptions): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: options.timezone,
  };
  
  // Context-specific formatting
  switch (options.context) {
    case TimeContext.ALERT:
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      formatOptions.hour = 'numeric';
      formatOptions.minute = '2-digit';
      if (options.includeSeconds) {
        formatOptions.second = '2-digit';
      }
      break;
      
    case TimeContext.SCAN:
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      formatOptions.year = 'numeric';
      if (options.includeTime) {
        formatOptions.hour = 'numeric';
        formatOptions.minute = '2-digit';
      }
      break;
      
    case TimeContext.MONITORING:
      formatOptions.month = 'numeric';
      formatOptions.day = 'numeric';
      formatOptions.year = '2-digit';
      formatOptions.hour = 'numeric';
      formatOptions.minute = '2-digit';
      break;
      
    case TimeContext.ACTIVITY:
      formatOptions.weekday = 'short';
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      formatOptions.hour = 'numeric';
      formatOptions.minute = '2-digit';
      break;
      
    case TimeContext.REPORT:
      formatOptions.year = 'numeric';
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      if (options.includeTime) {
        formatOptions.hour = 'numeric';
        formatOptions.minute = '2-digit';
        formatOptions.timeZoneName = 'short';
      }
      break;
      
    default:
      formatOptions.year = 'numeric';
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      if (options.includeTime) {
        formatOptions.hour = 'numeric';
        formatOptions.minute = '2-digit';
      }
  }
  
  return date.toLocaleString(options.locale, formatOptions);
}

/**
 * Format detailed time with full context
 * 
 * @param date - Date object
 * @param options - Formatting options
 * @returns Detailed time string
 */
function formatDetailedTime(date: Date, options: SocialDateFormatOptions): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: options.timezone,
    timeZoneName: 'short',
  };
  
  if (options.includeSeconds) {
    formatOptions.second = '2-digit';
  }
  
  return date.toLocaleString(options.locale, formatOptions);
}

/**
 * Format compact time for space-constrained displays
 * 
 * @param date - Date object
 * @param options - Formatting options
 * @returns Compact time string
 */
function formatCompactTime(date: Date, options: SocialDateFormatOptions): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  
  // Very recent - show relative
  if (absDiffMs < TIME_INTERVALS.HOUR) {
    const minutes = Math.floor(absDiffMs / TIME_INTERVALS.MINUTE);
    return minutes < 1 ? 'now' : `${minutes}m`;
  }
  
  // Same day - show time
  if (isSameDay(date, now)) {
    return date.toLocaleTimeString(options.locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  
  // This week - show day and time
  if (absDiffMs < TIME_INTERVALS.WEEK) {
    return date.toLocaleDateString(options.locale, {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  
  // This year - show month and day
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(options.locale, {
      month: 'short',
      day: 'numeric',
    });
  }
  
  // Different year - show year
  return date.toLocaleDateString(options.locale, {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });
}

/**
 * Format time in social media style (Twitter-like)
 * 
 * @param date - Date object
 * @param options - Formatting options
 * @returns Social media style time string
 */
function formatSocialTime(date: Date, options: SocialDateFormatOptions): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  
  if (absDiffMs < TIME_INTERVALS.MINUTE) {
    return 'now';
  }
  
  if (absDiffMs < TIME_INTERVALS.HOUR) {
    const minutes = Math.floor(absDiffMs / TIME_INTERVALS.MINUTE);
    return `${minutes}m`;
  }
  
  if (absDiffMs < TIME_INTERVALS.DAY) {
    const hours = Math.floor(absDiffMs / TIME_INTERVALS.HOUR);
    return `${hours}h`;
  }
  
  if (absDiffMs < TIME_INTERVALS.WEEK) {
    const days = Math.floor(absDiffMs / TIME_INTERVALS.DAY);
    return `${days}d`;
  }
  
  // For older dates, show actual date
  return date.toLocaleDateString(options.locale, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Check if two dates are on the same day
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format time range for monitoring periods
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @param options - Formatting options
 * @returns Formatted time range string
 */
export function formatTimeRange(
  startDate: string | Date | number,
  endDate: string | Date | number,
  options: Partial<SocialDateFormatOptions> = {}
): string {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  
  if (!start || !end) return 'Invalid date range';
  
  const opts = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  
  // Same day range
  if (isSameDay(start, end)) {
    const dateStr = formatSocialDate(start, { ...opts, includeTime: false });
    const startTime = start.toLocaleTimeString(opts.locale, {
      hour: 'numeric',
      minute: '2-digit',
    });
    const endTime = end.toLocaleTimeString(opts.locale, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dateStr}, ${startTime} - ${endTime}`;
  }
  
  // Different days
  const startStr = formatSocialDate(start, opts);
  const endStr = formatSocialDate(end, opts);
  return `${startStr} - ${endStr}`;
}

/**
 * Format duration between two dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Human-readable duration string
 */
export function formatDuration(
  startDate: string | Date | number,
  endDate: string | Date | number
): string {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  
  if (!start || !end) return 'Invalid duration';
  
  const diffMs = Math.abs(end.getTime() - start.getTime());
  
  if (diffMs < TIME_INTERVALS.MINUTE) {
    const seconds = Math.floor(diffMs / TIME_INTERVALS.SECOND);
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  if (diffMs < TIME_INTERVALS.HOUR) {
    const minutes = Math.floor(diffMs / TIME_INTERVALS.MINUTE);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (diffMs < TIME_INTERVALS.DAY) {
    const hours = Math.floor(diffMs / TIME_INTERVALS.HOUR);
    const minutes = Math.floor((diffMs % TIME_INTERVALS.HOUR) / TIME_INTERVALS.MINUTE);
    if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours}h ${minutes}m`;
  }
  
  const days = Math.floor(diffMs / TIME_INTERVALS.DAY);
  const hours = Math.floor((diffMs % TIME_INTERVALS.DAY) / TIME_INTERVALS.HOUR);
  if (hours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  return `${days}d ${hours}h`;
}

/**
 * Format scan timestamp with context
 * 
 * @param date - Scan date
 * @param status - Scan status
 * @returns Formatted scan timestamp
 */
export function formatScanTimestamp(
  date: string | Date | number,
  status: 'completed' | 'running' | 'failed' | 'pending' = 'completed'
): string {
  const prefix = {
    completed: 'Completed',
    running: 'Started',
    failed: 'Failed',
    pending: 'Scheduled for',
  }[status];
  
  const formattedDate = formatSocialDate(date, {
    format: TimeFormat.RELATIVE,
    context: TimeContext.SCAN,
    maxRelativeDays: 1,
  });
  
  return `${prefix} ${formattedDate}`;
}

/**
 * Format alert timestamp with urgency context
 * 
 * @param date - Alert date
 * @param severity - Alert severity
 * @returns Formatted alert timestamp
 */
export function formatAlertTimestamp(
  date: string | Date | number,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): string {
  const options: Partial<SocialDateFormatOptions> = {
    format: TimeFormat.RELATIVE,
    context: TimeContext.ALERT,
    maxRelativeDays: severity === 'critical' ? 0.5 : 3,
  };
  
  return formatSocialDate(date, options);
}

/**
 * Format monitoring period for display
 * 
 * @param hours - Monitoring period in hours
 * @returns Human-readable monitoring period
 */
export function formatMonitoringPeriod(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  const days = Math.round(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

/**
 * Get time zone display name
 * 
 * @param timezone - IANA timezone identifier
 * @param locale - Locale for formatting
 * @returns Human-readable timezone name
 */
export function getTimezoneDisplay(timezone?: string, locale: string = 'en-US'): string {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      timeZoneName: 'long',
    });
    
    const parts = formatter.formatToParts(new Date());
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    
    return timeZonePart?.value || tz;
  } catch {
    return tz;
  }
}

/**
 * Check if date is within business hours
 * 
 * @param date - Date to check
 * @param timezone - Timezone to check against
 * @returns True if within business hours (9 AM - 5 PM weekdays)
 */
export function isBusinessHours(date: string | Date | number, timezone?: string): boolean {
  const dateObj = normalizeDate(date);
  if (!dateObj) return false;
  
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour: 'numeric',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(dateObj);
    const weekday = parts.find(p => p.type === 'weekday')?.value;
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    
    const isWeekday = !['Sat', 'Sun'].includes(weekday || '');
    const isBusinessHour = hour >= 9 && hour < 17;
    
    return isWeekday && isBusinessHour;
  } catch {
    return false;
  }
}