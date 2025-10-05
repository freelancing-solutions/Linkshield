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

interface DeleteProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Delete Project Dialog Component
 * 
 * Confirmation dialog for deleting a project.
 * Requires typing the project name to confirm deletion.
 * Navigates to projects list on successful deletion.
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
