
'use client';

import { useState } from 'react';
import { nativeSharingService } from '@/lib/services/native-sharing-service';
import { ShareableCheck } from '@/lib/types/shareable-reports';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  report: ShareableCheck;
}

export function ShareButton({ report }: ShareButtonProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    const shareData = {
      title: report.customTitle || `Security Report for ${report.url}`,
      text: report.customDescription || `Instant security analysis of ${report.url}. Score: ${report.securityScore}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/reports/${report.slug}`,
    };

    if (nativeSharingService.isNativeSharingSupported()) {
      try {
        await nativeSharingService.shareNatively(shareData as any, report.slug || '');
      } catch (error) {
        // Error is logged in the service
      }
    } else {
      setIsModalOpen(true);
    }

    setIsSharing(false);
  };

  return (
    <>
      <Button onClick={handleShare} disabled={isSharing}>
        {isSharing ? 'Sharing...' : 'Share Report'}
      </Button>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={`${process.env.NEXT_PUBLIC_APP_URL}/reports/${report.slug}`}
        title={report.customTitle || `Security Report for ${report.url}`}
        hashtags={['LinkShield', 'Security', 'URLScanner']}
        slug={report.slug || ''}
      />
    </>
  );
}
