'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, AlertCircle, XCircle, RefreshCw } from 'lucide-react'

interface ApiStatus {
  service: string
  status: 'operational' | 'degraded' | 'down'
  responseTime: number
  lastChecked: string
  message?: string
}

const mockStatusData: ApiStatus[] = [
  {
    service: 'URL Analysis',
    status: 'operational',
    responseTime: 245,
    lastChecked: new Date().toISOString(),
    message: 'All systems operational'
  },
  {
    service: 'Threat Intelligence',
    status: 'operational',
    responseTime: 189,
    lastChecked: new Date().toISOString(),
    message: 'Real-time threat data active'
  },
  {
    service: 'Report Generation',
    status: 'degraded',
    responseTime: 1200,
    lastChecked: new Date().toISOString(),
    message: 'Slower than usual response times'
  },
  {
    service: 'Dashboard API',
    status: 'operational',
    responseTime: 156,
    lastChecked: new Date().toISOString(),
    message: 'Fast and reliable'
  }
]

export default function ApiStatusDashboard() {
  const [statusData, setStatusData] = useState<ApiStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStatus = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStatusData(mockStatusData)
    setLoading(false)
    setLastRefresh(new Date())
  }

  useEffect(() => {
    fetchStatus()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle2 className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 500) return `${ms}ms`
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">API Status Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button
          onClick={fetchStatus}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          statusData.map((service) => (
            <Card key={service.service}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.service}</CardTitle>
                  {getStatusIcon(service.status)}
                </div>
                <CardDescription>{service.message}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-lg font-semibold">
                      {formatResponseTime(service.responseTime)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overall System Health</CardTitle>
          <CardDescription>
            Current status of all LinkShield services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm">3 Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">1 Degraded</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm">0 Down</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}