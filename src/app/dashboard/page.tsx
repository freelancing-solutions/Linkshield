'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Navbar } from '@/components/navbar'
import { 
  BarChart3, 
  Shield, 
  Brain, 
  Clock, 
  ExternalLink, 
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Simple toast implementation to replace the missing useToast
const useToast = () => {
  return {
    toast: (options: { title: string; description: string; variant?: 'destructive' }) => {
      console.log('Toast:', options.title, options.description);
      // You can replace this with a proper toast library later
      if (options.variant === 'destructive') {
        alert(`ERROR: ${options.title} - ${options.description}`);
      } else {
        alert(`SUCCESS: ${options.title} - ${options.description}`);
      }
    }
  };
};

interface CheckHistory {
  id: string
  url: string
  securityScore: number
  statusCode: number
  responseTime: number
  sslValid: boolean
  createdAt: string
  hasAIAnalysis: boolean
}

interface DashboardShareableReport extends CheckHistory {
  slug: string | null;
  isPublic: boolean;
  shareCount: number;
  customTitle: string | null;
  customDescription: string | null;
  ogImageUrl: string | null;
}

// Update your UserStats interface to match the new API response
interface UserStats {
  user: {
    plan: string
  }
  totalChecks: number
  totalAIAnalyses: number
  avgSecurityScore: number
  checksThisMonth: number
  aiAnalysesThisMonth: number
  planLimits: {
    checksPerMonth: number
    aiAnalysesPerMonth: number
  }
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [history, setHistory] = useState<CheckHistory[]>([])
  const [shareableReports, setShareableReports] = useState<DashboardShareableReport[]>([]);
  const [loading, setLoading] = useState(true)

  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

// Update the fetchDashboardData function
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // Fetch user stats
    const statsResponse = await fetch('/api/dashboard/stats');
    if (statsResponse.ok) {
      const response = await statsResponse.json();
      if (response.success) {
        setStats(response.data); // Note: using response.data now
      }
    } else {
      console.error('Failed to fetch stats');
    }

    // ... rest of your fetch logic remains the same
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    toast({
      title: 'Error',
      description: 'Failed to load dashboard data',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
}


  const handlePrivacyToggle = async (slug: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/reports/${slug}/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic }),
      });

      if (response.ok) {
        setShareableReports((prevReports) =>
          prevReports.map((report) =>
            report.slug === slug ? { ...report, isPublic } : report
          )
        );
        toast({
          title: 'Success',
          description: `Report privacy updated to ${isPublic ? 'public' : 'private'}.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update privacy.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating privacy:', error);
      toast({
        title: 'Error',
        description: 'Network error or server is unreachable.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReport = async (id: string, slug: string | null) => {
    if (!confirm('Are you sure you want to delete this shareable report? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/reports/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShareableReports((prevReports) =>
          prevReports.filter((report) => report.id !== id)
        );
        toast({
          title: 'Success',
          description: 'Shareable report deleted successfully.',
        });
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete report.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: 'Network error or server is unreachable.',
        variant: 'destructive',
      });
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getSecurityBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {session.user?.name}! Here's your activity overview.
          </p>
          <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="capitalize">
            {stats?.user?.plan || 'free'} Plan
          </Badge>


          {(stats?.user?.plan === 'free' || !stats?.user?.plan) && (
    <Link href="/pricing">
      <Button size="sm" variant="outline">
        Upgrade Plan
      </Button>
    </Link>
  )}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChecks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.checksThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAIAnalyses}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.aiAnalysesThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Security Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgSecurityScore}/100</div>
                <p className="text-xs text-muted-foreground">
                  Across all analyses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(
                    getUsagePercentage(stats.checksThisMonth, stats.planLimits.checksPerMonth),
                    getUsagePercentage(stats.aiAnalysesThisMonth, stats.planLimits.aiAnalysesPerMonth)
                  ).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Of monthly limit
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Tracking - Show even if stats are null with placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                URL Checks Usage
              </CardTitle>
              <CardDescription>
                {stats ? `${stats.checksThisMonth} of ${stats.planLimits.checksPerMonth} used this month` : 'Loading usage data...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span className={getUsageColor(getUsagePercentage(stats.checksThisMonth, stats.planLimits.checksPerMonth))}>
                      {stats.checksThisMonth} / {stats.planLimits.checksPerMonth}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(stats.checksThisMonth, stats.planLimits.checksPerMonth)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500">
                    {stats.planLimits.checksPerMonth - stats.checksThisMonth} remaining
                  </p>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Analyses Usage
              </CardTitle>
              <CardDescription>
                {stats ? `${stats.aiAnalysesThisMonth} of ${stats.planLimits.aiAnalysesPerMonth} used this month` : 'Loading usage data...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span className={getUsageColor(getUsagePercentage(stats.aiAnalysesThisMonth, stats.planLimits.aiAnalysesPerMonth))}>
                      {stats.aiAnalysesThisMonth} / {stats.planLimits.aiAnalysesPerMonth}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(stats.aiAnalysesThisMonth, stats.planLimits.aiAnalysesPerMonth)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500">
                    {stats.planLimits.aiAnalysesPerMonth - stats.aiAnalysesThisMonth} remaining
                  </p>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Recent Analysis</TabsTrigger>
            <TabsTrigger value="shareable-reports">Shareable Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Analysis History</CardTitle>
                <CardDescription>
                  Your most recent URL security analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Security Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>AI</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((check) => (
                        <TableRow key={check.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {check.url}
                          </TableCell>
                          <TableCell>
                            <Badge className={getSecurityBadgeColor(check.securityScore)}>
                              {check.securityScore}/100
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {check.sslValid ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">{check.statusCode}</span>
                            </div>
                          </TableCell>
                          <TableCell>{check.responseTime}ms</TableCell>
                          <TableCell>
                            {check.hasAIAnalysis ? (
                              <Badge variant="outline">
                                <Brain className="h-3 w-3 mr-1" />
                                Yes
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(check.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link href={`/report/${check.id}`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                              <Button size="sm" variant="ghost" asChild>
                                <a href={check.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No analysis history yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start analyzing URLs to see your history here.
                    </p>
                    <Link href="/">
                      <Button>Analyze Your First URL</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs remain the same... */}
          <TabsContent value="analytics">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Security Score Trends
      </CardTitle>
      <CardDescription>
        Your average security scores over time
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
          <p>Analytics charts coming soon</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Usage Patterns
      </CardTitle>
      <CardDescription>
        When you use LinkShield most frequently
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-2" />
          <p>Usage patterns coming soon</p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
</TabsContent>


{/* Shareable Reports Tab */}
<TabsContent value="shareable-reports">
<Card>
  <CardHeader>
    <CardTitle>Your Shareable Reports</CardTitle>
    <CardDescription>
      Manage your public and private shareable reports.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {shareableReports.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL / Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Shares</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareableReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium max-w-xs truncate">
                {report.customTitle || report.url}
              </TableCell>
              <TableCell>{report.slug}</TableCell>
              <TableCell>
                <Badge className={getSecurityBadgeColor(report.securityScore)}>
                  {report.securityScore}/100
                </Badge>
              </TableCell>
              <TableCell>{report.shareCount}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`public-toggle-${report.id}`}
                    checked={report.isPublic}
                    onCheckedChange={(checked) => handlePrivacyToggle(report.slug!, checked)}
                  />
                  <Label htmlFor={`public-toggle-${report.id}`}>
                    {report.isPublic ? 'Yes' : 'No'}
                  </Label>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/reports/${report.slug}`} passHref>
                    <Button size="sm" variant="outline" asChild>
                      <a>View</a>
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteReport(report.id, report.slug)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No shareable reports yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Create a shareable report from your analysis results.
        </p>
        <Link href="/">
          <Button>Analyze a URL</Button>
        </Link>
      </div>
    )}
  </CardContent>
</Card>
</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}



