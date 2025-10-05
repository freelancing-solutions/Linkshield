'use client';

import React from 'react';
import { Monitor, Clock, Zap, Search, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MonitoringSettingsData {
  auto_scan: boolean;
  real_time_monitoring: boolean;
  deep_analysis: boolean;
  scan_frequency: 'hourly' | 'daily' | 'weekly';
}

interface MonitoringSettingsProps {
  settings: MonitoringSettingsData;
  onChange: (settings: MonitoringSettingsData) => void;
  isLoading?: boolean;
}

export const MonitoringSettings: React.FC<MonitoringSettingsProps> = ({
  settings,
  onChange,
  isLoading = false
}) => {
  const handleToggle = (key: keyof MonitoringSettingsData, value: boolean) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const handleFrequencyChange = (frequency: 'hourly' | 'daily' | 'weekly') => {
    onChange({
      ...settings,
      scan_frequency: frequency
    });
  };

  const frequencyOptions = [
    { value: 'hourly', label: 'Every Hour', description: 'Most comprehensive, higher resource usage' },
    { value: 'daily', label: 'Daily', description: 'Balanced monitoring and performance' },
    { value: 'weekly', label: 'Weekly', description: 'Light monitoring, minimal resource usage' }
  ];

  return (
    <div className="space-y-6">
      {/* Auto Scan Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-blue-600" />
            Automatic Scanning
          </CardTitle>
          <CardDescription>
            Configure when and how your social media content is automatically scanned for threats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Scan Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-scan" className="text-base font-medium">
                Enable Auto Scan
              </Label>
              <p className="text-sm text-gray-600">
                Automatically scan new posts and content for potential threats
              </p>
            </div>
            <Switch
              id="auto-scan"
              checked={settings.auto_scan}
              onCheckedChange={(checked) => handleToggle('auto_scan', checked)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          {/* Scan Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Scan Frequency</Label>
            <Select
              value={settings.scan_frequency}
              onValueChange={handleFrequencyChange}
              disabled={!settings.auto_scan || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scan frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!settings.auto_scan && (
              <p className="text-sm text-gray-500 italic">
                Enable auto scan to configure frequency
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Monitor className="h-5 w-5 text-green-600" />
            Real-time Monitoring
          </CardTitle>
          <CardDescription>
            Monitor your social media activity in real-time for immediate threat detection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="real-time" className="text-base font-medium">
                  Real-time Monitoring
                </Label>
                <Badge variant="secondary" className="text-xs">
                  Premium
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Continuously monitor your accounts for suspicious activity and immediate threats
              </p>
            </div>
            <Switch
              id="real-time"
              checked={settings.real_time_monitoring}
              onCheckedChange={(checked) => handleToggle('real_time_monitoring', checked)}
              disabled={isLoading}
            />
          </div>

          {settings.real_time_monitoring && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Real-time Protection Active</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your accounts are being monitored continuously. You'll receive instant alerts for any suspicious activity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deep Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-purple-600" />
            Deep Analysis
          </CardTitle>
          <CardDescription>
            Enable comprehensive AI-powered analysis for advanced threat detection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="deep-analysis" className="text-base font-medium">
                  Deep Analysis
                </Label>
                <Badge variant="outline" className="text-xs">
                  AI-Powered
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Use advanced AI algorithms to analyze content context, sentiment, and hidden threats
              </p>
            </div>
            <Switch
              id="deep-analysis"
              checked={settings.deep_analysis}
              onCheckedChange={(checked) => handleToggle('deep_analysis', checked)}
              disabled={isLoading}
            />
          </div>

          {settings.deep_analysis && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Deep Analysis Enabled</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    AI will analyze content context, sentiment patterns, and sophisticated threats that basic scanning might miss.
                  </p>
                  <p className="text-xs text-purple-600 mt-2">
                    Note: Deep analysis may take longer and consume more resources.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Status Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Current Monitoring Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                settings.auto_scan ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm font-medium">Auto Scan</p>
              <p className="text-xs text-gray-600">
                {settings.auto_scan ? `Every ${settings.scan_frequency}` : 'Disabled'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                settings.real_time_monitoring ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm font-medium">Real-time</p>
              <p className="text-xs text-gray-600">
                {settings.real_time_monitoring ? 'Active' : 'Disabled'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                settings.deep_analysis ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm font-medium">Deep Analysis</p>
              <p className="text-xs text-gray-600">
                {settings.deep_analysis ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};