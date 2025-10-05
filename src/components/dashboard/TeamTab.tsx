'use client';

import { useState } from 'react';
import { useTeamMembers } from '@/hooks/dashboard';
import { TeamMembersTable } from './TeamMembersTable';
import { InviteMemberModal } from './InviteMemberModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, AlertTriangle } from 'lucide-react';

interface TeamTabProps {
  projectId: string;
}

/**
 * Team Tab Component
 * 
 * Displays team members table with invite functionality.
 * Shows member roles, permissions, and allows inviting new members.
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
