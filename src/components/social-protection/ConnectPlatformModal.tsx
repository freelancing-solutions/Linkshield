/**
 * ConnectPlatformModal Component
 * 
 * Modal for connecting social media platforms to the LinkShield social protection system.
 * Supports multiple platforms with platform-specific credential fields.
 * 
 * Features:
 * - Platform selection (Twitter, Facebook, Instagram, TikTok, LinkedIn, Telegram, Discord)
 * - Platform-specific credential forms
 * - Credential validation
 * - Connection progress indicator
 * - Error handling and user feedback
 * 
 * @example
 * ```tsx
 * <ConnectPlatformModal
 *   isOpen={isModalOpen}
 *   onClose={handleCloseModal}
 *   onSuccess={handleConnectionSuccess}
 * />
 * ```
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAnalyzeVisibility } from '@/hooks/dashboard/use-social-protection';
import { toast } from 'react-hot-toast';
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music,
  Discord,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Info,
} from 'lucide-react';

/**
 * Supported social media platforms
 */
type PlatformType = 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'telegram' | 'discord';

/**
 * Platform configuration
 */
interface PlatformConfig {
  id: PlatformType;
  name: string;
  displayName: string;
  icon: typeof Twitter;
  color: string;
  description: string;
  credentialFields: CredentialField[];
  setupGuide: string;
  documentationUrl: string;
}

/**
 * Credential field configuration
 */
interface CredentialField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'url';
  required: boolean;
  placeholder: string;
  description?: string;
  validation?: (value: string) => string | null;
}

/**
 * Component props
 */
interface ConnectPlatformModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal is closed */
  onClose: () => void;
  /** Function to call when a platform is successfully connected */
  onSuccess: (platform: PlatformType) => void;
}

/**
 * Platform configurations
 */
const PLATFORMS: Record<PlatformType, PlatformConfig> = {
  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    displayName: 'Twitter/X',
    icon: Twitter,
    color: 'text-blue-500',
    description: 'Monitor your Twitter/X account for algorithm health and security threats',
    credentialFields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: '@username',
        description: 'Your Twitter/X username (without @)',
        validation: (value) => {
          if (!value) return 'Username is required';
          if (value.length < 3) return 'Username must be at least 3 characters';
          if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
          return null;
        },
      },
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'Your Twitter API Key',
        description: 'Get this from your Twitter Developer Portal',
      },
      {
        name: 'api_secret',
        label: 'API Secret',
        type: 'password',
        required: true,
        placeholder: 'Your Twitter API Secret',
        description: 'Get this from your Twitter Developer Portal',
      },
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'Your Twitter Access Token',
        description: 'Get this from your Twitter Developer Portal',
      },
      {
        name: 'access_token_secret',
        label: 'Access Token Secret',
        type: 'password',
        required: true,
        placeholder: 'Your Twitter Access Token Secret',
        description: 'Get this from your Twitter Developer Portal',
      },
    ],
    setupGuide: 'Create a Twitter Developer account, generate API keys, and provide access tokens',
    documentationUrl: 'https://docs.linkshield.com/social-protection/twitter-setup',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    displayName: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    description: 'Monitor your Facebook pages for algorithm health and security threats',
    credentialFields: [
      {
        name: 'page_id',
        label: 'Page ID',
        type: 'text',
        required: true,
        placeholder: 'Your Facebook Page ID',
        description: 'Find this in your Facebook Page settings',
      },
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'Your Facebook Page Access Token',
        description: 'Generate this from Facebook Developer Portal',
      },
    ],
    setupGuide: 'Create a Facebook App, get Page Access Token, and provide Page ID',
    documentationUrl: 'https://docs.linkshield.com/social-protection/facebook-setup',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    displayName: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    description: 'Monitor your Instagram account for algorithm health and security threats',
    credentialFields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: '@username',
        description: 'Your Instagram username (without @)',
      },
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'Your Instagram Access Token',
        description: 'Generate this from Facebook Developer Portal',
      },
    ],
    setupGuide: 'Create a Facebook App with Instagram Basic Display, generate access token',
    documentationUrl: 'https://docs.linkshield.com/social-protection/instagram-setup',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    displayName: 'TikTok',
    icon: Music,
    color: 'text-black',
    description: 'Monitor your TikTok account for algorithm health and security threats',
    credentialFields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: '@username',
        description: 'Your TikTok username (without @)',
      },
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'Your TikTok Access Token',
        description: 'Generate this from TikTok Developer Portal',
      },
    ],
    setupGuide: 'Apply for TikTok Developer access, generate access token',
    documentationUrl: 'https://docs.linkshield.com/social-protection/tiktok-setup',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    description: 'Monitor your LinkedIn profile for algorithm health and security threats',
    credentialFields: [
      {
        name: 'profile_id',
        label: 'Profile ID',
        type: 'text',
        required: true,
        placeholder: 'Your LinkedIn Profile ID',
        description: 'Find this in your LinkedIn profile URL',
      },
      {
        name: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'Your LinkedIn Access Token',
        description: 'Generate this from LinkedIn Developer Portal',
      },
    ],
    setupGuide: 'Create a LinkedIn App, get access token with appropriate permissions',
    documentationUrl: 'https://docs.linkshield.com/social-protection/linkedin-setup',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    displayName: 'Telegram',
    icon: MessageCircle,
    color: 'text-blue-400',
    description: 'Monitor your Telegram channels for algorithm health and security threats',
    credentialFields: [
      {
        name: 'bot_token',
        label: 'Bot Token',
        type: 'password',
        required: true,
        placeholder: 'Your Telegram Bot Token',
        description: 'Create a bot with @BotFather to get this token',
      },
      {
        name: 'channel_id',
        label: 'Channel ID',
        type: 'text',
        required: true,
        placeholder: '@channelname or channel ID',
        description: 'Your Telegram channel username or ID',
      },
    ],
    setupGuide: 'Create a Telegram bot with @BotFather, get bot token and channel ID',
    documentationUrl: 'https://docs.linkshield.com/social-protection/telegram-setup',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    displayName: 'Discord',
    icon: Discord,
    color: 'text-indigo-500',
    description: 'Monitor your Discord servers for algorithm health and security threats',
    credentialFields: [
      {
        name: 'bot_token',
        label: 'Bot Token',
        type: 'password',
        required: true,
        placeholder: 'Your Discord Bot Token',
        description: 'Create a bot in Discord Developer Portal to get this token',
      },
      {
        name: 'server_id',
        label: 'Server ID',
        type: 'text',
        required: true,
        placeholder: 'Your Discord Server ID',
        description: 'Find this in Discord Developer Portal or Discord settings',
      },
    ],
    setupGuide: 'Create a Discord bot, get bot token and server ID',
    documentationUrl: 'https://docs.linkshield.com/social-protection/discord-setup',
  },
};

