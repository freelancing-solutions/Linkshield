/**
 * InviteMemberModal Component
 * 
 * A modal dialog component for inviting new team members to a project with role-based
 * access control. Provides a form interface for entering email addresses and selecting
 * appropriate roles, with validation and error handling for the invitation process.
 * 
 * Features:
 * - Email validation with real-time feedback
 * - Role-based access control with visual role indicators
 * - Form validation using Zod schema and React Hook Form
 * - Integration with team invitation API hooks
 * - Toast notifications for success and error feedback
 * - Loading states during invitation process
 * - Accessible modal dialog with proper focus management
 * - Role descriptions with icons for better UX
 * - Form reset after successful invitation
 * - Error handling with user-friendly messages
 * - Responsive design with proper spacing
 * - Keyboard navigation support
 * 
 * @example
 * ```tsx
 * <InviteMemberModal
 *   projectId="project-123"
 *   open={isInviteModalOpen}
 *   onOpenChange={setIsInviteModalOpen}
 * />
 * ```
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useInviteTeamMember } from '@/hooks/dashboard';
import { toast } from 'sonner';
import { Mail, Shield, User, Eye, Crown } from 'lucide-react';
import type { TeamMemberRole } from '@/types/dashboard';

const inviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: z.enum(['admin', 'member', 'viewer'] as const, {
    required_error: 'Please select a role',
  }),
});

/**
 * Form data type for inviting team members
 * 
 * @typedef {Object} InviteMemberFormData
 * @property {string} email - The email address of the user to invite
 * @property {'admin' | 'member' | 'viewer'} role - The role to assign to the invited user
 */
type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

/**
 * Props for the InviteMemberModal component
 * 
 * @interface InviteMemberModalProps
 * @property {string} projectId - The unique identifier of the project to invite members to
 * @property {boolean} open - Whether the modal is currently open/visible
 * @property {(open: boolean) => void} onOpenChange - Callback function to handle modal open state changes
 */
interface InviteMemberModalProps {
  /** The unique identifier of the project to invite members to */
  projectId: string;
  /** Whether the modal is currently open */
  open: boolean;
  /** Callback to handle modal open state changes */
  onOpenChange: (open: boolean) => void;
}

/**
 * Invite Member Modal Component
 * 
 * A modal dialog for inviting new team members to a project with role selection.
 * Provides email validation, role assignment, and handles the invitation process
 * with proper error handling and user feedback.
 * 
 * @param {InviteMemberModalProps} props - The component props
 * @returns {JSX.Element} The rendered invite member modal dialog
 * 
 * @example
 * ```tsx
 * // Show invite member modal
 * <InviteMemberModal
 *   projectId="project-123"
 *   open={showInviteModal}
 *   onOpenChange={setShowInviteModal}
 * />
 * ```
 * 
 * @features
 * - Email validation with real-time feedback
 * - Role-based access control selection
 * - Form validation using Zod schema
 * - Toast notifications for feedback
 * - Loading states during invitation
 * - Accessible modal implementation
 */
export function InviteMemberModal({
  projectId,
  open,
  onOpenChange,
}: InviteMemberModalProps) {
  const inviteTeamMember = useInviteTeamMember();

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      await inviteTeamMember.mutateAsync({
        projectId,
        data: {
          email: data.email,
          role: data.role as TeamMemberRole,
        },
      });

      toast.success(
        `Invitation sent to ${data.email}`,
        {
          description: 'They will receive an email with instructions to join the project.',
        }
      );

      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to invite team member:', error);
    }
  };

  const roleDescriptions: Record<string, { icon: React.ReactNode; description: string }> = {
    admin: {
      icon: <Shield className="h-4 w-4" />,
      description: 'Can manage project settings, team members, and all project data',
    },
    member: {
      icon: <User className="h-4 w-4" />,
      description: 'Can view and edit project data, but cannot manage settings or team',
    },
    viewer: {
      icon: <Eye className="h-4 w-4" />,
      description: 'Can only view project data, cannot make any changes',
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on this project. They will receive an
            email with instructions to join.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        className="pl-9"
                        {...field}
                        disabled={inviteTeamMember.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the email address of the person you want to invite
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={inviteTeamMember.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Member</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>Viewer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value && roleDescriptions[field.value] && (
                    <FormDescription className="flex items-start gap-2 mt-2">
                      {roleDescriptions[field.value].icon}
                      <span className="text-xs">
                        {roleDescriptions[field.value].description}
                      </span>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={inviteTeamMember.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteTeamMember.isPending}>
                {inviteTeamMember.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
