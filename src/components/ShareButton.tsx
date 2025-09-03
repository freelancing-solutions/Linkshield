'use client';

import { useState } from 'react';
import { nativeSharingService } from '@/lib/services/native-sharing-service';
import { ShareableCheck } from '@/lib/types/shareable-reports';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  report?: ShareableCheck | null;
}

export function ShareButton({ report }: ShareButtonProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safe defaults for missing data
  const safeSlug = report?.slug || '';
  const safeUrl = report?.url || '';
  const safeSecurityScore = report?.securityScore || 0;
  const safeCustomTitle = report?.customTitle || `Security Report for ${safeUrl}`;
  const safeCustomDescription = report?.customDescription || `Instant security analysis of ${safeUrl}. Score: ${safeSecurityScore}`;

  const handleShare = async () => {
    if (!report) {
      toast({
        title: 'Error',
        description: 'Report data is not available for sharing',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);

    const shareData = {
      title: safeCustomTitle,
      text: safeCustomDescription,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/reports/${safeSlug}`,
    };

    if (nativeSharingService.isNativeSharingSupported()) {
      try {
        await nativeSharingService.shareNatively(shareData as any, safeSlug);
      } catch (error) {
        // Error is logged in the service
      }
    } else {
      setIsModalOpen(true);
    }

    setIsSharing(false);
  };

  // Don't render if no report or no slug
  if (!report || !report.slug) {
    return null;
  }

  return (
    <>
      <Button onClick={handleShare} disabled={isSharing}>
        {isSharing ? 'Sharing...' : 'Share Report'}
      </Button>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={`${process.env.NEXT_PUBLIC_APP_URL}/reports/${safeSlug}`}
        title={safeCustomTitle}
        hashtags={['LinkShield', 'Security', 'URLScanner']}
        slug={safeSlug}
      />
    </>
  );
}