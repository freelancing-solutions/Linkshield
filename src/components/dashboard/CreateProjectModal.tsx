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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      <DialogContent className="sm:max-w-[600px]" aria-describedby="create-project-description">
        <DialogHeader>
          <DialogTitle id="create-project-title">Create New Project</DialogTitle>
          <DialogDescription id="create-project-description">
            Add a new project to monitor and protect your digital assets.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
            role="form"
            aria-labelledby="create-project-title"
            aria-describedby="create-project-description"
          >
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="project-name">Project Name *</FormLabel>
                  <FormControl>
                    <Input
                      id="project-name"
                      placeholder="My Website"
                      {...field}
                      disabled={createProject.isPending}
                      aria-describedby={form.formState.errors.name ? "project-name-error" : undefined}
                      aria-invalid={!!form.formState.errors.name}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your project
                  </FormDescription>
                  <FormMessage id="project-name-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="project-description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="project-description"
                      placeholder="Brief description of your project"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={createProject.isPending}
                      aria-describedby={form.formState.errors.description ? "project-description-error" : undefined}
                      aria-invalid={!!form.formState.errors.description}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description of what this project monitors
                  </FormDescription>
                  <FormMessage id="project-description-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Domain */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="project-domain">Domain/Website URL</FormLabel>
                  <FormControl>
                    <Input
                      id="project-domain"
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                      disabled={createProject.isPending}
                      aria-describedby={form.formState.errors.domain ? "project-domain-error" : undefined}
                      aria-invalid={!!form.formState.errors.domain}
                    />
                  </FormControl>
                  <FormDescription>
                    The primary domain or website to monitor
                  </FormDescription>
                  <FormMessage id="project-domain-error" role="alert" />
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
                    <FormLabel 
                      className="text-base"
                      htmlFor="enable-monitoring"
                    >
                      Enable Monitoring
                    </FormLabel>
                    <FormDescription>
                      Start monitoring this project immediately after creation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id="enable-monitoring"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={createProject.isPending}
                      aria-describedby="monitoring-description"
                      aria-label="Enable monitoring for this project"
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
                  <FormLabel htmlFor="scan-frequency">Scan Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger 
                        id="scan-frequency"
                        aria-describedby={form.formState.errors.scan_frequency ? "scan-frequency-error" : undefined}
                        aria-invalid={!!form.formState.errors.scan_frequency}
                      >
                        <SelectValue placeholder="Select scan frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent role="listbox">
                      <SelectItem value="hourly" role="option">Hourly</SelectItem>
                      <SelectItem value="daily" role="option">Daily</SelectItem>
                      <SelectItem value="weekly" role="option">Weekly</SelectItem>
                      <SelectItem value="monthly" role="option">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often to automatically scan this project
                  </FormDescription>
                  <FormMessage id="scan-frequency-error" role="alert" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createProject.isPending}
                aria-label="Cancel project creation"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProject.isPending}
                aria-label={createProject.isPending ? "Creating project..." : "Create project"}
              >
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
