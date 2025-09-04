import { PrismaClient } from '@prisma/client';
import { db } from '../db';
import { ShareableReportService, ShareableReportServiceOptions } from './shareable-report-service';
import { CachedShareableReportService, CachedShareableReportServiceOptions } from './cached-shareable-report-service';
import { getCacheService } from './cache-service';

/**
 * Factory function to create a shareable report service
 * Automatically uses cached version if Redis is available
 */
export function createShareableReportService(
  prisma: PrismaClient = db,
  options: CachedShareableReportServiceOptions = {}
): ShareableReportService | CachedShareableReportService {
  // Check if caching should be enabled
  const shouldUseCache = process.env.REDIS_URL && process.env.NODE_ENV === 'production';
  
  if (shouldUseCache) {
    return new CachedShareableReportService(prisma, {
      ...options,
      cacheService: options.cacheService || getCacheService(),
    });
  } else {
    // Fallback to non-cached service for development or when Redis is not available
    return new ShareableReportService(prisma, options);
  }
}

/**
 * Singleton instance of the shareable report service
 */
let shareableReportServiceInstance: ShareableReportService | CachedShareableReportService | null = null;

export function getShareableReportService(): ShareableReportService | CachedShareableReportService {
  if (!shareableReportServiceInstance) {
    shareableReportServiceInstance = createShareableReportService();
  }
  return shareableReportServiceInstance;
}

// Re-export all services and types
export * from './shareable-report-service';
export * from './cached-shareable-report-service';
export * from './cache-service';
export * from './slug-generator';
export * from './analytics-service';
export * from './cache-manager';