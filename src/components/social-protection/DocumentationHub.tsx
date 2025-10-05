'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Settings, Code, HelpCircle, Play, ExternalLink, Copy, ZoomIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Documentation section types
type DocumentationSection = 'getting-started' | 'platform-setup' | 'features' | 'api-reference' | 'troubleshooting';

interface DocumentationHubProps {
  className?: string;
}

interface CodeBlockProps {
  code: string;
  language: string;
}

interface ImageZoomProps {
  src: string;
  alt: string;
  caption?: string;
}

// Code block component with copy functionality
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <Badge variant="secondary" className="text-xs">
          {language}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-gray-400 hover:text-white"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="text-sm text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Image with zoom capability
const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, caption }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="my-6">
      <div className="relative group cursor-pointer" onClick={() => setIsZoomed(true)}>
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg border shadow-sm transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      {caption && (
        <p className="text-sm text-gray-600 mt-2 text-center italic">{caption}</p>
      )}
      
      {/* Zoom modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export const DocumentationHub: React.FC<DocumentationHubProps> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState<DocumentationSection>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock documentation content - in real implementation, this would come from a CMS or API
  const documentationContent = {
    'getting-started': {
      title: 'Getting Started',
      icon: BookOpen,
      content: [
        {
          title: 'Overview',
          content: 'Social Protection provides comprehensive monitoring and security for your social media presence. Monitor content, detect threats, and maintain your online reputation across all major platforms.'
        },
        {
          title: 'Quick Start Guide',
          content: '1. Connect your social media accounts\n2. Install the browser extension\n3. Configure monitoring settings\n4. Start scanning your content'
        },
        {
          title: 'Video Tutorial',
          content: 'Watch our comprehensive video guide to get started with Social Protection.',
          hasVideo: true
        }
      ]
    },
    'platform-setup': {
      title: 'Platform Setup',
      icon: Settings,
      content: [
        {
          title: 'Twitter/X Setup',
          content: 'Connect your Twitter account using OAuth 2.0. Required permissions: Read tweets, Read profile information.',
          credentials: ['API Key', 'API Secret', 'Access Token', 'Access Token Secret']
        },
        {
          title: 'Facebook Setup',
          content: 'Connect your Facebook account using Facebook Login. Required permissions: Read posts, Read profile.',
          credentials: ['App ID', 'App Secret', 'User Access Token']
        },
        {
          title: 'Instagram Setup',
          content: 'Connect your Instagram Business account. Required permissions: Read media, Read profile.',
          credentials: ['Instagram Business Account', 'Facebook Page Access Token']
        },
        {
          title: 'LinkedIn Setup',
          content: 'Connect your LinkedIn account using LinkedIn API. Required permissions: Read profile, Read posts.',
          credentials: ['Client ID', 'Client Secret', 'Redirect URI']
        }
      ]
    },
    'features': {
      title: 'Features',
      icon: Play,
      content: [
        {
          title: 'Content Analysis',
          content: 'AI-powered analysis of your social media content to detect potential risks, sentiment issues, and compliance violations.',
          features: ['Sentiment Analysis', 'Risk Assessment', 'Compliance Checking', 'Content Categorization']
        },
        {
          title: 'Algorithm Health',
          content: 'Monitor how platform algorithms are affecting your content reach and engagement.',
          features: ['Reach Monitoring', 'Engagement Tracking', 'Shadow Ban Detection', 'Algorithm Changes']
        },
        {
          title: 'Crisis Detection',
          content: 'Real-time monitoring for potential PR crises and reputation threats.',
          features: ['Threat Detection', 'Alert System', 'Response Recommendations', 'Impact Assessment']
        },
        {
          title: 'Browser Extension',
          content: 'Real-time protection while browsing social media platforms.',
          features: ['Real-time Scanning', 'Threat Blocking', 'Safe Browsing', 'Privacy Protection']
        }
      ]
    },
    'api-reference': {
      title: 'API Reference',
      icon: Code,
      content: [
        {
          title: 'Authentication',
          content: 'All API requests require authentication using Bearer tokens.',
          endpoint: 'POST /api/auth/login',
          example: `{
  "email": "user@example.com",
  "password": "your-password"
}`
        },
        {
          title: 'Scan Content',
          content: 'Analyze social media content for risks and threats.',
          endpoint: 'POST /api/social-protection/scan',
          example: `{
  "url": "https://twitter.com/username/status/123456789",
  "platform": "twitter",
  "analysis_type": "comprehensive"
}`
        },
        {
          title: 'Get Scan Results',
          content: 'Retrieve results from a previous content scan.',
          endpoint: 'GET /api/social-protection/scan/{scanId}',
          response: `{
  "scan_id": "scan_123456",
  "status": "completed",
  "risk_score": 75,
  "threats_detected": 2,
  "recommendations": [...]
}`
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: HelpCircle,
      content: [
        {
          title: 'Common Issues',
          content: 'Solutions to frequently encountered problems.',
          issues: [
            {
              problem: 'Extension not detecting threats',
              solution: 'Ensure the extension is enabled and has necessary permissions. Try refreshing the page.'
            },
            {
              problem: 'Platform connection failed',
              solution: 'Check your API credentials and ensure they have the required permissions.'
            },
            {
              problem: 'Scan results not loading',
              solution: 'Check your internet connection and try refreshing. Contact support if the issue persists.'
            }
          ]
        },
        {
          title: 'FAQ',
          content: 'Frequently asked questions about Social Protection.',
          faqs: [
            {
              question: 'How often should I scan my content?',
              answer: 'We recommend daily scans for active accounts, or weekly for less active accounts.'
            },
            {
              question: 'Is my data secure?',
              answer: 'Yes, all data is encrypted in transit and at rest. We follow industry-standard security practices.'
            },
            {
              question: 'Can I export my scan results?',
              answer: 'Yes, you can export results in PDF, CSV, or JSON formats from the dashboard.'
            }
          ]
        }
      ]
    }
  };

  // Filter content based on search query
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return documentationContent;

    const filtered: typeof documentationContent = {};
    Object.entries(documentationContent).forEach(([key, section]) => {
      const matchingContent = section.content.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingContent.length > 0) {
        filtered[key as DocumentationSection] = {
          ...section,
          content: matchingContent
        };
      }
    });

    return filtered;
  }, [searchQuery]);

  const renderContent = (section: DocumentationSection) => {
    const sectionData = filteredContent[section];
    if (!sectionData) return null;

    return (
      <div className="space-y-8">
        {sectionData.content.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.title}
                {item.hasVideo && <Play className="h-5 w-5 text-blue-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
              
              {/* Platform credentials */}
              {item.credentials && (
                <div>
                  <h4 className="font-semibold mb-2">Required Credentials:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {item.credentials.map((cred, i) => (
                      <li key={i} className="text-sm text-gray-600">{cred}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feature lists */}
              {item.features && (
                <div>
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, i) => (
                      <Badge key={i} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* API examples */}
              {item.endpoint && (
                <div>
                  <h4 className="font-semibold mb-2">Endpoint:</h4>
                  <Badge variant="secondary" className="mb-4">{item.endpoint}</Badge>
                  {item.example && (
                    <CodeBlock code={item.example} language="json" />
                  )}
                  {item.response && (
                    <>
                      <h4 className="font-semibold mb-2 mt-4">Response:</h4>
                      <CodeBlock code={item.response} language="json" />
                    </>
                  )}
                </div>
              )}

              {/* Troubleshooting issues */}
              {item.issues && (
                <div className="space-y-4">
                  {item.issues.map((issue, i) => (
                    <div key={i} className="border-l-4 border-yellow-400 pl-4">
                      <h5 className="font-semibold text-yellow-800">{issue.problem}</h5>
                      <p className="text-sm text-gray-600 mt-1">{issue.solution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ */}
              {item.faqs && (
                <div className="space-y-4">
                  {item.faqs.map((faq, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <h5 className="font-semibold text-blue-800 mb-2">{faq.question}</h5>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Video tutorial placeholder */}
              {item.hasVideo && (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Video tutorial coming soon</p>
                  <Button variant="outline" className="mt-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Social Protection Documentation
        </h1>
        <p className="text-gray-600">
          Comprehensive guide to using Social Protection features for monitoring and securing your social media presence.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Navigation and Content */}
      <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as DocumentationSection)}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          {Object.entries(documentationContent).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.keys(documentationContent).map((section) => (
          <TabsContent key={section} value={section}>
            {renderContent(section as DocumentationSection)}
          </TabsContent>
        ))}
      </Tabs>

      {/* No results message */}
      {searchQuery && Object.keys(filteredContent).length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse the sections above.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};