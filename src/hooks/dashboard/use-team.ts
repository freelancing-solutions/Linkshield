import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/stores/authStore';
import type { InviteTeamMemberData } from '@/types/dashboard';

/**
 * Hook for fetching team members for a project
 * 
 * @param projectId - Project ID
 * @example
 * ```tsx
 * const { data: teamMembers, isLoading } = useTeamMembers('project-123');
 * ```
 */
export function useTeamMembers(projectId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['projects', projectId, 'team'],
    queryFn: () => dashboardService.getTeamMembers(projectId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated && !!projectId,
  });
}

/**
 * Hook for inviting a team member to a project
 * 
 * @example
 * ```tsx
 * const inviteTeamMember = useInviteTeamMember();
 * 
 * const handleInvite = async (projectId, data) => {
 *   await inviteTeamMember.mutateAsync({ projectId, data });
 * };
 * ```
 */
export function useInviteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: InviteTeamMemberData }) =>
      dashboardService.inviteTeamMember(projectId, data),
    onSuccess: (newMember, { projectId }) => {
      // Invalidate team members list
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'team'] });

      // Invalidate project detail (team_size might change)
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });

      toast.success(`Invitation sent to ${newMember.email}`);
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'DUPLICATE_RESOURCE') {
        toast.error('This user is already a team member.');
      } else if (errorCode === 'PLAN_UPGRADE_REQUIRED') {
        toast.error('Please upgrade your plan to add more team members.');
      } else if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
        toast.error('You do not have permission to invite team members.');
      } else {
        toast.error('Failed to send invitation. Please try again.');
      }
    },
  });
}

/**
 * Hook for removing a team member from a project
 * 
 * @example
 * ```tsx
 * const removeTeamMember = useRemoveTeamMember();
 * 
 * const handleRemove = async (projectId, memberId) => {
 *   if (confirm('Are you sure?')) {
 *     await removeTeamMember.mutateAsync({ projectId, memberId });
 *   }
 * };
 * ```
 */
export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      dashboardService.removeTeamMember(projectId, memberId),
    onSuccess: (_, { projectId }) => {
      // Invalidate team members list
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'team'] });

      // Invalidate project detail (team_size might change)
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });

      toast.success('Team member removed successfully');
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
        toast.error('You do not have permission to remove team members.');
      } else {
        toast.error('Failed to remove team member. Please try again.');
      }
    },
  });
}

/**
 * Hook for updating a team member's role
 * 
 * @example
 * ```tsx
 * const updateTeamMemberRole = useUpdateTeamMemberRole();
 * 
 * const handleRoleChange = async (projectId, memberId, role) => {
 *   await updateTeamMemberRole.mutateAsync({ projectId, memberId, role });
 * };
 * ```
 */
export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      role,
    }: {
      projectId: string;
      memberId: string;
      role: string;
    }) => dashboardService.updateTeamMemberRole(projectId, memberId, role),
    onSuccess: (updatedMember, { projectId }) => {
      // Invalidate team members list
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'team'] });

      toast.success('Team member role updated successfully');
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
        toast.error('You do not have permission to change team member roles.');
      } else {
        toast.error('Failed to update role. Please try again.');
      }
    },
  });
}
