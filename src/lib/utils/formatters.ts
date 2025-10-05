/**
 * Utility functions for formatting data
 * 
 * This module provides common formatting functions for dates, numbers,
 * currency, and other data types used throughout the application.
 */

/**
 * Format date for display
 * 
 * Converts an ISO date string to a human-readable format.
 * 
 * @param dateString - ISO date string to format
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate('2024-01-15T00:00:00Z') // Returns "Jan 15, 2024"
 * formatDate('2024-01-15T00:00:00Z', { dateStyle: 'full' }) // Returns "Monday, January 15, 2024"
 * ```
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Format timestamp for display with time
 * 
 * Converts an ISO date string to a human-readable format with time.
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted timestamp string
 * 
 * @example
 * ```typescript
 * formatTimestamp('2024-01-15T14:30:00Z') // Returns "Jan 15, 2024 at 2:30 PM"
 * ```
 */
export const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (time ago)
 * 
 * Converts a timestamp to a relative time string (e.g., "2 hours ago").
 * 
 * @param timestamp - ISO date string or Date object
 * @returns Relative time string
 * 
 * @example
 * ```typescript
 * formatTimeAgo('2024-01-15T12:00:00Z') // Returns "2h ago" (if current time is 2:00 PM)
 * ```
 */
export const formatTimeAgo = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffMins < 1440) {
    return `${Math.floor(diffMins / 60)}h ago`;
  } else {
    return `${Math.floor(diffMins / 1440)}d ago`;
  }
};

/**
 * Format number with locale-specific formatting
 * 
 * @param value - Number to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * formatNumber(1234.56) // Returns "1,234.56"
 * formatNumber(1234.56, { maximumFractionDigits: 0 }) // Returns "1,235"
 * ```
 */
export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  return value.toLocaleString('en-US', options);
};

/**
 * Format currency value
 * 
 * @param value - Number to format as currency
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // Returns "€1,234.56"
 * ```
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
};

/**
 * Format percentage value
 * 
 * @param value - Number to format as percentage (0-100 scale)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 * 
 * @example
 * ```typescript
 * formatPercentage(75.5) // Returns "75.5%"
 * formatPercentage(75.567, 2) // Returns "75.57%"
 * ```
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size in human-readable format
 * 
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 * 
 * @example
 * ```typescript
 * formatFileSize(1024) // Returns "1.00 KB"
 * formatFileSize(1048576) // Returns "1.00 MB"
 * ```
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format duration in human-readable format
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 * 
 * @example
 * ```typescript
 * formatDuration(65) // Returns "1m 5s"
 * formatDuration(3665) // Returns "1h 1m 5s"
 * ```
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

/**
 * Calculate percentage change between two values
 * 
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change
 * 
 * @example
 * ```typescript
 * calculatePercentageChange(120, 100) // Returns 20
 * calculatePercentageChange(80, 100) // Returns -20
 * ```
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Format trend value with appropriate suffix
 * 
 * @param value - Numeric value to format
 * @param type - Type of formatting to apply
 * @returns Formatted trend value string
 * 
 * @example
 * ```typescript
 * formatTrendValue(25.5, 'percentage') // Returns "25.5%"
 * formatTrendValue(1500, 'currency') // Returns "$1,500"
 * formatTrendValue(1234, 'number') // Returns "1,234"
 * ```
 */
export const formatTrendValue = (
  value: number,
  type: 'percentage' | 'number' | 'currency' = 'percentage'
): string => {
  switch (type) {
    case 'percentage':
      return `${Math.abs(value).toFixed(1)}%`;
    case 'currency':
      return `$${Math.abs(value).toLocaleString()}`;
    case 'number':
    default:
      return Math.abs(value).toLocaleString();
  }
};

/**
 * Capitalize first letter of each word
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * ```typescript
 * capitalizeWords('hello world') // Returns "Hello World"
 * capitalizeWords('user_profile') // Returns "User Profile"
 * ```
 */
export const capitalizeWords = (str: string): string => {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * ```typescript
 * truncateText('This is a long text', 10) // Returns "This is a..."
 * truncateText('Short', 10) // Returns "Short"
 * ```
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};