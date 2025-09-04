'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
// Navbar removed to avoid duplicate; AppNavbar in root layout is used instead
import { 
  Shield, 
  Zap, 
  Globe, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface AnalysisResult {
  id: string
  url: string
  statusCode: number
  responseTime: number
  sslValid: boolean
  securityScore: number
  meta?: {
    title?: string
    description?: string
  }
  redirectChain?: string
  aiInsights?: {
    qualityScore?: number
    summary?: string
    topics?: string[]
    similarPages?: Array<{
      url: string
      title: string
      similarityScore: number
    }>
  }
}

export default function Home() {
  const { data: session, status } = useSession()
  const [url, setUrl] = useState('')
  const [includeAI, setIncludeAI] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, includeAI }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze URL')
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSecurityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'bg-green-500', icon: CheckCircle }
    if (score >= 60) return { level: 'Good', color: 'bg-yellow-500', icon: AlertTriangle }
    return { level: 'Poor', color: 'bg-red-500', icon: XCircle }
  }

  const getQualityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600' }
    if (score >= 60) return { level: 'Good', color: 'text-yellow-600' }
    return { level: 'Needs Improvement', color: 'text-red-600' }
  }

  const securityLevel = result ? getSecurityLevel(result.securityScore) : null
  const qualityLevel = result?.aiInsights?.qualityScore ? getQualityLevel(result.aiInsights.qualityScore) : null

  const canUseAI = session?.user?.plan !== 'free' || includeAI

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            LinkShield
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            One-Click Link Safety Reports. Protect your visitors and your reputation.
          </p>
          <div className="flex justify-center gap-4 mb-12">
            <Badge variant="secondary" className="text-sm">
              <Zap className="w-4 h-4 mr-1" />
              Instant Analysis
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Globe className="w-4 h-4 mr-1" />
              Global Coverage
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Security First
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Brain className="w-4 h-4 mr-1" />
              AI-Powered
            </Badge>
          </div>

          {!session && (
            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Ready to get started?
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Create a free account to start analyzing URLs with AI-powered insights.
              </p>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* URL Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Analyze Any URL</CardTitle>
              <CardDescription className="text-center">
                Enter a URL to get instant security and health analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={loading}
                    className="px-6"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="ml-2">{loading ? 'Analyzing...' : 'Analyze'}</span>
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ai-analysis"
                      checked={includeAI}
                      onCheckedChange={setIncludeAI}
                      disabled={!session && includeAI}
                    />
                    <Label htmlFor="ai-analysis" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Include AI Content Analysis
                    </Label>
                  </div>
                  
                  {session?.user?.plan === 'free' && (
                    <Badge variant="outline" className="text-xs">
                      2 free AI analyses/month
                    </Badge>
                  )}
                </div>

                {!session && includeAI && (
                  <Alert>
                    <AlertDescription>
                      Sign in to use AI-powered content analysis features.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {error && (
                <Alert className="mt-4" variant={error.includes('limit reached') ? 'default' : 'destructive'}>
                  <AlertDescription>
                    {error}
                    {error.includes('limit reached') && (
                      <div className="mt-2">
                        <Link href="/dashboard">
                          <Button size="sm" variant="outline">
                            View Usage
                          </Button>
                        </Link>
                        {session?.user?.plan === 'free' && (
                          <Link href="/pricing" className="ml-2">
                            <Button size="sm">
                              Upgrade Plan
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Analysis Results</CardTitle>
                    <CardDescription className="text-lg">
                      {result.url}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {securityLevel && (
                      <div className="flex items-center gap-2">
                        <securityLevel.icon className={`h-6 w-6 ${securityLevel.color === 'bg-green-500' ? 'text-green-600' : securityLevel.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-red-600'}`} />
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${securityLevel.color}`}>
                          {securityLevel.level}
                        </span>
                      </div>
                    )}
                    {result.aiInsights && (
                      <Badge variant="outline" className="text-sm">
                        <Brain className="w-4 h-4 mr-1" />
                        AI Enhanced
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="security" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="security">Security Analysis</TabsTrigger>
                    {result.aiInsights && (
                      <TabsTrigger value="ai">AI Insights</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="security" className="space-y-6">
                    {/* Security Score */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Security Score</span>
                        <span className="text-2xl font-bold">{result.securityScore}/100</span>
                      </div>
                      <Progress value={result.securityScore} className="h-3" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {result.statusCode}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          HTTP Status
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {result.responseTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Response Time
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className={`text-3xl font-bold mb-1 ${result.sslValid ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sslValid ? 'Valid' : 'Invalid'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          SSL Certificate
                        </div>
                      </div>
                    </div>

                    {/* Meta Information */}
                    {result.meta && (result.meta.title || result.meta.description) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Page Information</h3>
                        {result.meta.title && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Title:</span>
                            <p className="font-medium">{result.meta.title}</p>
                          </div>
                        )}
                        {result.meta.description && (
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                            <p className="text-gray-700 dark:text-gray-300">{result.meta.description}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Redirect Chain */}
                    {result.redirectChain && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Redirect Chain</h3>
                      <div className="space-y-2">
                        {JSON.parse(result.redirectChain).map((redirect: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="font-mono text-gray-600 dark:text-gray-400">
                              {redirect.statusCode}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              {redirect.url}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </TabsContent>

                  {result.aiInsights && (
                    <TabsContent value="ai" className="space-y-6">
                      {/* Content Quality Score */}
                      {result.aiInsights.qualityScore && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium">Content Quality Score</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-2xl font-bold">{result.aiInsights.qualityScore}/100</span>
                            {qualityLevel && (
                              <span className={`text-sm font-medium ${qualityLevel.color}`}>
                                {qualityLevel.level}
                              </span>
                            )}
                          </div>
                          <Progress value={result.aiInsights.qualityScore} className="h-3" />
                        </div>
                      )}

                      {/* AI Summary */}
                      {result.aiInsights.summary && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Content Summary</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            {result.aiInsights.summary}
                          </p>
                        </div>
                      )}

                      {/* Topics */}
                      {result.aiInsights.topics && result.aiInsights.topics.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">Main Topics</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.aiInsights.topics.map((topic, index) => (
                              <Badge key={index} variant="outline">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reading Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Estimated reading time: {Math.ceil((result.aiInsights.summary?.split(' ').length || 0) / 200 || 1)} min</span>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Section */}
        {!result && (
          <div className="max-w-6xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Why Choose LinkShield?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Security Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Comprehensive security checks including SSL validation, HTTP headers analysis, and malware detection.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get detailed analysis results in seconds with our optimized checking engine and global infrastructure.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced AI-powered content analysis, quality scoring, and topic extraction for deeper insights.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle>Shareable Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate professional, shareable reports to demonstrate link safety to your audience and build trust.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}