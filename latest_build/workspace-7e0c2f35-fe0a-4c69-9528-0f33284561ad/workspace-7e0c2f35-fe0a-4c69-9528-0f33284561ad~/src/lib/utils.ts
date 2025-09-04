import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { RecentReport, DisplayReport, getScoreColor } from "./types/shareable-reports";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this function - converts color names to Tailwind classes
export function getScoreColorClass(score: number | null): string {
  const color = getScoreColor(score);
  
  switch (color) {
    case 'green':
      return 'text-green-500';
    case 'yellow':
      return 'text-yellow-500';
    case 'orange':
      return 'text-orange-500';
    case 'red':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

// Optional: Add a background color variant too
export function getScoreBgColorClass(score: number | null): string {
  const color = getScoreColor(score);
  
  switch (color) {
    case 'green':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'yellow':
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'orange':
      return 'bg-orange-100 dark:bg-orange-900/30';
    case 'red':
      return 'bg-red-100 dark:bg-red-900/30';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30';
  }
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function formatRecentReportForDisplay(report: RecentReport): DisplayReport {
  const MAX_URL_LENGTH = 30; // Max length for the displayed URL

  let displayUrl = report.url;
  if (report.url.length > MAX_URL_LENGTH) {
    // Simple truncation: show domain + ellipsis
    displayUrl = report.domain + '...';
  }

  return {
    slug: report.slug,
    displayUrl: displayUrl,
    domain: report.domain,
    securityScore: report.securityScore !== null ? report.securityScore : 0, // Default to 0 if null
    scoreColor: getScoreColor(report.securityScore),
    timeAgo: formatTimeAgo(report.createdAt),
    hasAI: report.hasAIAnalysis,
  };
}
