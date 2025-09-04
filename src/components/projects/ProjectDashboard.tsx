'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateProjectModal } from './CreateProjectModal'
import { DomainVerification } from './DomainVerification'
import { AddUrlsModal } from './AddUrlsModal'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Globe, 
  Shield, 
  Link, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Play,
  ExternalLink
} from 'lucide-react'

interface Project {
  id: string
  name: string
  domain: string
  isVerified: boolean
  verificationToken: string
  monitoringFrequency: string
  alertEmail?: string
  alertOnPoison: boolean
  alertOnChange: boolean
  createdAt: string
  updatedAt: string
  projectUrls: Array<{
    id: string
    url: string
    isActive: boolean
    addedAt: string
    scanResults: Array<{
      id: string
      isClean: boolean
      threatType?: string
      scanDate: string
    }>
  }>
  _count: {
    projectUrls: number
    scanResults: number
  }
}

export function ProjectDashboard() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddUrlsModal, setShowAddUrlsModal] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (session && session.user.plan !== 'free') {
      fetchProjects()
    }
  }, [session])

  const fetchProjects = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const result = await response.json()
      setProjects(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev])
    setSelectedProject(project)
  }

  const handleUrlsAdded = (result: any) => {
    fetchProjects() // Refresh projects to show new URLs
    setShowAddUrlsModal(null)
  }

  const handleVerificationComplete = (updatedProject: any) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id ? { ...p, ...updatedProject } : p
    ))
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject({ ...selectedProject, ...updatedProject })
    }
  }

  const handleScanProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/scan`, {
        method: 'POST'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start scan')
      }

      toast({
        title: 'Scan Started',
        description: `Scan initiated for ${result.data.urlsToScan} URLs. Estimated duration: ${result.data.estimatedDuration}`
      })

      // Refresh projects after a short delay to show scan progress
      setTimeout(fetchProjects, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  const getProjectHealth = (project: Project) => {
    const totalUrls = project.projectUrls.length
    if (totalUrls === 0) return { status: 'no-urls', color: 'gray', text: 'No URLs' }

    const latestScans = project.projectUrls.map(url => 
      url.scanResults[0]
    ).filter(Boolean)

    const cleanUrls = latestScans.filter(scan => scan.isClean).length
    const totalScans = latestScans.length

    if (totalScans === 0) return { status: 'no-scans', color: 'blue', text: 'Not Scanned' }
    
    const healthPercentage = (cleanUrls / totalScans) * 100
    
    if (healthPercentage === 100) return { status: 'healthy', color: 'green', text: 'Healthy' }
    if (healthPercentage >= 80) return { status: 'warning', color: 'yellow', text: 'Minor Issues' }
    return { status: 'critical', color: 'red', text: 'Issues Found' }
  }

  if (status === 'loading' || !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (session.user.plan === 'free') {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Project management is available for premium users only. 
          <a href="/pricing" className="underline font-medium">Upgrade your plan</a> to access advanced features.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Dashboard</h2>
          <p className="text-gray-600">Manage and monitor your domain security projects</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first project to start monitoring your domain security.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const health = getProjectHealth(project)
            
            return (
              <Card key={project.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {project.domain}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={health.color === 'green' ? 'default' : 'destructive'}
                      className={health.color === 'green' ? 'bg-green-100 text-green-800' : 
                                 health.color === 'red' ? 'bg-red-100 text-red-800' :
                                 health.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                 'bg-blue-100 text-blue-800'}
                    >
                      {health.text}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">{project._count.projectUrls}</div>
                      <div className="text-xs text-gray-600">URLs</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">{project._count.scanResults}</div>
                      <div className="text-xs text-gray-600">Scans</div>
                    </div>
                  </div>

                  {project.isVerified ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Domain Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <Shield className="h-4 w-4" />
                      Verification Required
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                    
                    {project.isVerified && project._count.projectUrls > 0 && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleScanProject(project.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Scan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedProject.name}</h3>
                  <p className="text-gray-600">{selectedProject.domain}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ×
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="urls">URLs</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <DomainVerification 
                    project={selectedProject}
                    onVerificationComplete={handleVerificationComplete}
                  />
                </TabsContent>

                <TabsContent value="urls" className="space-y-4">
                  {selectedProject.isVerified ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Project URLs</h4>
                        <Button 
                          size="sm"
                          onClick={() => setShowAddUrlsModal(selectedProject)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add URLs
                        </Button>
                      </div>
                      
                      {selectedProject.projectUrls.length === 0 ? (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-8">
                            <Link className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-600 text-center">
                              No URLs added yet. Add URLs to start monitoring.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-2">
                          {selectedProject.projectUrls.map((url) => {
                            const latestScan = url.scanResults[0]
                            const scanStatus = latestScan ? 
                              (latestScan.isClean ? 'clean' : 'threat') : 
                              'not-scanned'
                            
                            return (
                              <div key={url.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <div className="font-mono text-sm">{url.url}</div>
                                  <div className="text-xs text-gray-500">
                                    Added {new Date(url.addedAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {scanStatus === 'clean' && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Clean
                                    </Badge>
                                  )}
                                  {scanStatus === 'threat' && (
                                    <Badge variant="destructive">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Threat
                                    </Badge>
                                  )}
                                  {scanStatus === 'not-scanned' && (
                                    <Badge variant="outline">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Not Scanned
                                    </Badge>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(url.url, '_blank')}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Please verify domain ownership before adding URLs.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monitoring Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Monitoring Frequency</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="off">Off</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Alert Email</label>
                        <input 
                          type="email" 
                          placeholder={session.user.email || 'your@email.com'}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Alert on threats detected</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Alert on status changes</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onProjectCreated={handleProjectCreated}
      />

      {showAddUrlsModal && (
        <AddUrlsModal
          open={!!showAddUrlsModal}
          onOpenChange={(open) => setShowAddUrlsModal(open ? showAddUrlsModal : null)}
          project={showAddUrlsModal}
          onUrlsAdded={handleUrlsAdded}
        />
      )}
    </div>
  )
}