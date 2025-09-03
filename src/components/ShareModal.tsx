
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { nativeSharingService } from '@/lib/services/native-sharing-service';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  hashtags?: string[];
  slug: string;
}

export function ShareModal({ isOpen, onClose, url, title, hashtags = [], slug }: ShareModalProps) {
  const { toast } = useToast();

  const shareOnTwitter = () => {
    const hashtagString = hashtags.join(',');
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtagString)}`, '_blank');
    nativeSharingService.trackShareAttempt(slug, 'twitter', true);
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
    nativeSharingService.trackShareAttempt(slug, 'linkedin', true);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    nativeSharingService.trackShareAttempt(slug, 'facebook', true);
  };

  const handleCopyToClipboard = async () => {
    const success = await nativeSharingService.copyToClipboard(url, slug);
    if (success) {
      toast({ title: 'Link copied to clipboard!' });
    } else {
      toast({ title: 'Failed to copy link.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG value={url} size={128} />
          <p className="text-sm text-gray-500">Scan QR code to share</p>
          <div className="flex space-x-2">
            <Button onClick={shareOnTwitter}>Twitter</Button>
            <Button onClick={shareOnLinkedIn}>LinkedIn</Button>
            <Button onClick={shareOnFacebook}>Facebook</Button>
          </div>
          <Button variant="outline" onClick={handleCopyToClipboard}>Copy Link</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
