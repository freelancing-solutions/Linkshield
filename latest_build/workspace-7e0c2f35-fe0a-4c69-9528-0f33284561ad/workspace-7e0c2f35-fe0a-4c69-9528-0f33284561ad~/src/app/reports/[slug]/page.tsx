import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { openGraphService } from '@/lib/services/open-graph-service';
import { ShareableCheck } from '@/lib/types/shareable-reports';
import { getScoreColorClass } from '@/lib/utils';
import { ShareButton } from '@/components/ShareButton';

// Real data fetching from your API
async function getReport(slug: string): Promise<ShareableCheck | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/reports/${slug}`, {
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: [`report-${slug}`]
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch report: ${response.statusText}`);
    }

    const report = await response.json();
    return report;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReport(slug);

  if (!report) {
    return {
      title: 'Report Not Found',
      description: 'The requested security report could not be found.',
    };
  }

  const meta = openGraphService.generateMetaTags(report);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical,
    },
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

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getReport(slug);

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

        {report.aiAnalyses && report.aiAnalyses.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">AI Insights</h2>
            {report.aiAnalyses.map((analysis: any) => (
              <div key={analysis.id} className="mt-4">
                <p className="mt-2">{analysis.analysis?.summary || analysis.summary}</p>
                {analysis.analysis?.keywords && (
                  <div className="mt-2">
                    <strong>Keywords:</strong> {analysis.analysis.keywords.join(', ')}
                  </div>
                )}
              </div>
            ))}
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