'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MoreVertical,
  Edit,
  Trash2,
  Users,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { useToggleMonitoring, useDeleteProject } from '@/hooks/dashboard';
import type { Project, ProjectsResponse } from '@/types/dashboard';

interface ProjectsTableProps {
  data?: ProjectsResponse;
  isLoading: boolean;
  error: Error | null;
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * Projects Table Component
 * 
 * Displays a table of projects with sortable columns, inline monitoring toggle,
 * and action dropdown for edit/delete operations.
 */
export function ProjectsTable({
  data,
  isLoading,
  error,
  page,
  onPageChange,
}: ProjectsTableProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleMonitoring = useToggleMonitoring();
  const deleteProject = useDeleteProject();

  const handleSort = (column: 'name' | 'created_at') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const handleToggleMonitoring = async (
    e: React.MouseEvent,
    projectId: string,
    currentStatus: boolean
  ) => {
    e.stopPropagation(); // Prevent row click
    await toggleMonitoring.mutateAsync({
      projectId,
      enabled: !currentStatus,
    });
  };

  const handleEdit = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    router.push(`/dashboard/projects/${projectId}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(projectId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load projects</h3>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by creating your first project
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => handleSort('name')}
                >
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Monitoring</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Alerts</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => handleSort('created_at')}
                >
                  Created
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((project) => (
              <TableRow
                key={project.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(project.id)}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{project.name}</div>
                    {project.domain && (
                      <div className="text-sm text-muted-foreground">
                        {project.domain}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Switch
                    checked={project.monitoring_enabled}
                    onCheckedChange={(checked) =>
                      handleToggleMonitoring(
                        {} as React.MouseEvent,
                        project.id,
                        project.monitoring_enabled
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    disabled={toggleMonitoring.isPending}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{project.team_size || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {project.active_alerts > 0 ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {project.active_alerts}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(project.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleEdit(e, project.id)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(e, project.id)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * data.per_page + 1} to{' '}
            {Math.min(page * data.per_page, data.total)} of {data.total} projects
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === data.total_pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
