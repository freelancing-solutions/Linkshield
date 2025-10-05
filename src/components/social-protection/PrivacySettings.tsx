'use client';

import React from 'react';
import { Shield, Eye, Database, Lock, AlertTriangle, Info, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface PrivacySettingsData {
  data_collection_consent: boolean;
  anonymous_analytics: boolean;
  share_threat_data: boolean;
  data_retention_period: '30days' | '90days' | '1year' | 'indefinite';
}

interface PrivacySettingsProps {
  settings: PrivacySettingsData;
  onChange: (settings: PrivacySettingsData) => void;
  isLoading?: boolean;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings,
  onChange,
  isLoading = false
}) => {
  const handleToggle = (key: keyof PrivacySettingsData, value: boolean) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const handleRetentionChange = (period: '30days' | '90days' | '1year' | 'indefinite') => {
    onChange({
      ...settings,
      data_retention_period: period
    });
  };

  const retentionOptions = [
    {
      value: '30days',
      label: '30 Days',
      description: 'Data deleted after 30 days',
      recommended: false,
      privacy: 'Highest Privacy'
    },
    {
      value: '90days',
      label: '90 Days',
      description: 'Data deleted after 3 months',
      recommended: true,
      privacy: 'High Privacy'
    },
    {
      value: '1year',
      label: '1 Year',
      description: 'Data deleted after 1 year',
      recommended: false,
      privacy: 'Moderate Privacy'
    },
    {
      value: 'indefinite',
      label: 'Indefinite',
      description: 'Data kept until manually deleted',
      recommended: false,
      privacy: 'Standard Privacy'
    }
  ];

  const currentRetention = retentionOptions.find(opt => opt.value === settings.data_retention_period);

  const getPrivacyScore = () => {
    let score = 0;
    if (!settings.data_collection_consent) score += 25;
    if (!settings.anonymous_analytics) score += 20;
    if (!settings.share_threat_data) score += 15;
    
    // Retention period scoring
    switch (settings.data_retention_period) {
      case '30days': score += 40; break;
      case '90days': score += 30; break;
      case '1year': score += 20; break;
      case 'indefinite': score += 10; break;
    }
    
    return Math.min(score, 100);
  };

  const privacyScore = getPrivacyScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Data Collection Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-blue-600" />
            Data Collection
          </CardTitle>
          <CardDescription>
            Control what data LinkShield collects to provide security services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="data-collection" className="text-base font-medium">
                Allow Data Collection
              </Label>
              <p className="text-sm text-gray-600">
                Permit LinkShield to collect necessary data for threat detection and analysis
              </p>
            </div>
            <Switch
              id="data-collection"
              checked={settings.data_collection_consent}
              onCheckedChange={(checked) => handleToggle('data_collection_consent', checked)}
              disabled={isLoading}
            />
          </div>

          {!settings.data_collection_consent && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Limited Protection Mode</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Disabling data collection will significantly reduce LinkShield's ability to detect and prevent threats.
                    Some features may not work properly.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="anonymous-analytics" className="text-base font-medium">
                Anonymous Analytics
              </Label>
              <p className="text-sm text-gray-600">
                Share anonymized usage data to help improve LinkShield's security algorithms
              </p>
            </div>
            <Switch
              id="anonymous-analytics"
              checked={settings.anonymous_analytics}
              onCheckedChange={(checked) => handleToggle('anonymous_analytics', checked)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="share-threat-data" className="text-base font-medium">
                Share Threat Intelligence
              </Label>
              <p className="text-sm text-gray-600">
                Contribute anonymized threat data to improve global security for all users
              </p>
            </div>
            <Switch
              id="share-threat-data"
              checked={settings.share_threat_data}
              onCheckedChange={(checked) => handleToggle('share_threat_data', checked)}
              disabled={isLoading}
            />
          </div>

          {settings.share_threat_data && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Community Protection</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your contribution helps protect the entire LinkShield community. All shared data is anonymized and encrypted.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-purple-600" />
            Data Retention
          </CardTitle>
          <CardDescription>
            Configure how long your data is stored in LinkShield's systems.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Data Retention Period</Label>
            <Select
              value={settings.data_retention_period}
              onValueChange={handleRetentionChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                {retentionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                          {option.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentRetention && (
            <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {currentRetention.label} Retention
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        currentRetention.privacy === 'Highest Privacy' ? 'border-green-500 text-green-700' :
                        currentRetention.privacy === 'High Privacy' ? 'border-blue-500 text-blue-700' :
                        currentRetention.privacy === 'Moderate Privacy' ? 'border-yellow-500 text-yellow-700' :
                        'border-gray-500 text-gray-700'
                      }`}
                    >
                      {currentRetention.privacy}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">
                    {currentRetention.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">What Data is Stored?</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Threat detection logs and security events</li>
                  <li>• Anonymized usage patterns and preferences</li>
                  <li>• Security scan results and recommendations</li>
                  <li>• Account connection status (not credentials)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Score */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-green-600" />
            Privacy Score
          </CardTitle>
          <CardDescription>
            Your current privacy configuration rating based on selected settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Privacy Score:</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(privacyScore)}`}>
                  {privacyScore}
                </span>
                <span className="text-sm text-gray-500">/ 100</span>
                <Badge 
                  variant={privacyScore >= 80 ? 'default' : privacyScore >= 60 ? 'secondary' : 'destructive'}
                  className="ml-2"
                >
                  {getScoreLabel(privacyScore)}
                </Badge>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  privacyScore >= 80 ? 'bg-green-500' :
                  privacyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${privacyScore}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Privacy Factors:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!settings.data_collection_consent ? 'bg-green-500' : 'bg-red-500'}`} />
                    Data Collection: {settings.data_collection_consent ? 'Enabled' : 'Disabled'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!settings.anonymous_analytics ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    Analytics: {settings.anonymous_analytics ? 'Enabled' : 'Disabled'}
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Data Handling:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!settings.share_threat_data ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    Threat Sharing: {settings.share_threat_data ? 'Enabled' : 'Disabled'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      settings.data_retention_period === '30days' ? 'bg-green-500' :
                      settings.data_retention_period === '90days' ? 'bg-blue-500' :
                      settings.data_retention_period === '1year' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    Retention: {currentRetention?.label}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-gray-600" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your stored data and privacy preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
            <Button variant="outline" className="justify-start">
              <Eye className="h-4 w-4 mr-2" />
              View Privacy Policy
            </Button>
            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Delete All Data
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};