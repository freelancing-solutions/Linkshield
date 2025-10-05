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

type EditProjectFormData = z.infer<typeof editProjectSchema>;

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Edit Project Modal Component
 * 
 * Modal dialog for editing an existing project with form validation.
 * Pre-fills form with current project data and uses optimistic updates.
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
