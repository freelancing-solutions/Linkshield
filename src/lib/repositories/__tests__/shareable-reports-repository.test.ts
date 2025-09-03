import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShareableReportsRepository } from '../shareable-reports-repository';
import { ShareEventData } from '../../types/shareable-reports';

// Mock Prisma client
const mockPrisma = {
  check: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  shareEvent: {
    create: vi.fn(),
    groupBy: vi.fn(),
    count: vi.fn(),
  }
};

describe('ShareableReportsRepository', () => {
  let repository: ShareableReportsRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ShareableReportsRepository(mockPrisma as any);
  });

  describe('findBySlug', () => {
    it('should find report by slug with related data', async () => {
      const mockReport = {
        id: 'test-id',
        slug: 'example-com-abc123',
        url: 'https://example.com',
        securityScore: 85,
        aiAnalyses: [],
        shareEvents: []
      };

      mockPrisma.check.findUnique.mockResolvedValue(mockReport);

      const result = await repository.findBySlug('example-com-abc123');

      expect(mockPrisma.check.findUnique).toHaveBeenCalledWith({
        where: { slug: 'example-com-abc123' },
        include: {
          aiAnalyses: true,
          shareEvents: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
      expect(result).toEqual(mockReport);
    });

    it('should return null for non-existent slug', async () => {
      mockPrisma.check.findUnique.mockResolvedValue(null);

      const result = await repository.findBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findPublicBySlug', () => {
    it('should find only public reports by slug', async () => {
      const mockReport = {
        id: 'test-id',
        slug: 'example-com-abc123',
        isPublic: true,
        aiAnalyses: [],
        shareEvents: []
      };

      mockPrisma.check.findFirst.mockResolvedValue(mockReport);

      const result = await repository.findPublicBySlug('example-com-abc123');

      expect(mockPrisma.check.findFirst).toHaveBeenCalledWith({
        where: { 
          slug: 'example-com-abc123',
          isPublic: true 
        },
        include: {
          aiAnalyses: true,
          shareEvents: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
      expect(result).toEqual(mockReport);
    });
  });

  describe('getRecentPublicReports', () => {
    it('should return formatted recent reports', async () => {
      const mockReports = [
        {
          id: 'test-1',
          slug: 'example-com-abc123',
          url: 'https://www.example.com/path',
          securityScore: 85,
          createdAt: new Date('2024-01-01'),
          aiAnalyses: [{ id: 'ai-1' }]
        },
        {
          id: 'test-2',
          slug: 'google-com-def456',
          url: 'https://google.com',
          securityScore: 92,
          createdAt: new Date('2024-01-02'),
          aiAnalyses: []
        }
      ];

      mockPrisma.check.findMany.mockResolvedValue(mockReports);

      const result = await repository.getRecentPublicReports(10);

      expect(mockPrisma.check.findMany).toHaveBeenCalledWith({
        where: {
          isPublic: true,
          slug: { not: null }
        },
        select: {
          id: true,
          slug: true,
          url: true,
          securityScore: true,
          createdAt: true,
          aiAnalyses: {
            select: { id: true },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'test-1',
        slug: 'example-com-abc123',
        url: 'https://www.example.com/path',
        domain: 'example.com',
        securityScore: 85,
        createdAt: new Date('2024-01-01'),
        hasAIAnalysis: true
      });
      expect(result[1]).toEqual({
        id: 'test-2',
        slug: 'google-com-def456',
        url: 'https://google.com',
        domain: 'google.com',
        securityScore: 92,
        createdAt: new Date('2024-01-02'),
        hasAIAnalysis: false
      });
    });
  });

  describe('trackShareEvent', () => {
    it('should create share event and increment share count on success', async () => {
      const shareData: ShareEventData = {
        checkId: 'test-id',
        shareMethod: 'twitter',
        success: true,
        userAgent: 'Mozilla/5.0...',
        referrer: 'https://example.com'
      };

      mockPrisma.shareEvent.create.mockResolvedValue({});
      mockPrisma.check.update.mockResolvedValue({});

      await repository.trackShareEvent(shareData);

      expect(mockPrisma.shareEvent.create).toHaveBeenCalledWith({
        data: {
          checkId: 'test-id',
          shareMethod: 'twitter',
          success: true,
          userAgent: 'Mozilla/5.0...',
          referrer: 'https://example.com',
          ipAddress: undefined
        }
      });

      expect(mockPrisma.check.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: {
          shareCount: { increment: 1 }
        }
      });
    });

    it('should not increment share count on failure', async () => {
      const shareData: ShareEventData = {
        checkId: 'test-id',
        shareMethod: 'twitter',
        success: false
      };

      mockPrisma.shareEvent.create.mockResolvedValue({});

      await repository.trackShareEvent(shareData);

      expect(mockPrisma.shareEvent.create).toHaveBeenCalled();
      expect(mockPrisma.check.update).not.toHaveBeenCalled();
    });
  });

  describe('slugExists', () => {
    it('should return true if slug exists', async () => {
      mockPrisma.check.findFirst.mockResolvedValue({ id: 'existing' });

      const result = await repository.slugExists('existing-slug');

      expect(result).toBe(true);
      expect(mockPrisma.check.findFirst).toHaveBeenCalledWith({
        where: { slug: 'existing-slug' }
      });
    });

    it('should return false if slug does not exist', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);

      const result = await repository.slugExists('non-existent-slug');

      expect(result).toBe(false);
    });

    it('should exclude specific check ID when checking uniqueness', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);

      await repository.slugExists('existing-slug', 'exclude-id');

      expect(mockPrisma.check.findFirst).toHaveBeenCalledWith({
        where: { 
          slug: 'existing-slug',
          id: { not: 'exclude-id' }
        }
      });
    });
  });

  describe('getShareAnalytics', () => {
    it('should return share analytics data', async () => {
      const mockGroupBy = [
        { shareMethod: 'twitter', success: true, _count: { id: 5 } },
        { shareMethod: 'twitter', success: false, _count: { id: 1 } },
        { shareMethod: 'copy', success: true, _count: { id: 3 } }
      ];

      mockPrisma.shareEvent.groupBy.mockResolvedValue(mockGroupBy);
      mockPrisma.shareEvent.count.mockResolvedValue(8);

      const result = await repository.getShareAnalytics('test-id');

      expect(result).toEqual({
        totalShares: 8,
        sharesByMethod: {
          twitter: { total: 6, successful: 5 },
          copy: { total: 3, successful: 3 }
        }
      });
    });
  });
});