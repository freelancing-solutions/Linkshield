import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/stores/authStore';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
} from '@/types/dashboard';

/**
 * Hook for fetching projects list with filters
 * 
 * @param filters - Optional filters for projects
 * @example
 * ```tsx
 * const { data, isLoading } = useProjects({
 *   page: 1,
 *   per_page: 10,
 *   search: 'my project'
 * });
 * ```
 */
export function useProjects(filters?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['projects', 'list', filters],
    queryFn: () => dashboardService.getProjects(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated,
    keepPreviousData: true, // Keep old data while fetching new page
  });
}

/**
 * Hook for fetching single project by ID
 * 
 * @param projectId - Project ID
 * @example
 * ```tsx
 * const { data: project, isLoading } = useProject('project-123');
 * ```
 */
export function useProject(projectId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['projects', 'detail', projectId],
    queryFn: () => dashboardService.getProject(projectId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated && !!projectId,
  });
}

/**
 * Hook for creating a new project
 * 
 * @example
 * ```tsx
 * const createProject = useCreateProject();
 * 
 * const handleSubmit = async (data) => {
 *   await createProject.mutateAsync(data);
 *   router.push('/dashboard/projects');
 * };
 * ```
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => dashboardService.createProject(data),
    onSuccess: (newProject) => {
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      
      // Invalidate dashboard overview
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });

      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'DUPLICATE_RESOURCE') {
        toast.error('A project with this name already exists.');
      } else if (errorCode === 'PLAN_UPGRADE_REQUIRED') {
        toast.error('Please upgrade your plan to create more projects.');
      } else {
        toast.error('Failed to create project. Please try again.');
      }
    },
  });
}

/**
 * Hook for updating an existing project
 * 
 * @example
 * ```tsx
 * const updateProject = useUpdateProject();
 * 
 * const handleUpdate = async (projectId, data) => {
 *   await updateProject.mutateAsync({ projectId, data });
 * };
 * ```
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectData }) =>
      dashboardService.updateProject(projectId, data),
    onMutate: async ({ projectId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects', 'detail', projectId] });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData<Project>([
        'projects',
        'detail',
        projectId,
      ]);

      // Optimistically update
      queryClient.setQueryData<Project>(['projects', 'detail', projectId], (old) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      return { previousProject };
    },
    onSuccess: (updatedProject, { projectId }) => {
      // Update cache with server response
      queryClient.setQueryData(['projects', 'detail', projectId], updatedProject);

      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });

      toast.success('Project updated successfully');
    },
    onError: (error, { projectId }, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', 'detail', projectId], context.previousProject);
      }

      toast.error('Failed to update project. Please try again.');
    },
  });
}

/**
 * Hook for deleting a project
 * 
 * @example
 * ```tsx
 * const deleteProject = useDeleteProject();
 * 
 * const handleDelete = async (projectId) => {
 *   if (confirm('Are you sure?')) {
 *     await deleteProject.mutateAsync(projectId);
 *     router.push('/dashboard/projects');
 *   }
 * };
 * ```
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => dashboardService.deleteProject(projectId),
    onSuccess: (_, projectId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['projects', 'detail', projectId] });

      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });

      // Invalidate dashboard overview
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });

      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
        toast.error('You do not have permission to delete this project.');
      } else {
        toast.error('Failed to delete project. Please try again.');
      }
    },
  });
}

/**
 * Hook for toggling project monitoring
 * 
 * @example
 * ```tsx
 * const toggleMonitoring = useToggleMonitoring();
 * 
 * const handleToggle = async (projectId, enabled) => {
 *   await toggleMonitoring.mutateAsync({ projectId, enabled });
 * };
 * ```
 */
export function useToggleMonitoring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, enabled }: { projectId: string; enabled: boolean }) =>
      dashboardService.toggleMonitoring(projectId, enabled),
    onMutate: async ({ projectId, enabled }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects', 'detail', projectId] });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData<Project>([
        'projects',
        'detail',
        projectId,
      ]);

      // Optimistically update
      queryClient.setQueryData<Project>(['projects', 'detail', projectId], (old) => {
        if (!old) return old;
        return { ...old, monitoring_enabled: enabled };
      });

      return { previousProject };
    },
    onSuccess: (_, { projectId, enabled }) => {
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });

      toast.success(`Monitoring ${enabled ? 'enabled' : 'disabled'} successfully`);
    },
    onError: (error, { projectId }, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', 'detail', projectId], context.previousProject);
      }

      toast.error('Failed to toggle monitoring. Please try again.');
    },
  });
}