/**
 * ConnectPlatformModal Component
 */
export function ConnectPlatformModal({ isOpen, onClose, onSuccess }: ConnectPlatformModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);

  const initiateScan = usePlatformScan();

  /**
   * Handle platform selection
   */
  const handlePlatformSelect = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    setCredentials({});
    setErrors({});
    setConnectionProgress(0);
  };

  /**
   * Handle credential input change
   */
  const handleCredentialChange = (name: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Validate credentials
   */
  const validateCredentials = (): boolean => {
    if (!selectedPlatform) return false;

    const platform = PLATFORMS[selectedPlatform];
    const newErrors: Record<string, string> = {};

    for (const field of platform.credentialFields) {
      if (field.required && !credentials[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validation && credentials[field.name]) {
        const validationError = field.validation(credentials[field.name]);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle platform connection
   */
  const handleConnect = async () => {
    if (!selectedPlatform || !validateCredentials()) return;

    setIsConnecting(true);
    setConnectionProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setConnectionProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Prepare scan credentials
      const scanCredentials = {
        platform: selectedPlatform,
        ...credentials,
      };

      // Initiate scan
      await initiateScan.mutateAsync(scanCredentials);

      clearInterval(progressInterval);
      setConnectionProgress(100);

      toast.success(`${PLATFORMS[selectedPlatform].name} connected successfully!`);
      onSuccess(selectedPlatform);
      
      // Reset state after successful connection
      setTimeout(() => {
        setSelectedPlatform(null);
        setCredentials({});
        setErrors({});
        setConnectionProgress(0);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to connect platform:', error);
      toast.error(`Failed to connect ${PLATFORMS[selectedPlatform].name}. Please check your credentials and try again.`);
      setConnectionProgress(0);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isConnecting) {
      setSelectedPlatform(null);
      setCredentials({});
      setErrors({});
      setConnectionProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect Social Media Platform</DialogTitle>
          <DialogDescription>
            Connect your social media accounts to monitor algorithm health, detect threats, and receive crisis alerts.
          </DialogDescription>
        </DialogHeader>

        {!selectedPlatform ? (
          // Platform Selection
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(PLATFORMS).map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-accent"
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <Icon className={`h-8 w-8 ${platform.color}`} />
                    <div className="text-center">
                      <h3 className="font-medium">{platform.displayName}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{platform.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                LinkShield requires API access to monitor your accounts. Your credentials are encrypted and stored securely.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          // Credential Form
          <div className="space-y-6">
            {/* Platform Header */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlatform(null)}
                disabled={isConnecting}
              >
                ← Back
              </Button>
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = PLATFORMS[selectedPlatform].icon;
                  return <Icon className={`h-6 w-6 ${PLATFORMS[selectedPlatform].color}`} />;
                })()}
                <h3 className="text-lg font-medium">{PLATFORMS[selectedPlatform].displayName}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Credential Form */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Enter Your Credentials</h4>
                  <p className="text-sm text-muted-foreground">
                    {PLATFORMS[selectedPlatform].setupGuide}
                  </p>
                </div>

                {PLATFORMS[selectedPlatform].credentialFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      value={credentials[field.name] || ''}
                      onChange={(e) => handleCredentialChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={isConnecting}
                      aria-invalid={!!errors[field.name]}
                      aria-describedby={`${field.name}-error ${field.name}-description`}
                    />
                    {field.description && (
                      <p id={`${field.name}-description`} className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    )}
                    {errors[field.name] && (
                      <p id={`${field.name}-error`} className="text-xs text-red-500" role="alert">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                {isConnecting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connecting...</span>
                      <span className="text-sm">{connectionProgress}%</span>
                    </div>
                    <Progress value={connectionProgress} className="h-2" />
                  </div>
                )}
              </div>

              {/* Setup Guide */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Setup Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    Follow these steps to get your credentials:
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {PLATFORMS[selectedPlatform].setupGuide}
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => window.open(PLATFORMS[selectedPlatform].documentationUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Documentation
                </Button>

                <Separator />

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Security Notice</h5>
                  <p className="text-xs text-muted-foreground">
                    Your credentials are encrypted at rest and in transit. We only access the data necessary to provide protection services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!selectedPlatform ? (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting || connectionProgress > 0}
                className="gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Connect {PLATFORMS[selectedPlatform].displayName}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectPlatformModal;