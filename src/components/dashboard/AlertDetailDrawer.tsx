'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAlert, useResolveAlert } from '@/hooks/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  Shield,
  Activity,
  FileCheck,
  Info,
  CheckCircle2,
  Clock,
  User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import type { Alert, AlertType } from '@/types/dashboard';

const resolveAlertSchema = z.object({
  resolution_notes: z
    .string()
    .min(10, 'Please provide at least 10 characters explaining the resolution')
    .max(500, 'Resolution notes must be less than 500 characters'),
});

type ResolveAlertFormData = z.infer<typeof resolveAlertSchema>;

interface AlertDetailDrawerProps {
  projectId: string;
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Alert Detail Drawer Component
 * 
 * Displays full alert details in a slide-in drawer with resolution functionality.
 * Shows alert timeline, type, severity, and allows adding resolution notes.
 */
export function AlertDetailDrawer({
  projectId,
  alert: initialAlert,
  open,
  onOpenChange,
}: AlertDetailDrawerProps) {
  const [showResolveForm, setShowResolveForm] = useState(false);

  // Fetch full alert details if needed
  const { data: fullAlert } = useAlert(
    projectId,
    initialAlert?.id || '',
    {
      enabled: !!initialAlert?.id && open,
    }
  );

  const alert = fullAlert || initialAlert;
  const resolveAlert = useResolveAlert();

  const form = useForm<ResolveAlertFormData>({
    resolver: zodResolver(resolveAlertSchema),
    defaultValues: {
      resolution_notes: '',
    },
  });

  const onSubmit = async (data: ResolveAlertFormData) => {
    if (!alert) return;

    try {
      await resolveAlert.mutateAsync({
        projectId,
        alertId: alert.id,
        data: {
          resolution_notes: data.resolution_notes,
        },
      });

      toast.success('Alert resolved successfully');
      form.reset();
      setShowResolveForm(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'performance':
        return <Activity className="h-5 w-5" />;
      case 'availability':
        return <Clock className="h-5 w-5" />;
      case 'compliance':
        return <FileCheck className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  if (!alert) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-3">
            <div className="mt-1">{getTypeIcon(alert.type)}</div>
            <div className="flex-1">
              <SheetTitle className="text-xl">{alert.title}</SheetTitle>
              <SheetDescription className="mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      alert.severity === 'critical' || alert.severity === 'high'
                        ? 'destructive'
                        : 'default'
                    }
                    className="capitalize"
                  >
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {alert.type}
                  </Badge>
                  <Badge
                    variant={alert.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {alert.status}
                  </Badge>
                </div>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Alert Created</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(alert.created_at)}
                  </p>
                </div>
              </div>

              {alert.resolved_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alert Resolved</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(alert.resolved_at)}
                    </p>
                    {alert.resolved_by && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        Resolved by {alert.resolved_by}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resolution Notes */}
          {alert.resolution_notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-2">Resolution Notes</h3>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">{alert.resolution_notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Resolve Form */}
          {alert.status === 'active' && (
            <>
              <Separator />
              <div>
                {!showResolveForm ? (
                  <Button
                    onClick={() => setShowResolveForm(true)}
                    className="w-full gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Resolve Alert
                  </Button>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="resolution_notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resolution Notes *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe how this alert was resolved..."
                                className="resize-none"
                                rows={4}
                                {...field}
                                disabled={resolveAlert.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowResolveForm(false);
                            form.reset();
                          }}
                          disabled={resolveAlert.isPending}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={resolveAlert.isPending}
                          className="flex-1"
                        >
                          {resolveAlert.isPending ? 'Resolving...' : 'Resolve Alert'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
