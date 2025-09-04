// src/lib/__tests__/utils.test.ts
import { describe, it, expect, vi } from 'vitest';
import { formatTimeAgo, formatRecentReportForDisplay } from '../utils';
import { RecentReport } from '../types/shareable-reports';

describe('utils', () => {
  describe('formatTimeAgo', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format seconds correctly', () => {
      const now = new Date();
      vi.setSystemTime(now);
      const date = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      expect(formatTimeAgo(date)).toBe('30 seconds ago');
    });

    it('should format minutes correctly', () => {
      const now = new Date();
      vi.setSystemTime(now);
      const date = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
      expect(formatTimeAgo(date)).toBe('5 minutes ago');
    });

    it('should format hours correctly', () => {
      const now = new Date();
      vi.setSystemTime(now);
      const date = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(formatTimeAgo(date)).toBe('2 hours ago');
    });

    it('should format days correctly', () => {
      const now = new Date();
      vi.setSystemTime(now);
      const date = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      expect(formatTimeAgo(date)).toBe('3 days ago');
    });

    it('should format months correctly', () => {
      const now = new Date();
      vi.setSystemTime(now);
      const date = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // 1 month ago
      expect(formatTimeAgo(date)).toBe('1 months ago');
    });

    it('should format years correctly', () => {
      const now = new Date();
      vi.setSystemTime(now);
      const date = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // 1 year ago
      expect(formatTimeAgo(date)).toBe('1 years ago');
    });
  });

  describe('formatRecentReportForDisplay', () => {
    it('should format a RecentReport into a DisplayReport', () => {
      const mockReport: RecentReport = {
        id: 'test-id',
        slug: 'test-slug',
        url: 'https://www.example.com/very/long/path/to/a/page',
        domain: 'example.com',
        securityScore: 75,
        createdAt: new Date(),
        hasAIAnalysis: true,
      };

      const displayReport = formatRecentReportForDisplay(mockReport);

      expect(displayReport).toHaveProperty('slug', 'test-slug');
      expect(displayReport).toHaveProperty('domain', 'example.com');
      expect(displayReport).toHaveProperty('securityScore', 75);
      expect(displayReport).toHaveProperty('hasAI', true);
      expect(displayReport).toHaveProperty('scoreColor');
      expect(displayReport).toHaveProperty('timeAgo');
      expect(displayReport.displayUrl).toBe('example.com...'); // Truncated
    });

    it('should not truncate short URLs', () => {
      const mockReport: RecentReport = {
        id: 'test-id',
        slug: 'short-url',
        url: 'https://short.com/path',
        domain: 'short.com',
        securityScore: 90,
        createdAt: new Date(),
        hasAIAnalysis: false,
      };

      const displayReport = formatRecentReportForDisplay(mockReport);
      expect(displayReport.displayUrl).toBe('https://short.com/path'); // Not truncated
    });

    it('should handle null securityScore', () => {
      const mockReport: RecentReport = {
        id: 'test-id',
        slug: 'null-score',
        url: 'https://null.com',
        domain: 'null.com',
        securityScore: null,
        createdAt: new Date(),
        hasAIAnalysis: false,
      };

      const displayReport = formatRecentReportForDisplay(mockReport);
      expect(displayReport.securityScore).toBe(0); // Default to 0
      expect(displayReport.scoreColor).toBe('red'); // Default color for null/0 score
    });
  });
});
