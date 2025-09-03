
import { ShareData, ShareMethod } from '../types/shareable-reports';

export class NativeSharingService {
  isNativeSharingSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  async shareNatively(shareData: ShareData, slug: string): Promise<void> {
    if (!this.isNativeSharingSupported()) {
      throw new Error('Native sharing is not supported in this browser.');
    }

    try {
      await navigator.share(shareData);
      this.trackShareAttempt(slug, 'native', true);
    } catch (error) {
      this.trackShareAttempt(slug, 'native', false);
      console.error('Error using native sharing:', error);
      throw error;
    }
  }

  async copyToClipboard(url: string, slug: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      this.trackShareAttempt(slug, 'copy', true);
      return true;
    } catch (error) {
      this.trackShareAttempt(slug, 'copy', false);
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  // TODO: Implement other sharing methods (QR, social)

  async trackShareAttempt(slug: string, method: ShareMethod, success: boolean): Promise<void> {
    try {
      await fetch(`/api/reports/${slug}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareMethod: method, success }),
      });
    } catch (error) {
      console.error('Failed to track share event:', error);
    }
  }
}

export const nativeSharingService = new NativeSharingService();
