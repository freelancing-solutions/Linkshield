import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  NEXT_PUBLIC_ENABLE_SOCIAL_PROTECTION: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

// Validate environment variables at build time
const envVars = {
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.linkshield.site/api/v1',
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || 'false',
  NEXT_PUBLIC_ENABLE_SOCIAL_PROTECTION:
    process.env.NEXT_PUBLIC_ENABLE_SOCIAL_PROTECTION || 'true',
};

export const env = envSchema.parse(envVars);
