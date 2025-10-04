'use client';

import { useState } from 'react';
import { useRevokeSession } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Session } from '@/types/auth.types';

interface SessionsTableProps {
  sessions: Session[];
  isLoading: boolean;
}

export function SessionsTable({ sessions, isLoading }: SessionsTableProps) {
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const revokeSession = useRevokeSession();

  const getDeviceIcon = (deviceInfo: string) => {
    const lower = deviceInfo.toLowerCase();
    if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (lower.includes('tablet') || lower.includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const handleRevoke = () => {
    if (sessionToRevoke) {
      revokeSession.mutate(sessionToRevoke, {
        onSuccess: () => {
          setSessionToRevoke(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-muted-foreground">No active sessions found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(session.device_info.browser)}
                    <div>
                      <p className="text-sm font-medium">{session.device_info.browser}</p>
                      <p className="text-xs text-muted-foreground">{session.device_info.os}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {session.device_info.ip_address}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(session.last_active), 'PPp')}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(session.created_at), 'PPp')}
                </TableCell>
                <TableCell>
                  {session.is_current ? (
                    <Badge variant="default">Current Session</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSessionToRevoke(session.id)}
                    disabled={session.is_current || revokeSession.isPending}
                  >
                    {session.is_current ? 'Current' : 'Revoke'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!sessionToRevoke} onOpenChange={() => setSessionToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log out the device associated with this session. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} disabled={revokeSession.isPending}>
              {revokeSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke Session'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
