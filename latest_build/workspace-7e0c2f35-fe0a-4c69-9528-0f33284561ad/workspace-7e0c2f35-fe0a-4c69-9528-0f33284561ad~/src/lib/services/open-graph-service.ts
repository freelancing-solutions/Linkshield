
import { ShareableCheck, MetaTags, StructuredData } from '../types/shareable-reports';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export class OpenGraphService {
  generateMetaTags(report: ShareableCheck): MetaTags {
    const title = report.customTitle || `Security Report for ${report.url}`;
    const description = report.customDescription || `Instant security analysis of ${report.url}. Score: ${report.securityScore}`;
    const ogImage = report.ogImageUrl || `${APP_URL}/api/og/default`;

    return {
      title,
      description,
      canonical: `${APP_URL}/reports/${report.slug}`,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: `${APP_URL}/reports/${report.slug}`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      robots: 'index, follow',
    };
  }

  generateStructuredData(report: ShareableCheck): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Report',
      name: report.customTitle || `Security Report for ${report.url}`,
      description: report.customDescription || `Instant security analysis of ${report.url}`,
      url: `${APP_URL}/reports/${report.slug}`,
      datePublished: new Date(report.createdAt).toISOString(),
      author: {
        '@type': 'Organization',
        name: 'LinkShield',
      },
      about: {
        '@type': 'WebSite',
        url: report.url,
      },
    };
  }

  async generateOGImage(report: ShareableCheck): Promise<string> {
    // TODO: Implement dynamic OG image generation
    // For now, returns a placeholder
    return `${APP_URL}/api/og/${report.slug}`;
  }
}

export const openGraphService = new OpenGraphService();
