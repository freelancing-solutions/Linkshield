'use client';

import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Plus, 
  Settings, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlatformConfig {
  platform_id: string;
  platform_name: string;
  enabled: boolean;
  monitoring_level: 'basic' | 'standard' | 'comprehensive';
  auto_block: boolean;
  scan_frequency: 'realtime' | 'hourly' | 'daily';
}

interface PlatformSettingsData {
  connected_platforms: PlatformConfig[];
}

interface PlatformSettingsProps {
  settings: PlatformSettingsData;
  onChange: (settings: PlatformSettingsData) => void;
  isLoading?: boolean;
}

export const PlatformSettings: React.FC<PlatformSettingsProps> = ({
  settings,
  onChange,
  isLoading = false
}) => {
  const [showAddPlatform, setShowAddPlatform] = useState(false);

  const availablePlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Monitor posts, messages, and friend requests'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-black',
      bgColor: 'bg-gray-50 border-gray-200',
      description: 'Track tweets, DMs, and mentions'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 border-pink-200',
      description: 'Scan posts, stories, and direct messages'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Professional network monitoring'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      description: 'Comments and channel activity'
    }
  ];

  const monitoringLevels = [
    {
      value: 'basic',
      label: 'Basic',
      description: 'Essential threat detection',
      features: ['Malicious links', 'Spam detection']
    },
    {
      value: 'standard',
      label: 'Standard',
      description: 'Comprehensive protection',
      features: ['All basic features', 'Phishing detection', 'Social engineering']
    },
    {
      value: 'comprehensive',
      label: 'Comprehensive',
      description: 'Maximum security coverage',
      features: ['All standard features', 'Behavioral analysis', 'Advanced AI detection']
    }
  ];

  const scanFrequencies = [
    { value: 'realtime', label: 'Real-time', description: 'Instant monitoring' },
    { value: 'hourly', label: 'Hourly', description: 'Every hour' },
    { value: 'daily', label: 'Daily', description: 'Once per day' }
  ];

  const updatePlatform = (platformId: string, updates: Partial<PlatformConfig>) => {
    const updatedPlatforms = settings.connected_platforms.map(platform =>
      platform.platform_id === platformId
        ? { ...platform, ...updates }
        : platform
    );
    
    onChange({
      ...settings,
      connected_platforms: updatedPlatforms
    });
  };

  const addPlatform = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    if (!platform) return;

    const newPlatform: PlatformConfig = {
      platform_id: platformId,
      platform_name: platform.name,
      enabled: true,
      monitoring_level: 'standard',
      auto_block: false,
      scan_frequency: 'realtime'
    };

    onChange({
      ...settings,
      connected_platforms: [...settings.connected_platforms, newPlatform]
    });
    setShowAddPlatform(false);
  };

  const removePlatform = (platformId: string) => {
    const updatedPlatforms = settings.connected_platforms.filter(
      platform => platform.platform_id !== platformId
    );
    
    onChange({
      ...settings,
      connected_platforms: updatedPlatforms
    });
  };

  const connectedPlatformIds = settings.connected_platforms.map(p => p.platform_id);
  const availableToAdd = availablePlatforms.filter(p => !connectedPlatformIds.includes(p.id));

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'text-green-600' : 'text-gray-400';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? CheckCircle : EyeOff;
  };

  return (
    <div className="space-y-6">
      {/* Connected Platforms */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                Connected Platforms
              </CardTitle>
              <CardDescription>
                Manage your connected social media accounts and their security settings.
              </CardDescription>
            </div>
            {availableToAdd.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddPlatform(!showAddPlatform)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Platform
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.connected_platforms.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Platforms Connected</h3>
              <p className="text-gray-600 mb-4">
                Connect your social media accounts to start monitoring for threats.
              </p>
              <Button onClick={() => setShowAddPlatform(true)} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Platform
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.connected_platforms.map((platform) => {
                const platformInfo = availablePlatforms.find(p => p.id === platform.platform_id);
                if (!platformInfo) return null;

                const Icon = platformInfo.icon;
                const StatusIcon = getStatusIcon(platform.enabled);

                return (
                  <Card key={platform.platform_id} className={`${platformInfo.bgColor}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${platformInfo.color}`} />
                          <div>
                            <h3 className="font-medium text-gray-900">{platform.platform_name}</h3>
                            <p className="text-sm text-gray-600">{platformInfo.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-5 w-5 ${getStatusColor(platform.enabled)}`} />
                          <Badge variant={platform.enabled ? 'default' : 'secondary'}>
                            {platform.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePlatform(platform.platform_id)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Enable/Disable Platform */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`${platform.platform_id}-enabled`} className="text-sm font-medium">
                            Enable Monitoring
                          </Label>
                          <Switch
                            id={`${platform.platform_id}-enabled`}
                            checked={platform.enabled}
                            onCheckedChange={(checked) => updatePlatform(platform.platform_id, { enabled: checked })}
                            disabled={isLoading}
                          />
                        </div>

                        {platform.enabled && (
                          <>
                            <Separator />
                            
                            {/* Monitoring Level */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Monitoring Level</Label>
                              <Select
                                value={platform.monitoring_level}
                                onValueChange={(value: 'basic' | 'standard' | 'comprehensive') => 
                                  updatePlatform(platform.platform_id, { monitoring_level: value })
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {monitoringLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                      <div className="flex flex-col">
                                        <span>{level.label}</span>
                                        <span className="text-xs text-gray-500">{level.description}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Scan Frequency */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Scan Frequency</Label>
                              <Select
                                value={platform.scan_frequency}
                                onValueChange={(value: 'realtime' | 'hourly' | 'daily') => 
                                  updatePlatform(platform.platform_id, { scan_frequency: value })
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {scanFrequencies.map((freq) => (
                                    <SelectItem key={freq.value} value={freq.value}>
                                      <div className="flex items-center gap-2">
                                        {freq.value === 'realtime' && <Zap className="h-4 w-4" />}
                                        <div className="flex flex-col">
                                          <span>{freq.label}</span>
                                          <span className="text-xs text-gray-500">{freq.description}</span>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Auto Block */}
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label htmlFor={`${platform.platform_id}-autoblock`} className="text-sm font-medium">
                                  Auto-block Threats
                                </Label>
                                <p className="text-xs text-gray-600">
                                  Automatically block detected malicious content
                                </p>
                              </div>
                              <Switch
                                id={`${platform.platform_id}-autoblock`}
                                checked={platform.auto_block}
                                onCheckedChange={(checked) => updatePlatform(platform.platform_id, { auto_block: checked })}
                                disabled={isLoading}
                              />
                            </div>

                            {/* Monitoring Features */}
                            <div className="bg-white bg-opacity-50 rounded-lg p-3">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Active Features:</h4>
                              <div className="flex flex-wrap gap-1">
                                {monitoringLevels
                                  .find(level => level.value === platform.monitoring_level)
                                  ?.features.map((feature, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))
                                }
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add Platform Section */}
          {showAddPlatform && availableToAdd.length > 0 && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Add Platform</CardTitle>
                <CardDescription>
                  Select a social media platform to connect and monitor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableToAdd.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <Button
                        key={platform.id}
                        variant="outline"
                        className="justify-start h-auto p-4"
                        onClick={() => addPlatform(platform.id)}
                        disabled={isLoading}
                      >
                        <Icon className={`h-5 w-5 mr-3 ${platform.color}`} />
                        <div className="text-left">
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-xs text-gray-500">{platform.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddPlatform(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Platform Summary */}
      {settings.connected_platforms.length > 0 && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-gray-600" />
              Platform Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {settings.connected_platforms.length}
                </div>
                <div className="text-sm text-gray-600">Connected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {settings.connected_platforms.filter(p => p.enabled).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {settings.connected_platforms.filter(p => p.monitoring_level === 'comprehensive').length}
                </div>
                <div className="text-sm text-gray-600">Comprehensive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {settings.connected_platforms.filter(p => p.auto_block).length}
                </div>
                <div className="text-sm text-gray-600">Auto-block</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};