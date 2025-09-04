import { createClient, RedisClientType } from 'redis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export class CacheService {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private defaultTTL = 3600; // 1 hour default
  private keyPrefix = 'linkshield:';

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Only initialize Redis if URL is provided
      const redisUrl = process.env.REDIS_URL;
      if (!redisUrl) {
        console.warn('Redis URL not provided, caching will be disabled');
        return;
      }

      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              console.error('Redis connection failed after 3 retries');
              return false;
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Redis Client Disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      this.client = null;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const value = await this.client!.get(this.getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const ttl = options.ttl || this.defaultTTL;
      const serializedValue = JSON.stringify(value);
      
      await this.client!.setEx(this.getKey(key), ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const result = await this.client!.del(this.getKey(key));
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const keys = await this.client!.keys(this.getKey(pattern));
      if (keys.length === 0) {
        return 0;
      }
      
      return await this.client!.del(keys);
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const result = await this.client!.exists(this.getKey(key));
      return result > 0;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Get multiple values from cache
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isAvailable() || keys.length === 0) {
      return keys.map(() => null);
    }

    try {
      const prefixedKeys = keys.map(key => this.getKey(key));
      const values = await this.client!.mGet(prefixedKeys);
      
      return values.map(value => {
        try {
          return value ? JSON.parse(value) : null;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple values in cache
   */
  async mset<T>(keyValuePairs: Array<{ key: string; value: T; ttl?: number }>): Promise<boolean> {
    if (!this.isAvailable() || keyValuePairs.length === 0) {
      return false;
    }

    try {
      // Use pipeline for better performance
      const pipeline = this.client!.multi();
      
      for (const { key, value, ttl } of keyValuePairs) {
        const serializedValue = JSON.stringify(value);
        const cacheTTL = ttl || this.defaultTTL;
        pipeline.setEx(this.getKey(key), cacheTTL, serializedValue);
      }
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async increment(key: string, amount: number = 1): Promise<number | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      return await this.client!.incrBy(this.getKey(key), amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return null;
    }
  }

  /**
   * Set expiration time for a key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const result = await this.client!.expire(this.getKey(key), ttl);
      return result;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  /**
   * Get time to live for a key
   */
  async ttl(key: string): Promise<number | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      return await this.client!.ttl(this.getKey(key));
    } catch (error) {
      console.error('Cache ttl error:', error);
      return null;
    }
  }

  /**
   * Clear all cache entries with the configured prefix
   */
  async clear(): Promise<number> {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const keys = await this.client!.keys(`${this.keyPrefix}*`);
      if (keys.length === 0) {
        return 0;
      }
      
      return await this.client!.del(keys);
    } catch (error) {
      console.error('Cache clear error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    if (!this.isAvailable()) {
      return {
        connected: false,
        keyCount: 0,
        memoryUsage: 0
      };
    }

    try {
      const info = await this.client!.info('memory');
      const keyCount = await this.client!.dbSize();
      
      // Parse memory usage from info string
      const memoryMatch = info.match(/used_memory:(\d+)/);
      const memoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      return {
        connected: this.isConnected,
        keyCount,
        memoryUsage
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        connected: false,
        keyCount: 0,
        memoryUsage: 0
      };
    }
  }

  /**
   * Close the Redis connection
   */
  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      try {
        await this.client.disconnect();
        this.isConnected = false;
      } catch (error) {
        console.error('Error disconnecting from Redis:', error);
      }
    }
  }

  /**
   * Check if cache is available
   */
  private isAvailable(): boolean {
    return this.client !== null && this.isConnected;
  }

  /**
   * Get prefixed cache key
   */
  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * Health check for cache service
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    if (!this.client) {
      return {
        status: 'unhealthy',
        details: { error: 'Redis client not initialized' }
      };
    }

    try {
      const testKey = 'health_check';
      const testValue = Date.now().toString();
      
      await this.client.setEx(this.getKey(testKey), 10, testValue);
      const retrieved = await this.client.get(this.getKey(testKey));
      await this.client.del(this.getKey(testKey));
      
      if (retrieved === testValue) {
        return {
          status: 'healthy',
          details: { connected: this.isConnected }
        };
      } else {
        return {
          status: 'unhealthy',
          details: { error: 'Cache read/write test failed' }
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

// Singleton instance
let cacheServiceInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService();
  }
  return cacheServiceInstance;
}

// Cache key generators for different data types
export const CacheKeys = {
  report: (slug: string) => `report:${slug}`,
  recentReports: () => 'recent_reports',
  shareAnalytics: (checkId: string) => `share_analytics:${checkId}`,
  userReports: (userId: string) => `user_reports:${userId}`,
  reportStats: (userId?: string) => userId ? `report_stats:${userId}` : 'report_stats:global',
  ogImage: (slug: string) => `og_image:${slug}`,
} as const;