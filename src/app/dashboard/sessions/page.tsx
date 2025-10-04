'use client';

import { useState } from 'react';
import { useSessions, useTerminateAllSessions } from '@/hooks/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { SessionsTable } from '@/components/auth/SessionsTable';
import { Loader2, Shield } from 'lucide-react';

export default function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  const terminateAll = useTerminateAllSessions();
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);

  const handleTerminateAll = () => {
    terminateAll.mutate(undefined, {
      onSuccess: () => {
        setShowTerminateDialog(false);
      },
    });
  };

  const otherSessionsCount = sessions?.filter((s) => !s.is_current).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your active sessions across all devices
          </p>
        </div>
        {otherSessionsCount > 0 && (
          <Button
            variant="destructive"
            onClick={() => setShowTerminateDialog(true)}
            disabled={terminateAll.isPending}
          >
            <Shield className="mr-2 h-4 w-4" />
            Terminate All Other Sessions
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
          <CardDescription>
            These are the devices currently logged into your account. You can revoke access from
            any device except your current session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionsTable sessions={sessions || []} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Terminate All Confirmation Dialog */}
      <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate All Other Sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log out all devices except your current session. You will need to log in
              again on those devices. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminateAll} disabled={terminateAll.isPending}>
              {terminateAll.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Terminating...
                </>
              ) : (
                'Yes, Terminate All'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
