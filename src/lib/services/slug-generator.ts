import { PrismaClient } from '@prisma/client';

export interface SlugGenerationOptions {
  maxLength?: number;
  includePathSegments?: number;
  uniqueIdLength?: number;
}

export class SlugGenerator {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Generate a unique slug for a URL and check ID
   */
  async generateSlug(
    url: string, 
    checkId: string, 
    options: SlugGenerationOptions = {}
  ): Promise<string> {
    const {
      maxLength = 100,
      includePathSegments = 2,
      uniqueIdLength = 6
    } = options;

    try {
      // 1. Extract domain and path components
      const urlObj = new URL(url);
      const domain = this.extractDomain(urlObj.hostname);
      const pathSegments = this.extractPathSegments(urlObj.pathname, includePathSegments);
      
      // 2. Create base slug
      const baseSlug = this.createBaseSlug(domain, pathSegments);
      
      // 3. Add unique identifier
      const uniqueId = checkId.slice(-uniqueIdLength);
      const candidateSlug = `${baseSlug}-${uniqueId}`;
      
      // 4. Clean and validate
      const cleanSlug = this.cleanSlug(candidateSlug, maxLength);
      
      // 5. Ensure uniqueness
      const finalSlug = await this.ensureUniqueness(cleanSlug, checkId);
      
      return finalSlug;
    } catch (error) {
      // Fallback to simple slug if URL parsing fails
      console.error('Error generating slug:', error);
      return this.generateFallbackSlug(checkId, uniqueIdLength);
    }
  }

  /**
   * Extract clean domain from hostname
   */
  private extractDomain(hostname: string): string {
    // Remove www. prefix
    let domain = hostname.replace(/^www\./, '');
    
    // Handle subdomains - keep only the main domain for common cases
    const parts = domain.split('.');
    if (parts.length > 2) {
      // Keep subdomain for API endpoints and specific services
      const subdomain = parts[0];
      if (['api', 'cdn', 'static', 'app', 'admin', 'blog', 'shop'].includes(subdomain)) {
        domain = `${subdomain}-${parts.slice(-2).join('.')}`;
      } else {
        // For other subdomains, just use main domain
        domain = parts.slice(-2).join('.');
      }
    }
    
    return domain;
  }

  /**
   * Extract relevant path segments
   */
  private extractPathSegments(pathname: string, maxSegments: number): string[] {
    const segments = pathname
      .split('/')
      .filter(segment => segment.length > 0)
      .filter(segment => !this.isIgnorableSegment(segment))
      .slice(0, maxSegments);
    
    return segments;
  }

  /**
   * Check if a path segment should be ignored
   */
  private isIgnorableSegment(segment: string): boolean {
    // Ignore common patterns that don't add value to the slug
    const ignorablePatterns = [
      /^\d+$/, // Pure numbers
      /^v\d+$/, // Version numbers like v1, v2
      /^page$/, // Generic "page"
      /^index$/, // Index pages
      /^default$/, // Default pages
      /^home$/, // Home pages
    ];
    
    return ignorablePatterns.some(pattern => pattern.test(segment.toLowerCase()));
  }

  /**
   * Create base slug from domain and path segments
   */
  private createBaseSlug(domain: string, pathSegments: string[]): string {
    const domainSlug = domain.replace(/\./g, '-');
    
    if (pathSegments.length === 0) {
      return domainSlug;
    }
    
    const pathSlug = pathSegments.join('-');
    return `${domainSlug}-${pathSlug}`;
  }

  /**
   * Clean and validate slug format
   */
  private cleanSlug(slug: string, maxLength: number): string {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, maxLength); // Limit length
  }

  /**
   * Ensure slug uniqueness by checking database and adding suffix if needed
   */
  private async ensureUniqueness(baseSlug: string, checkId: string): Promise<string> {
    let candidateSlug = baseSlug;
    let suffix = 1;
    
    while (await this.slugExists(candidateSlug, checkId)) {
      candidateSlug = `${baseSlug}-${suffix}`;
      suffix++;
      
      // Prevent infinite loops
      if (suffix > 100) {
        throw new Error('Unable to generate unique slug after 100 attempts');
      }
    }
    
    return candidateSlug;
  }

  /**
   * Check if slug already exists in database
   */
  private async slugExists(slug: string, excludeCheckId?: string): Promise<boolean> {
    const existing = await this.prisma.check.findFirst({
      where: {
        slug,
        ...(excludeCheckId && { id: { not: excludeCheckId } })
      }
    });
    
    return existing !== null;
  }

  /**
   * Generate fallback slug when URL parsing fails
   */
  private generateFallbackSlug(checkId: string, uniqueIdLength: number): string {
    const uniqueId = checkId.slice(-uniqueIdLength);
    return `report-${uniqueId}`;
  }

  /**
   * Regenerate slug for existing check (useful for conflicts or updates)
   */
  async regenerateSlug(checkId: string, url: string): Promise<string> {
    const newSlug = await this.generateSlug(url, checkId);
    
    await this.prisma.check.update({
      where: { id: checkId },
      data: { slug: newSlug }
    });
    
    return newSlug;
  }

  /**
   * Validate slug format
   */
  validateSlugFormat(slug: string): boolean {
    // Check basic format requirements
    if (!slug || slug.length === 0) return false;
    if (slug.length > 100) return false;
    if (!/^[a-z0-9-]+$/.test(slug)) return false;
    if (slug.startsWith('-') || slug.endsWith('-')) return false;
    if (slug.includes('--')) return false;
    
    return true;
  }
}

// Example usage and test cases
export const SLUG_EXAMPLES = {
  'https://www.google.com': 'google-com-abc123',
  'https://github.com/user/repo': 'github-com-user-repo-def456',
  'https://api.example.com/v1/users': 'api-example-com-users-ghi789',
  'https://stackoverflow.com/questions/123456/how-to-code': 'stackoverflow-com-questions-how-to-code-jkl012',
  'https://blog.medium.com/article-title': 'blog-medium-com-article-title-mno345',
  'https://subdomain.example.com/path': 'example-com-path-pqr678'
};