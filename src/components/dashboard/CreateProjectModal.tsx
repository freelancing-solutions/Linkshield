'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
import { useCreateProject } from '@/hooks/dashboard';
import { toast } from 'sonner';

const createProjectSchema = z.object({
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
  monitoring_enabled: z.boolean().default(true),
  scan_frequency: z.enum(['hourly', 'daily', 'weekly']).default('daily'),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Create Project Modal Component
 * 
 * Modal dialog for creating a new project with form validation.
 * Navigates to project detail page on successful creation.
 */
export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const router = useRouter();
  const createProject = useCreateProject();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      domain: '',
      monitoring_enabled: true,
      scan_frequency: 'daily',
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const project = await createProject.mutateAsync({
        ...data,
        domain: data.domain || undefined,
        description: data.description || undefined,
      });

      toast.success('Project created successfully');
      form.reset();
      onOpenChange(false);
      
      // Navigate to project detail page
      router.push(`/dashboard/projects/${project.id}`);
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to monitor and protect your digital assets.
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
                      disabled={createProject.isPending}
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
                      disabled={createProject.isPending}
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
                      disabled={createProject.isPending}
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
                      Start monitoring this project immediately after creation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={createProject.isPending}
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
                      disabled={createProject.isPending}
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
                disabled={createProject.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
