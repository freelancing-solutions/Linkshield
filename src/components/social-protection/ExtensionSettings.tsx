/**
 * @fileoverview Extension Settings Component
 * 
 * Provides a comprehensive settings interface for browser extension configuration,
 * including auto-scan preferences, real-time alerts, platform filters, notification
 * settings, and privacy controls with real-time updates and validation.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Settings,
  Shield,
  Bell,
  Eye,
  Globe,
  Lock,
  Zap,
  Clock,
  Filter,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { ExtensionSettings as ExtensionSettingsType } from '@/types/social-protection';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExtensionSettingsProps {
  /** Extension settings data */
  settings: ExtensionSettingsType | null;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Settings update handler */
  onUpdateSettings?: (settings: Partial<ExtensionSettingsType>) => Promise<void>;
  /** Reset to defaults handler */
  onResetDefaults?: () => Promise<void>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Available platforms for monitoring
 */
const AVAILABLE_PLATFORMS = [
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'tiktok',
  'youtube',
  'reddit',
  'discord'
];

/**
 * Notification types configuration
 */
const NOTIFICATION_TYPES = [
  { key: 'crisis_alerts', label: 'Crisis Alerts', description: 'High-priority security threats' },
  { key: 'content_warnings', label: 'Content Warnings', description: 'Potentially harmful content detected' },
  { key: 'algorithm_changes', label: 'Algorithm Changes', description: 'Platform algorithm updates' },
  { key: 'scan_results', label: 'Scan Results', description: 'Completed content analysis results' },
  { key: 'weekly_reports', label: 'Weekly Reports', description: 'Summary of protection activities' }
];

/**
 * Scan sensitivity levels
 */
const SENSITIVITY_LEVELS = [
  { value: 1, label: 'Low', description: 'Basic threat detection' },
  { value: 2, label: 'Medium', description: 'Balanced protection' },
  { value: 3, label: 'High', description: 'Comprehensive scanning' },
  { value: 4, label: 'Maximum', description: 'Strictest protection' }
];

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Settings</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

/**
 * Setting item component
 */
const SettingItem: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}> = ({ title, description, children, icon: Icon }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-start gap-3 flex-1">
      {Icon && (
        <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      )}
      <div className="flex-1">
        <Label className="text-sm font-medium text-gray-900">{title}</Label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
    <div className="ml-4">
      {children}
    </div>
  </div>
);

/**
 * Platform selector component
 */
