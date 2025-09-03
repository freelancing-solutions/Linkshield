
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { openGraphService } from '@/lib/services/open-graph-service';
import { ShareableCheck } from '@/lib/types/shareable-reports';
import { getScoreColorClass } from '@/lib/utils';
import { ShareButton } from '@/components/ShareButton';

// Mock data fetching
async function getReport(slug: string): Promise<ShareableCheck | null> {
  if (slug === 'example-slug') {
    return {
      id: 'clx9q4z0x0000a8zof3f7c3f7',
      userId: null,
      url: 'https://example.com',
      statusCode: 200,
      responseTimeMs: 500,
      sslValid: true,
      redirectChain: [],
      metaData: { title: 'Example Domain', description: 'Example Domain' },
      securityScore: 85,
      aiAnalysisId: 'clx9q4z1a0001a8zoh7g2g0v2',
      aiAnalysis: {
        summary: 'This is an AI-generated summary of the page content.',
        keywords: ['example', 'test', 'mock'],
      },
      createdAt: new Date(),
      slug: 'example-slug',
      shareCount: 0,
      ogImageUrl: null,
      customTitle: 'Custom Title for Example',
      customDescription: 'Custom description for example.',
      isPublic: true,
      updatedAt: new Date(),
    } as unknown as ShareableCheck;
  }
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const report = await getReport(params.slug);
  if (!report) {
    return {
      title: 'Report Not Found',
    };
  }

  const meta = openGraphService.generateMetaTags(report);

  return {
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.ogUrl,
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.ogTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: [meta.twitterImage],
    },
    robots: meta.robots,
  };
}

export default async function ReportPage({ params }: { params: { slug: string } }) {
  const report = await getReport(params.slug);

  if (!report) {
    notFound();
  }

  const scoreColorClass = getScoreColorClass(report.securityScore);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-md rounded-lg p-6 print:shadow-none">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{report.customTitle || `Security Report for ${report.url}`}</h1>
        <p className="text-gray-600 mb-4">{report.customDescription}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Security Score</h2>
            <p className={`text-6xl font-bold ${scoreColorClass}`}>{report.securityScore}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Analysis Details</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Status Code: {report.statusCode}</li>
              <li>Response Time: {report.responseTimeMs}ms</li>
              <li>SSL Valid: {report.sslValid ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>

        {report.aiAnalysis && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">AI Insights</h2>
            <p className="mt-2">{report.aiAnalysis.summary}</p>
            <div className="mt-2">
              <strong>Keywords:</strong> {report.aiAnalysis.keywords.join(', ')}
            </div>
          </div>
        )}

        <div className="mt-6 print:hidden">
          <ShareButton report={report} />
          <a href="/" className="ml-4 text-blue-500">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
