/**
 * EditProjectModal Component
 * 
 * A modal dialog component for editing existing project details and configuration.
 * Provides a comprehensive form interface for updating project information including
 * name, description, domain, monitoring settings, and scan frequency. Includes
 * validation, error handling, and optimistic updates for a smooth user experience.
 * 
 * Features:
 * - Comprehensive project editing form with validation
 * - Real-time form validation using Zod schema
 * - Pre-populated form fields with current project data
 * - Monitoring toggle with immediate feedback
 * - Scan frequency selection with clear options
 * - Domain URL validation with proper error messages
 * - Loading states during update operations
 * - Toast notifications for success and error feedback
 * - Form reset and cleanup on modal close
 * - Accessible modal dialog with proper focus management
 * - Responsive design with proper spacing
 * - Integration with project update hooks and API
 * 
 * @example
 * ```tsx
 * <EditProjectModal
 *   project={selectedProject}
 *   open={isEditModalOpen}
 *   onOpenChange={setIsEditModalOpen}
 * />
 * ```
 */

'use client';

import { useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUpdateProject } from '@/hooks/dashboard';
import { toast } from 'sonner';
import type { Project } from '@/types/dashboard';

const editProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  domain: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  monitoring_enabled: z.boolean(),
  scan_frequency: z.enum(['hourly', 'daily', 'weekly']),
});

/**
 * Form data type for editing projects
 * 
 * @typedef {Object} EditProjectFormData
 * @property {string} name - The project name (3-100 characters)
 * @property {string} [description] - Optional project description (max 500 characters)
 * @property {string} [domain] - Optional project domain URL
 * @property {boolean} monitoring_enabled - Whether monitoring is enabled for the project
 * @property {'hourly' | 'daily' | 'weekly'} scan_frequency - How frequently to scan the project
 */
type EditProjectFormData = z.infer<typeof editProjectSchema>;

/**
 * Props for the EditProjectModal component
 * 
 * @interface EditProjectModalProps
 * @property {Project} project - The project object to edit, containing current values
 * @property {boolean} open - Whether the modal is currently open/visible
 * @property {(open: boolean) => void} onOpenChange - Callback function to handle modal open state changes
 */
interface EditProjectModalProps {
  /** The project object to edit, containing current values */
  project: Project;
  /** Whether the modal is currently open */
  open: boolean;
  /** Callback to handle modal open state changes */
  onOpenChange: (open: boolean) => void;
}

/**
 * Edit Project Modal Component
 * 
 * A modal dialog for editing existing project details with comprehensive form validation.
 * Pre-fills form fields with current project data and provides real-time validation
 * feedback. Handles project updates with proper error handling and user feedback.
 * 
 * @param {EditProjectModalProps} props - The component props
 * @returns {JSX.Element} The rendered edit project modal dialog
 * 
 * @example
 * ```tsx
 * // Show edit project modal
 * <EditProjectModal
 *   project={selectedProject}
 *   open={showEditModal}
 *   onOpenChange={setShowEditModal}
 * />
 * ```
 * 
 * @features
 * - Pre-populated form with current project data
 * - Real-time validation with Zod schema
 * - Monitoring and scan frequency configuration
 * - Domain URL validation
 * - Toast notifications for feedback
 * - Loading states during updates
 * - Accessible modal implementation
 */
export function EditProjectModal({
  project,
  open,
  onOpenChange,
}: EditProjectModalProps) {
  const updateProject = useUpdateProject();

  const form = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
      domain: project.domain || '',
      monitoring_enabled: project.monitoring_enabled,
      scan_frequency: project.scan_frequency || 'daily',
    },
  });

  // Reset form when project changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: project.name,
        description: project.description || '',
        domain: project.domain || '',
        monitoring_enabled: project.monitoring_enabled,
        scan_frequency: project.scan_frequency || 'daily',
      });
    }
  }, [open, project, form]);

  const onSubmit = async (data: EditProjectFormData) => {
    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        data: {
          ...data,
          domain: data.domain || undefined,
          description: data.description || undefined,
        },
      });

      toast.success('Project updated successfully');
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to update project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project settings and configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Website"
                      {...field}
                      disabled={updateProject.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={updateProject.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description of what this project monitors
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Domain */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain/Website URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                      disabled={updateProject.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    The primary domain or website to monitor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Monitoring Enabled */}
            <FormField
              control={form.control}
              name="monitoring_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Monitoring
                    </FormLabel>
                    <FormDescription>
                      Automatically scan and monitor this project
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateProject.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Scan Frequency */}
            <FormField
              control={form.control}
              name="scan_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scan Frequency</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={updateProject.isPending}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    How often to automatically scan this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateProject.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateProject.isPending}>
                {updateProject.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
