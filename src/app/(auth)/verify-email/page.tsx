'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerifyEmail } from '@/hooks/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verifyEmail = useVerifyEmail();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (token) {
      verifyEmail.mutate(token);
    }
  }, [token]);

  useEffect(() => {
    if (verifyEmail.isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verifyEmail.isSuccess, countdown]);

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6 text-red-600" />
            Invalid Link
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            This verification link is invalid or missing a token.
          </p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (verifyEmail.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Verifying your email...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-center">
            Please wait while we verify your email address.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (verifyEmail.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6 text-red-600" />
            Verification Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            This verification link is invalid or has expired. Please request a new verification
            email.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Create New Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-center">
            Your email has been verified. You can now log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login Now</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
