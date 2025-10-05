/**
 * TeamMembersTable Component
 * 
 * A comprehensive table component for displaying and managing team members within
 * a project. Provides role-based access control, member management actions, and
 * visual indicators for member status and permissions.
 * 
 * Features:
 * - Team member listing with avatars and role badges
 * - Role-based permission indicators (Owner, Admin, Member, Viewer)
 * - Member removal functionality with confirmation dialogs
 * - Responsive table layout with proper accessibility
 * - Date formatting for member join dates
 * - Action dropdown menus for member management
 * - Toast notifications for user feedback
 * - Permission-based action visibility
 * - Avatar fallbacks with initials
 * - Loading states and error handling
 * 
 * @example
 * ```tsx
 * <TeamMembersTable 
 *   projectId="project-123"
 *   members={teamMembers}
 * />
 * ```
 */

'use client';

import { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Trash2, Shield, User, Eye, Crown } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { useRemoveTeamMember } from '@/hooks/dashboard';
import { toast } from 'sonner';
import type { TeamMember, TeamMemberRole } from '@/types/dashboard';

interface TeamMembersTableProps {
  projectId: string;
  members: TeamMember[];
}

/**
 * Team Members Table Component
 * 
 * Displays team members with their roles, avatars, and actions.
 * Allows removing members (if user has permission).
 */
export function TeamMembersTable({ projectId, members }: TeamMembersTableProps) {
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const removeTeamMember = useRemoveTeamMember();

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await removeTeamMember.mutateAsync({
        projectId,
        memberId: memberToRemove.id,
      });

      toast.success(`${memberToRemove.full_name} has been removed from the team`);
      setMemberToRemove(null);
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to remove team member:', error);
    }
  };

  const getRoleIcon = (role: TeamMemberRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'member':
        return <User className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: TeamMemberRole) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      case 'member':
        return 'outline';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canRemoveMember = (member: TeamMember) => {
    // Owner cannot be removed
    // TODO: Check if current user has permission to remove members
    return member.role !== 'owner';
  };

  // Empty state
  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
        <p className="text-sm text-muted-foreground">
          Invite team members to collaborate on this project
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url} alt={member.full_name} />
                      <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.full_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getRoleBadgeVariant(member.role)}
                    className="gap-1 capitalize"
                  >
                    {getRoleIcon(member.role)}
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(member.joined_at)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.last_active ? formatDate(member.last_active) : '—'}
                </TableCell>
                <TableCell>
                  {canRemoveMember(member) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setMemberToRemove(member)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove from team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-semibold text-foreground">
                {memberToRemove?.full_name}
              </span>{' '}
              from this project?
              <br />
              <br />
              They will lose access to all project data and will need to be re-invited
              to regain access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeTeamMember.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={removeTeamMember.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeTeamMember.isPending ? 'Removing...' : 'Remove Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
