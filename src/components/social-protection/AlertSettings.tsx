'use client';

import React from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface AlertSettingsData {
  email_alerts: boolean;
  push_notifications: boolean;
  alert_severity_threshold: 'low' | 'medium' | 'high';
  alert_channels: string[];
}

interface AlertSettingsProps {
  settings: AlertSettingsData;
  onChange: (settings: AlertSettingsData) => void;
  isLoading?: boolean;
}

export const AlertSettings: React.FC<AlertSettingsProps> = ({
  settings,
  onChange,
  isLoading = false
}) => {
  const handleToggle = (key: keyof AlertSettingsData, value: boolean) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const handleThresholdChange = (threshold: 'low' | 'medium' | 'high') => {
    onChange({
      ...settings,
      alert_severity_threshold: threshold
    });
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    const updatedChannels = checked
      ? [...settings.alert_channels, channel]
      : settings.alert_channels.filter(c => c !== channel);
    
    onChange({
      ...settings,
      alert_channels: updatedChannels
    });
  };

  const severityOptions = [
    {
      value: 'low',
      label: 'Low',
      description: 'All threats including minor risks',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Moderate to high-risk threats only',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    {
      value: 'high',
      label: 'High',
      description: 'Critical threats and emergencies only',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  ];

  const alertChannels = [
    {
      id: 'email',
      label: 'Email',
      description: 'Receive alerts via email',
      icon: Mail,
      enabled: settings.email_alerts
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Show alerts in your dashboard',
      icon: Bell,
      enabled: true // Always enabled
    },
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Browser push notifications',
      icon: Smartphone,
      enabled: settings.push_notifications
    },
    {
      id: 'sms',
      label: 'SMS',
      description: 'Text message alerts (Premium)',
      icon: Smartphone,
      enabled: false,
      premium: true
    }
  ];

  const currentThreshold = severityOptions.find(opt => opt.value === settings.alert_severity_threshold);

  return (
    <div className="space-y-6">
      {/* Alert Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-blue-600" />
            Alert Methods
          </CardTitle>
          <CardDescription>
            Choose how you want to receive security alerts and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Alerts */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-alerts" className="text-base font-medium">
                Email Alerts
              </Label>
              <p className="text-sm text-gray-600">
                Receive detailed threat reports and summaries via email
              </p>
            </div>
            <Switch
              id="email-alerts"
              checked={settings.email_alerts}
              onCheckedChange={(checked) => handleToggle('email_alerts', checked)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-gray-600">
                Get instant browser notifications for immediate threats
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.push_notifications}
              onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
              disabled={isLoading}
            />
          </div>

          {settings.push_notifications && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Browser Permissions Required</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Make sure to allow notifications in your browser settings to receive push alerts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Severity Threshold */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alert Severity Threshold
          </CardTitle>
          <CardDescription>
            Set the minimum threat level that will trigger alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Minimum Alert Level</Label>
            <Select
              value={settings.alert_severity_threshold}
              onValueChange={handleThresholdChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity threshold" />
              </SelectTrigger>
              <SelectContent>
                {severityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        option.value === 'low' ? 'bg-yellow-500' :
                        option.value === 'medium' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentThreshold && (
            <div className={`border rounded-lg p-4 ${currentThreshold.bgColor}`}>
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  currentThreshold.value === 'low' ? 'bg-yellow-500' :
                  currentThreshold.value === 'medium' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <div>
                  <h4 className={`font-medium ${currentThreshold.color}`}>
                    {currentThreshold.label} Severity Threshold
                  </h4>
                  <p className={`text-sm mt-1 ${currentThreshold.color.replace('600', '700')}`}>
                    {currentThreshold.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Alert Channels
          </CardTitle>
          <CardDescription>
            Select which channels should receive alerts based on your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {alertChannels.map((channel) => {
              const Icon = channel.icon;
              const isChecked = settings.alert_channels.includes(channel.id);
              const isDisabled = !channel.enabled || isLoading;
              
              return (
                <div
                  key={channel.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    isDisabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Checkbox
                    id={channel.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                    disabled={isDisabled}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className={`h-5 w-5 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={channel.id}
                          className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {channel.label}
                        </Label>
                        {channel.premium && (
                          <Badge variant="secondary" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                        {channel.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert Preview */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Alert Preview</CardTitle>
          <CardDescription>
            Based on your current settings, here's what alerts you'll receive:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">
                Alerts for <strong>{settings.alert_severity_threshold}</strong> severity and above
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">
                Delivered via: {settings.alert_channels.length > 0 
                  ? settings.alert_channels.join(', ') 
                  : 'dashboard only'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                settings.email_alerts || settings.push_notifications ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm">
                {settings.email_alerts || settings.push_notifications 
                  ? 'Real-time notifications enabled' 
                  : 'Dashboard-only notifications'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};