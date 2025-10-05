'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject, useDeleteProject } from '@/hooks/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Users,
  Activity,
  Settings,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { TeamTab } from '@/components/dashboard/TeamTab';
import { AlertsTab } from '@/components/dashboard/AlertsTab';
import { ProjectSettingsTab } from '@/components/dashboard/ProjectSettingsTab';
import { EditProjectModal } from '@/components/dashboard/EditProjectModal';
import { DeleteProjectDialog } from '@/components/dashboard/DeleteProjectDialog';

/**
 * Project Detail Page
 * 
 * Displays detailed information about a project with tabs for:
 * - Overview: Project stats and recent activity
 * - Team: Team members and invitations
 * - Alerts: Project-specific alerts
 * - Settings: Project configuration
 */
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load project</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || 'Project not found'}
        </p>
        <Button onClick={() => router.push('/dashboard/projects')} variant="outline">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-2"
            onClick={() => router.push('/dashboard/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge
              variant={
                project.status === 'active'
                  ? 'default'
                  : project.status === 'paused'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {project.status}
            </Badge>
          </div>
          {project.domain && (
            <p className="text-muted-foreground">{project.domain}</p>
          )}
          {project.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            Team Members
          </div>
          <div className="text-2xl font-bold">{project.team_size || 0}</div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </div>
          <div className="text-2xl font-bold">{project.active_alerts || 0}</div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Activity className="h-4 w-4" />
            Total Scans
          </div>
          <div className="text-2xl font-bold">{project.total_scans || 0}</div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Settings className="h-4 w-4" />
            Monitoring
          </div>
          <div className="text-2xl font-bold">
            {project.monitoring_enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {project.active_alerts > 0 && (
              <Badge variant="destructive" className="ml-2">
                {project.active_alerts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Project Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Created</dt>
                <dd className="text-sm font-medium">
                  {formatDate(project.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Updated</dt>
                <dd className="text-sm font-medium">
                  {project.updated_at ? formatDate(project.updated_at) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Scan Frequency</dt>
                <dd className="text-sm font-medium capitalize">
                  {project.scan_frequency || 'Daily'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Last Scan</dt>
                <dd className="text-sm font-medium">
                  {project.last_scan ? formatDate(project.last_scan) : 'Never'}
                </dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <TeamTab projectId={projectId} />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsTab projectId={projectId} />
        </TabsContent>

        <TabsContent value="settings">
          <ProjectSettingsTab project={project} />
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <EditProjectModal
        project={project}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      {/* Delete Dialog */}
      <DeleteProjectDialog
        project={project}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
