/**
 * Homepage Validation Utilities
 * 
 * Zod schemas and validation utilities for homepage URL checking.
 */

import { z } from 'zod';

/**
 * URL validation schema
 * 
 * Validates URL format and length constraints.
 */
export const urlSchema = z
    .string()
    .min(1, 'URL is required')
    .max(2048, 'URL exceeds maximum length of 2048 characters')
    .url('Invalid URL format. Please enter a valid URL starting with http:// or https://');

/**
 * Scan type schema
 */
export const scanTypeSchema = z.enum(['SECURITY', 'SECURITY_REPUTATION_CONTENT', 'DEEP']);

/**
 * URL check form schema
 */
export const urlCheckFormSchema = z.object({
    url: urlSchema,
    scanType: scanTypeSchema,
});

/**
 * Type inference for URL check form
 */
export type URLCheckFormData = z.infer<typeof urlCheckFormSchema>;

/**
 * Extract domain from URL
 * 
 * @param url - Full URL string
 * @returns Domain name or null if invalid
 * 
 * @example
 * ```ts
 * extractDomain('https://www.example.com/path') // 'example.com'
 * extractDomain('http://subdomain.example.com') // 'subdomain.example.com'
 * ```
 */
export const extractDomain = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return null;
    }
};

/**
 * Normalize URL by ensuring it has a protocol
 * 
 * @param url - URL string (may be missing protocol)
 * @returns Normalized URL with protocol
 * 
 * @example
 * ```ts
 * normalizeURL('example.com') // 'https://example.com'
 * normalizeURL('http://example.com') // 'http://example.com'
 * normalizeURL('https://example.com') // 'https://example.com'
 * ```
 */
export const normalizeURL = (url: string): string => {
    const trimmed = url.trim();

    // If URL already has a protocol, return as-is
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }

    // Add https:// by default
    return `https://${trimmed}`;
};

/**
 * Validate URL format without throwing
 * 
 * @param url - URL string to validate
 * @returns Object with isValid flag and optional error message
 * 
 * @example
 * ```ts
 * const { isValid, error } = validateURL('https://example.com');
 * if (!isValid) {
 *   console.error(error);
 * }
 * ```
 */
export const validateURL = (url: string): { isValid: boolean; error?: string } => {
    const result = urlSchema.safeParse(url);

    if (result.success) {
        return { isValid: true };
    }

    return {
        isValid: false,
        error: result.error.errors[0]?.message || 'Invalid URL',
    };
};

/**
 * Check if URL is likely safe based on basic heuristics
 * 
 * This is a client-side pre-check only. Always rely on server-side validation.
 * 
 * @param url - URL to check
 * @returns Object with warnings array
 * 
 * @example
 * ```ts
 * const { warnings } = checkURLHeuristics('http://example.com');
 * if (warnings.length > 0) {
 *   console.warn('Potential issues:', warnings);
 * }
 * ```
 */
export const checkURLHeuristics = (url: string): { warnings: string[] } => {
    const warnings: string[] = [];

    try {
        const urlObj = new URL(url);

        // Check for HTTP (not HTTPS)
        if (urlObj.protocol === 'http:') {
            warnings.push('URL uses HTTP instead of HTTPS (not encrypted)');
        }

        // Check for suspicious TLDs
        const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq'];
        if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
            warnings.push('URL uses a TLD commonly associated with spam');
        }

        // Check for IP address instead of domain
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipPattern.test(urlObj.hostname)) {
            warnings.push('URL uses an IP address instead of a domain name');
        }

        // Check for excessive subdomains
        const parts = urlObj.hostname.split('.');
        if (parts.length > 4) {
            warnings.push('URL has an unusually high number of subdomains');
        }

        // Check for suspicious keywords in URL
        const suspiciousKeywords = ['login', 'verify', 'account', 'secure', 'update', 'confirm'];
        const urlLower = url.toLowerCase();
        const foundKeywords = suspiciousKeywords.filter(keyword =>
            urlLower.includes(keyword) && !urlObj.hostname.includes(keyword)
        );
        if (foundKeywords.length > 0) {
            warnings.push(`URL contains suspicious keywords in path: ${foundKeywords.join(', ')}`);
        }
    } catch {
        // Invalid URL - will be caught by schema validation
    }

    return { warnings };
};
