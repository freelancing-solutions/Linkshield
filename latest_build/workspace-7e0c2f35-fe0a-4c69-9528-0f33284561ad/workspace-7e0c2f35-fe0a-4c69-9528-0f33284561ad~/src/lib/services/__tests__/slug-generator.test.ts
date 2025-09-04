import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SlugGenerator, SLUG_EXAMPLES } from '../slug-generator';

// Mock Prisma client
const mockPrisma = {
  check: {
    findFirst: vi.fn(),
    update: vi.fn(),
  }
};

describe('SlugGenerator', () => {
  let slugGenerator: SlugGenerator;

  beforeEach(() => {
    vi.clearAllMocks();
    slugGenerator = new SlugGenerator(mockPrisma as any);
  });

  describe('generateSlug', () => {
    it('should generate correct slug for simple domain', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const slug = await slugGenerator.generateSlug('https://www.google.com', 'abc123def456');
      expect(slug).toBe('google-com-def456');
    });

    it('should generate correct slug for domain with path', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const slug = await slugGenerator.generateSlug('https://github.com/user/repo', 'def456ghi789');
      expect(slug).toBe('github-com-user-repo-ghi789');
    });

    it('should handle API subdomains correctly', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const slug = await slugGenerator.generateSlug('https://api.example.com/v1/users', 'ghi789jkl012');
      expect(slug).toBe('api-example-com-users-jkl012');
    });

    it('should ignore version numbers and generic segments', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const slug = await slugGenerator.generateSlug('https://example.com/v1/page/123', 'jkl012mno345');
      expect(slug).toBe('example-com-mno345');
    });

    it('should clean special characters', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const slug = await slugGenerator.generateSlug('https://example.com/path with spaces!@#', 'mno345pqr678');
      expect(slug).toBe('example-com-path-20with-20spaces-pqr678');
    });

    it('should handle uniqueness conflicts', async () => {
      // First call returns existing slug, second call returns null
      mockPrisma.check.findFirst
        .mockResolvedValueOnce({ id: 'existing' })
        .mockResolvedValueOnce(null);
      
      const slug = await slugGenerator.generateSlug('https://example.com', 'abc123def456');
      expect(slug).toBe('example-com-def456-1');
    });

    it('should limit slug length', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const longUrl = 'https://example.com/' + 'very-long-path-segment-'.repeat(10);
      const slug = await slugGenerator.generateSlug(longUrl, 'abc123def456', { maxLength: 50 });
      expect(slug.length).toBeLessThanOrEqual(50);
    });

    it('should generate fallback slug for invalid URLs', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      const slug = await slugGenerator.generateSlug('not-a-valid-url', 'abc123def456');
      expect(slug).toBe('report-def456');
    });
  });

  describe('validateSlugFormat', () => {
    it('should validate correct slug formats', () => {
      expect(slugGenerator.validateSlugFormat('google-com-abc123')).toBe(true);
      expect(slugGenerator.validateSlugFormat('example-com-path-def456')).toBe(true);
      expect(slugGenerator.validateSlugFormat('a')).toBe(true);
    });

    it('should reject invalid slug formats', () => {
      expect(slugGenerator.validateSlugFormat('')).toBe(false);
      expect(slugGenerator.validateSlugFormat('-invalid')).toBe(false);
      expect(slugGenerator.validateSlugFormat('invalid-')).toBe(false);
      expect(slugGenerator.validateSlugFormat('invalid--slug')).toBe(false);
      expect(slugGenerator.validateSlugFormat('Invalid-Caps')).toBe(false);
      expect(slugGenerator.validateSlugFormat('invalid@slug')).toBe(false);
      expect(slugGenerator.validateSlugFormat('a'.repeat(101))).toBe(false);
    });
  });

  describe('regenerateSlug', () => {
    it('should regenerate and update slug in database', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      mockPrisma.check.update.mockResolvedValue({ id: 'test-id', slug: 'new-slug' });
      
      const newSlug = await slugGenerator.regenerateSlug('test-id', 'https://example.com');
      
      expect(mockPrisma.check.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { slug: expect.stringMatching(/^example-com-/) }
      });
      expect(newSlug).toMatch(/^example-com-/);
    });
  });

  describe('example URLs', () => {
    it('should generate expected slugs for example URLs', async () => {
      mockPrisma.check.findFirst.mockResolvedValue(null);
      
      for (const [url, expectedPattern] of Object.entries(SLUG_EXAMPLES)) {
        // Extract the expected prefix (everything before the last hyphen and ID)
        const expectedPrefix = expectedPattern.replace(/-[a-z0-9]{6}$/, '');
        const checkId = expectedPattern.slice(-6) + '000000'; // Pad to make valid check ID
        
        const slug = await slugGenerator.generateSlug(url, checkId);
        expect(slug).toMatch(new RegExp(`^${expectedPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-[a-z0-9]{6}$`));
      }
    });
  });
});