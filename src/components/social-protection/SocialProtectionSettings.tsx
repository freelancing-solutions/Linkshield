'use client';

import React, { useState } from 'react';
import { Settings, Monitor, Bell, Shield, Users, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MonitoringSettings } from './MonitoringSettings';
import { AlertSettings } from './AlertSettings';
import { PrivacySettings } from './PrivacySettings';
import { PlatformSettings } from './PlatformSettings';

// Types based on design specifications
interface SocialProtectionSettingsData {
  monitoring: MonitoringSettingsData;
  alerts: AlertSettingsData;
  privacy: PrivacySettingsData;
  platforms: ConnectedPlatform[];
}

interface MonitoringSettingsData {
  auto_scan: boolean;
  real_time_monitoring: boolean;
  deep_analysis: boolean;
  scan_frequency: 'hourly' | 'daily' | 'weekly';
}

interface AlertSettingsData {
  email_alerts: boolean;
  push_notifications: boolean;
  alert_severity_threshold: 'low' | 'medium' | 'high';
  alert_channels: string[];
}

interface PrivacySettingsData {
  data_retention: number; // days
  anonymous_scanning: boolean;
  share_threat_intelligence: boolean;
}

interface ConnectedPlatform {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'telegram' | 'discord';
  username: string;
  connected_at: string;
  status: 'active' | 'error' | 'disconnected';
  last_sync: string;
}

interface SocialProtectionSettingsProps {
  className?: string;
}

export const SocialProtectionSettings: React.FC<SocialProtectionSettingsProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock settings data - in real implementation, this would come from API
  const [settings, setSettings] = useState<SocialProtectionSettingsData>({
    monitoring: {
      auto_scan: true,
      real_time_monitoring: true,
      deep_analysis: false,
      scan_frequency: 'daily'
    },
    alerts: {
      email_alerts: true,
      push_notifications: false,
      alert_severity_threshold: 'medium',
      alert_channels: ['email', 'dashboard']
    },
    privacy: {
      data_retention: 90,
      anonymous_scanning: false,
      share_threat_intelligence: true
    },
    platforms: [
      {
        id: '1',
        platform: 'twitter',
        username: '@johndoe',
        connected_at: '2024-01-15T10:00:00Z',
        status: 'active',
        last_sync: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        platform: 'facebook',
        username: 'John Doe',
        connected_at: '2024-01-16T11:00:00Z',
        status: 'active',
        last_sync: '2024-01-20T14:25:00Z'
      },
      {
        id: '3',
        platform: 'instagram',
        username: '@john.doe',
        connected_at: '2024-01-17T12:00:00Z',
        status: 'error',
        last_sync: '2024-01-19T09:15:00Z'
      }
    ]
  });

  const [originalSettings, setOriginalSettings] = useState<SocialProtectionSettingsData>(settings);

  const tabs = [
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: Monitor,
      description: 'Configure automatic scanning and monitoring settings'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      description: 'Manage notification preferences and alert thresholds'
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: Shield,
      description: 'Control data retention and privacy preferences'
    },
    {
      id: 'platforms',
      label: 'Platforms',
      icon: Users,
      description: 'Manage connected social media platforms'
    }
  ];

  const handleSettingsChange = (section: keyof SocialProtectionSettingsData, newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: newSettings
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call - in real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API call: PUT /api/v1/social-protection/user/settings
      console.log('Saving settings:', settings);
      
      setOriginalSettings(settings);
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setHasUnsavedChanges(false);
    toast.info('Settings reset to last saved state');
  };

  const handlePlatformDisconnect = async (platformId: string) => {
    try {
      // Mock API call for platform disconnection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSettings(prev => ({
        ...prev,
        platforms: prev.platforms.filter(p => p.id !== platformId)
      }));
      
      setHasUnsavedChanges(true);
      toast.success('Platform disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect platform');
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Social Protection Settings</h1>
        </div>
        <p className="text-gray-600">
          Configure your social media monitoring, alerts, and privacy preferences.
        </p>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-orange-800 font-medium">You have unsaved changes</p>
                <p className="text-orange-700 text-sm">
                  Don't forget to save your settings before leaving this page.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        <div className="space-y-6">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.label} Settings
                  </CardTitle>
                  <CardDescription>{tab.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {tab.id === 'monitoring' && (
                    <MonitoringSettings
                      settings={settings.monitoring}
                      onChange={(newSettings) => handleSettingsChange('monitoring', newSettings)}
                      isLoading={isLoading}
                    />
                  )}
                  {tab.id === 'alerts' && (
                    <AlertSettings
                      settings={settings.alerts}
                      onChange={(newSettings) => handleSettingsChange('alerts', newSettings)}
                      isLoading={isLoading}
                    />
                  )}
                  {tab.id === 'privacy' && (
                    <PrivacySettings
                      settings={settings.privacy}
                      onChange={(newSettings) => handleSettingsChange('privacy', newSettings)}
                      isLoading={isLoading}
                    />
                  )}
                  {tab.id === 'platforms' && (
                    <PlatformSettings
                      platforms={settings.platforms}
                      onDisconnect={handlePlatformDisconnect}
                      isLoading={isLoading}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Save Actions */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasUnsavedChanges || isSaving}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Changes
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving Settings...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};