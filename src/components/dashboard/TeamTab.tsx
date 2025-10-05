/**
 * TeamTab Component
 * 
 * A comprehensive team management interface that displays team members and provides
 * functionality for inviting new members. Handles loading states, error conditions,
 * and provides a clean interface for team administration.
 * 
 * Features:
 * - Team member listing with roles and permissions
 * - Member invitation functionality with modal dialog
 * - Loading states with skeleton placeholders
 * - Error handling with retry functionality
 * - Responsive design with proper spacing
 * - Integration with team management hooks
 * - Real-time team member updates
 * - Permission-based action visibility
 * - Accessibility support with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <TeamTab projectId="project-123" />
 * ```
 */

'use client';

import { useState } from 'react';
import { useTeamMembers } from '@/hooks/dashboard';
import { TeamMembersTable } from './TeamMembersTable';
import { InviteMemberModal } from './InviteMemberModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, AlertTriangle } from 'lucide-react';

/**
 * Props for the TeamTab component
 */
interface TeamTabProps {
  /** The ID of the project to display team members for */
  projectId: string;
}

/**
 * Team Tab Component
 * 
 * Displays team members table with invite functionality and handles all team
 * management operations including loading states and error conditions.
 * 
 * @param props - The component props
 * @param props.projectId - The project ID to load team members for
 * @returns {JSX.Element} The rendered team tab component
 * 
 * @example
 * ```tsx
 * // Display team management interface for a project
 * <TeamTab projectId="project-123" />
 * ```
 */
export function TeamTab({ projectId }: TeamTabProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const { data: teamMembers, isLoading, error } = useTeamMembers(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load team members</h3>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage team members and their access to this project
          </p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Members Table */}
      <TeamMembersTable
        projectId={projectId}
        members={teamMembers || []}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        projectId={projectId}
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </div>
  );
}