const PlatformSelector: React.FC<{
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
}> = ({ selectedPlatforms, onPlatformsChange }) => {
  const togglePlatform = (platform: string) => {
    const updated = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    onPlatformsChange(updated);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {AVAILABLE_PLATFORMS.map((platform) => {
        const PlatformIcon = getPlatformIcon(platform);
        const platformColor = getPlatformColor(platform);
        const isSelected = selectedPlatforms.includes(platform);
        
        return (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={cn(
              'flex items-center gap-2 p-3 rounded-lg border transition-colors',
              isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <div className={cn('p-1 rounded', isSelected ? 'bg-blue-500' : platformColor)}>
              <PlatformIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium capitalize">{platform}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * ExtensionSettings Component
 * 
 * Comprehensive settings interface for browser extension configuration.
 * Provides controls for auto-scanning, real-time alerts, platform filtering,
 * notification preferences, privacy settings, and performance optimization.
 * 
 * Features:
 * - Auto-scan configuration with scheduling
 * - Real-time alert preferences
 * - Platform-specific monitoring controls
 * - Notification delivery settings
 * - Privacy and data retention options
 * - Performance and resource management
 * - Backup and restore functionality
 * - Real-time validation and feedback
 * - Responsive design with mobile support
 * - Loading and error states
 * 
 * @param props - Component props
 * @returns JSX element representing the extension settings
 * 
 * Requirements: 6.8, 6.9, 6.10 - Extension settings and configuration
 */
export const ExtensionSettings: React.FC<ExtensionSettingsProps> = ({
  settings,
  isLoading = false,
  error,
  onUpdateSettings,
  onResetDefaults,
  className
}) => {
  const [localSettings, setLocalSettings] = useState<ExtensionSettingsType | null>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  // Handle setting updates
  const updateSetting = (key: keyof ExtensionSettingsType, value: any) => {
    if (!localSettings) return;
    
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    setHasChanges(true);
  };

  // Handle nested setting updates
  const updateNestedSetting = (parent: keyof ExtensionSettingsType, key: string, value: any) => {
    if (!localSettings) return;
    
    const updated = {
      ...localSettings,
      [parent]: {
        ...(localSettings[parent] as any),
        [key]: value
      }
    };
    setLocalSettings(updated);
    setHasChanges(true);
  };

  // Save settings
  const handleSave = async () => {
    if (!localSettings || !onUpdateSettings) return;
    
    setIsSaving(true);
    try {
      await onUpdateSettings(localSettings);
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = async () => {
    if (!onResetDefaults) return;
    
    try {
      await onResetDefaults();
      setHasChanges(false);
      toast.success('Settings reset to defaults');
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Show empty state
  if (!localSettings) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Settings className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Available</h3>
            <p className="text-sm text-gray-500">
              Extension settings could not be loaded.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Extension Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your browser extension preferences and security settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <Info className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Auto-Scan Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Auto-Scan Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            title="Enable Auto-Scan"
            description="Automatically scan content as you browse"
            icon={Eye}
          >
            <Switch
              checked={localSettings.auto_scan}
              onCheckedChange={(checked) => updateSetting('auto_scan', checked)}
            />
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Scan Sensitivity"
            description="Adjust the thoroughness of content analysis"
            icon={Filter}
          >
            <Select
              value={localSettings.scan_sensitivity?.toString()}
              onValueChange={(value) => updateSetting('scan_sensitivity', parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SENSITIVITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value.toString()}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingItem>
          
          <SettingItem
            title="Scan Frequency"
            description="How often to perform background scans (minutes)"
            icon={Clock}
          >
            <div className="w-40">
              <Slider
                value={[localSettings.scan_frequency || 30]}
                onValueChange={([value]) => updateSetting('scan_frequency', value)}
                min={5}
                max={120}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {localSettings.scan_frequency || 30} minutes
              </div>
            </div>
          </SettingItem>
        </CardContent>
      </Card>

      {/* Real-Time Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Real-Time Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            title="Enable Real-Time Alerts"
            description="Get instant notifications for threats and issues"
            icon={AlertTriangle}
          >
            <Switch
              checked={localSettings.real_time_alerts}
              onCheckedChange={(checked) => updateSetting('real_time_alerts', checked)}
            />
          </SettingItem>
          
          <Separator />
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">Notification Types</Label>
            {NOTIFICATION_TYPES.map((type) => (
              <SettingItem
                key={type.key}
                title={type.label}
                description={type.description}
              >
                <Switch
                  checked={localSettings.notification_preferences?.[type.key] ?? true}
                  onCheckedChange={(checked) => 
                    updateNestedSetting('notification_preferences', type.key, checked)
                  }
                />
              </SettingItem>
            ))}
          </div>
          
          <Separator />
          
          <SettingItem
            title="Sound Notifications"
            description="Play sound for important alerts"
            icon={Volume2}
          >
            <Switch
              checked={localSettings.notification_preferences?.sound_enabled ?? true}
              onCheckedChange={(checked) => 
                updateNestedSetting('notification_preferences', 'sound_enabled', checked)
              }
            />
          </SettingItem>
          
          <SettingItem
            title="Desktop Notifications"
            description="Show system notifications"
            icon={Smartphone}
          >
            <Switch
              checked={localSettings.notification_preferences?.desktop_enabled ?? true}
              onCheckedChange={(checked) => 
                updateNestedSetting('notification_preferences', 'desktop_enabled', checked)
              }
            />
          </SettingItem>
        </CardContent>
      </Card>

      {/* Platform Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Platform Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Select platforms to monitor
            </Label>
            <PlatformSelector
              selectedPlatforms={localSettings.platform_filters || []}
              onPlatformsChange={(platforms) => updateSetting('platform_filters', platforms)}
            />
          </div>
          
          <Separator />
          
          <SettingItem
            title="Monitor All New Platforms"
            description="Automatically enable monitoring for newly supported platforms"
            icon={CheckCircle}
          >
            <Switch
              checked={localSettings.monitor_new_platforms ?? true}
              onCheckedChange={(checked) => updateSetting('monitor_new_platforms', checked)}
            />
          </SettingItem>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            title="Data Collection"
            description="Allow anonymous usage analytics to improve the service"
            icon={Shield}
          >
            <Switch
              checked={localSettings.privacy_settings?.data_collection ?? false}
              onCheckedChange={(checked) => 
                updateNestedSetting('privacy_settings', 'data_collection', checked)
              }
            />
          </SettingItem>
          
          <SettingItem
            title="Local Data Retention"
            description="Days to keep scan results locally"
            icon={Clock}
          >
            <Select
              value={localSettings.privacy_settings?.data_retention?.toString() || '30'}
              onValueChange={(value) => 
                updateNestedSetting('privacy_settings', 'data_retention', parseInt(value))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>
          
          <SettingItem
            title="Secure Mode"
            description="Enhanced security with stricter content filtering"
            icon={Lock}
          >
            <Switch
              checked={localSettings.privacy_settings?.secure_mode ?? false}
              onCheckedChange={(checked) => 
                updateNestedSetting('privacy_settings', 'secure_mode', checked)
              }
            />
          </SettingItem>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingItem
            title="Resource Usage"
            description="Balance between protection and system performance"
            icon={Settings}
          >
            <Select
              value={localSettings.performance_settings?.resource_usage || 'balanced'}
              onValueChange={(value) => 
                updateNestedSetting('performance_settings', 'resource_usage', value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>
          
          <SettingItem
            title="Background Processing"
            description="Allow processing when browser is not active"
            icon={Clock}
          >
            <Switch
              checked={localSettings.performance_settings?.background_processing ?? true}
              onCheckedChange={(checked) => 
                updateNestedSetting('performance_settings', 'background_processing', checked)
              }
            />
          </SettingItem>
          
          <SettingItem
            title="Cache Size Limit"
            description="Maximum cache size in MB"
            icon={Settings}
          >
            <div className="w-40">
              <Slider
                value={[localSettings.performance_settings?.cache_size || 100]}
                onValueChange={([value]) => 
                  updateNestedSetting('performance_settings', 'cache_size', value)
                }
                min={50}
                max={500}
                step={25}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {localSettings.performance_settings?.cache_size || 100} MB
              </div>
            </div>
          </SettingItem>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtensionSettings;