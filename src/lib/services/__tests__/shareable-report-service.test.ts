// src/lib/services/__tests__/shareable-report-service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShareableReportService } from '../shareable-report-service';
import { ShareableReportsRepository } from '../../repositories/shareable-reports-repository';
import { SlugGenerator } from '../slug-generator';
import { getIoInstance } from '../../socket'; // Mock this
import { formatRecentReportForDisplay } from '../../utils'; // Mock this

// Mock Prisma client
const mockPrisma = {
  check: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  // Add other models as needed
};

// Mock dependencies
vi.mock('../../repositories/shareable-reports-repository');
vi.mock('../slug-generator');
vi.mock('../../socket');
vi.mock('../../utils');

describe('ShareableReportService', () => {
  let service: ShareableReportService;
  let mockShareableReportsRepository: vi.Mocked<ShareableReportsRepository>;
  let mockSlugGenerator: vi.Mocked<SlugGenerator>;
  let mockGetIoInstance: vi.MockedFn<typeof getIoInstance>;
  let mockFormatRecentReportForDisplay: vi.MockedFn<typeof formatRecentReportForDisplay>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockShareableReportsRepository = new ShareableReportsRepository(mockPrisma as any) as vi.Mocked<ShareableReportsRepository>;
    mockSlugGenerator = new SlugGenerator(mockPrisma as any) as vi.Mocked<SlugGenerator>;
    mockGetIoInstance = getIoInstance as vi.MockedFn<typeof getIoInstance>;
    mockFormatRecentReportForDisplay = formatRecentReportForDisplay as vi.MockedFn<typeof formatRecentReportForDisplay>;

    // Mock constructor dependencies
    (ShareableReportsRepository as any).mockImplementation(() => mockShareableReportsRepository);
    (SlugGenerator as any).mockImplementation(() => mockSlugGenerator);

    service = new ShareableReportService(mockPrisma as any);
  });

  describe('createShareableReport', () => {
    it('should create a shareable report and emit event if public', async () => {
      const mockCheck = { id: 'check-id', url: 'https://example.com', securityScore: 80, createdAt: new Date() };
      const mockShareableCheck = { ...mockCheck, slug: 'example-slug', isPublic: true, aiAnalyses: [] };
      const mockDisplayReport = { slug: 'example-slug', displayUrl: 'example.com', scoreColor: 'green', timeAgo: 'just now', hasAI: false };

      mockPrisma.check.findUnique.mockResolvedValue(mockCheck);
      mockSlugGenerator.generateSlug.mockResolvedValue('example-slug');
      mockShareableReportsRepository.updateShareableData.mockResolvedValue(mockShareableCheck as any);
      mockGetIoInstance.mockReturnValue({ emit: vi.fn() } as any);
      mockFormatRecentReportForDisplay.mockReturnValue(mockDisplayReport as any);

      const result = await service.createShareableReport({ checkId: 'check-id', isPublic: true });

      expect(mockPrisma.check.findUnique).toHaveBeenCalledWith({ where: { id: 'check-id' } });
      expect(mockSlugGenerator.generateSlug).toHaveBeenCalledWith(mockCheck.url, mockCheck.id);
      expect(mockShareableReportsRepository.updateShareableData).toHaveBeenCalledWith('check-id', {
        slug: 'example-slug',
        isPublic: true,
      });
      expect(mockGetIoInstance().emit).toHaveBeenCalledWith('newRecentReport', mockDisplayReport);
      expect(result).toEqual(mockShareableCheck);
    });

    it('should not emit event if report is private', async () => {
      const mockCheck = { id: 'check-id', url: 'https://example.com', securityScore: 80, createdAt: new Date() };
      const mockShareableCheck = { ...mockCheck, slug: 'example-slug', isPublic: false, aiAnalyses: [] };

      mockPrisma.check.findUnique.mockResolvedValue(mockCheck);
      mockSlugGenerator.generateSlug.mockResolvedValue('example-slug');
      mockShareableReportsRepository.updateShareableData.mockResolvedValue(mockShareableCheck as any);
      mockGetIoInstance.mockReturnValue({ emit: vi.fn() } as any);

      await service.createShareableReport({ checkId: 'check-id', isPublic: false });

      expect(mockGetIoInstance().emit).not.toHaveBeenCalled();
    });

    it('should throw error if check not found', async () => {
      mockPrisma.check.findUnique.mockResolvedValue(null);

      await expect(service.createShareableReport({ checkId: 'non-existent', isPublic: true })).rejects.toThrow('Check with ID non-existent not found');
    });
  });

  describe('updateReportPrivacy', () => {
    it('should update privacy and emit event if becoming public', async () => {
      const mockUpdatedCheck = { id: 'check-id', slug: 'example-slug', url: 'https://example.com', isPublic: true, securityScore: 80, createdAt: new Date(), aiAnalyses: [] };
      const mockDisplayReport = { slug: 'example-slug', displayUrl: 'example.com', scoreColor: 'green', timeAgo: 'just now', hasAI: false };

      mockShareableReportsRepository.updatePrivacy.mockResolvedValue(undefined);
      mockPrisma.check.findUnique.mockResolvedValue(mockUpdatedCheck);
      mockGetIoInstance.mockReturnValue({ emit: vi.fn() } as any);
      mockFormatRecentReportForDisplay.mockReturnValue(mockDisplayReport as any);

      await service.updateReportPrivacy('check-id', true);

      expect(mockShareableReportsRepository.updatePrivacy).toHaveBeenCalledWith('check-id', true);
      expect(mockPrisma.check.findUnique).toHaveBeenCalledWith({ where: { id: 'check-id' }, include: { aiAnalyses: true } });
      expect(mockGetIoInstance().emit).toHaveBeenCalledWith('updatedRecentReport', mockDisplayReport);
    });

    it('should update privacy and not emit event if becoming private', async () => {
      mockShareableReportsRepository.updatePrivacy.mockResolvedValue(undefined);
      mockPrisma.check.findUnique.mockResolvedValue({ id: 'check-id', slug: 'example-slug', url: 'https://example.com', isPublic: false, securityScore: 80, createdAt: new Date(), aiAnalyses: [] });
      mockGetIoInstance.mockReturnValue({ emit: vi.fn() } as any);

      await service.updateReportPrivacy('check-id', false);

      expect(mockShareableReportsRepository.updatePrivacy).toHaveBeenCalledWith('check-id', false);
      expect(mockGetIoInstance().emit).not.toHaveBeenCalled();
    });

    it('should throw error if user is not owner and userId is provided', async () => {
      mockPrisma.check.findFirst.mockResolvedValue({ userId: 'another-user' });

      await expect(service.updateReportPrivacy('check-id', true, 'user-id')).rejects.toThrow('Report not found or access denied');
    });
  });

  // TODO: Add tests for other methods like getReportBySlug, generateShareData, deleteShareableReport, etc.
});
