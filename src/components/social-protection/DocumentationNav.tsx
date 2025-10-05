'use client';

import React from 'react';
import { BookOpen, Settings, Code, HelpCircle, Play, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Documentation section types
type DocumentationSection = 'getting-started' | 'platform-setup' | 'features' | 'api-reference' | 'troubleshooting';

interface DocumentationNavProps {
  activeSection: DocumentationSection;
  onSectionChange: (section: DocumentationSection) => void;
  className?: string;
}

interface NavItem {
  id: DocumentationSection;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  estimatedTime?: string;
}

export const DocumentationNav: React.FC<DocumentationNavProps> = ({
  activeSection,
  onSectionChange,
  className = ''
}) => {
  const navItems: NavItem[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Overview, quick start guide, and video tutorials',
      icon: BookOpen,
      badge: 'Start Here',
      estimatedTime: '5 min read'
    },
    {
      id: 'platform-setup',
      title: 'Platform Setup',
      description: 'Connect your social media accounts and configure credentials',
      icon: Settings,
      estimatedTime: '10 min read'
    },
    {
      id: 'features',
      title: 'Features',
      description: 'Detailed documentation for all Social Protection features',
      icon: Play,
      estimatedTime: '15 min read'
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Endpoint documentation with request/response examples',
      icon: Code,
      badge: 'Technical',
      estimatedTime: '20 min read'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues, solutions, and frequently asked questions',
      icon: HelpCircle,
      estimatedTime: '8 min read'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <Home className="h-4 w-4 mr-1" />
        <span>Documentation</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span>Social Protection</span>
        {activeSection && (
          <>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">
              {navItems.find(item => item.id === activeSection)?.title}
            </span>
          </>
        )}
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isActive 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      {item.badge && (
                        <Badge 
                          variant={isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 ${
                      isActive ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                    
                    {item.estimatedTime && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{item.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className={`h-5 w-5 transition-transform ${
                    isActive 
                      ? 'text-blue-600 transform rotate-90' 
                      : 'text-gray-400'
                  }`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto p-2"
              onClick={() => onSectionChange('getting-started')}
            >
              <BookOpen className="h-4 w-4 mr-2 text-green-600" />
              <div>
                <div className="font-medium">Quick Start</div>
                <div className="text-xs text-gray-500">Get up and running in 5 minutes</div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto p-2"
              onClick={() => onSectionChange('api-reference')}
            >
              <Code className="h-4 w-4 mr-2 text-blue-600" />
              <div>
                <div className="font-medium">API Endpoints</div>
                <div className="text-xs text-gray-500">Integration reference</div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto p-2"
              onClick={() => onSectionChange('troubleshooting')}
            >
              <HelpCircle className="h-4 w-4 mr-2 text-orange-600" />
              <div>
                <div className="font-medium">Need Help?</div>
                <div className="text-xs text-gray-500">Common issues and solutions</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Documentation Progress</h4>
          <div className="space-y-2">
            {navItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  activeSection === item.id 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  activeSection === item.id 
                    ? 'text-blue-900 font-medium' 
                    : 'text-gray-600'
                }`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};