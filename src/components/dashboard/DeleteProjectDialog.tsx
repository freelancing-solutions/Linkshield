/**
 * DeleteProjectDialog Component
 * 
 * A confirmation dialog component for safely deleting projects with user verification.
 * Implements a two-step confirmation process requiring users to type the project name
 * to prevent accidental deletions. Provides clear warnings and handles the deletion
 * process with proper error handling and user feedback.
 * 
 * Features:
 * - Two-step confirmation process with project name verification
 * - Clear warning messages about data loss and irreversibility
 * - Real-time validation of confirmation text input
 * - Integration with project deletion hooks and API
 * - Toast notifications for success and error feedback
 * - Automatic navigation to projects list after deletion
 * - Accessible dialog with proper ARIA labels and focus management
 * - Loading states during deletion process
 * - Error handling with user-friendly messages
 * - Responsive design with proper spacing and typography
 * 
 * @example
 * ```tsx
 * <DeleteProjectDialog
 *   project={selectedProject}
 *   open={isDeleteDialogOpen}
 *   onOpenChange={setIsDeleteDialogOpen}
 * />
 * ```
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteProject } from '@/hooks/dashboard';
import { toast } from 'sonner';
import type { Project } from '@/types/dashboard';
import { AlertTriangle } from 'lucide-react';

/**
 * Props for the DeleteProjectDialog component
 * 
 * @interface DeleteProjectDialogProps
 * @property {Project} project - The project to be deleted, containing name and other details
 * @property {boolean} open - Whether the dialog is currently open/visible
 * @property {(open: boolean) => void} onOpenChange - Callback function to handle dialog open state changes
 */
interface DeleteProjectDialogProps {
  /** The project to be deleted */
  project: Project;
  /** Whether the dialog is currently open */
  open: boolean;
  /** Callback to handle dialog open state changes */
  onOpenChange: (open: boolean) => void;
}

/**
 * Delete Project Dialog Component
 * 
 * A confirmation dialog that requires users to type the project name to confirm deletion.
 * Provides safety measures to prevent accidental project deletions and handles the
 * deletion process with proper error handling and user feedback.
 * 
 * @param {DeleteProjectDialogProps} props - The component props
 * @returns {JSX.Element} The rendered delete project confirmation dialog
 * 
 * @example
 * ```tsx
 * // Show delete confirmation dialog
 * <DeleteProjectDialog
 *   project={selectedProject}
 *   open={showDeleteDialog}
 *   onOpenChange={setShowDeleteDialog}
 * />
 * ```
 * 
 * @features
 * - Project name confirmation requirement
 * - Real-time validation of confirmation input
 * - Toast notifications for feedback
 * - Navigation after successful deletion
 * - Loading states during deletion
 * - Accessible dialog implementation
 */
export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const deleteProject = useDeleteProject();

  const isConfirmValid = confirmText === project.name;

  const handleDelete = async () => {
    if (!isConfirmValid) {
      toast.error('Please type the project name to confirm');
      return;
    }

    try {
      await deleteProject.mutateAsync(project.id);
      
      toast.success('Project deleted successfully');
      onOpenChange(false);
      
      // Navigate to projects list
      router.push('/dashboard/projects');
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to delete project:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset confirmation text when closing
      setConfirmText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">{project.name}</span>?
            </p>
            
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 space-y-2">
              <p className="text-sm font-medium text-destructive">
                This action cannot be undone. This will permanently delete:
              </p>
              <ul className="text-sm text-destructive/90 list-disc list-inside space-y-1">
                <li>All project data and settings</li>
                <li>All monitoring history and scans</li>
                <li>All alerts and notifications</li>
                <li>All team member access</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-delete" className="text-foreground">
                Type <span className="font-mono font-semibold">{project.name}</span> to
                confirm:
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={project.name}
                disabled={deleteProject.isPending}
                className="font-mono"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => handleOpenChange(false)}
            disabled={deleteProject.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmValid || deleteProject.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProject.isPending ? 'Deleting...' : 'Delete Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
