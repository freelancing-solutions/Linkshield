/**
 * SignUpCTA Component
 * 
 * Call-to-action component encouraging anonymous users to sign up.
 * Highlights premium features and benefits.
 * 
 * Features:
 * - Compelling headline and value proposition
 * - Feature highlights with icons
 * - Sign-up and login buttons
 * - Multiple variants (inline, card, banner)
 * - Responsive design
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

/**
 * Feature highlight
 */
interface Feature {
  icon: typeof CheckCircle;
  text: string;
}

/**
 * Component props
 */
interface SignUpCTAProps {
  variant?: 'inline' | 'card' | 'banner';
  context?: 'rate-limit' | 'feature-locked' | 'results' | 'general';
  className?: string;
}

/**
 * SignUpCTA Component
 */
export const SignUpCTA: React.FC<SignUpCTAProps> = ({
  variant = 'card',
  context = 'general',
  className = '',
}) => {
  const router = useRouter();

  /**
   * Get context-specific content
   */
  const getContent = () => {
    switch (context) {
      case 'rate-limit':
        return {
          badge: 'Rate Limit Reached',
          title: 'Unlock Unlimited Scans',
          description: 'Sign up for free to get 100 URL checks per hour and access advanced features.',
          features: [
            { icon: Zap, text: '100 checks per hour' },
            { icon: Shield, text: 'Advanced threat detection' },
            { icon: TrendingUp, text: 'Scan history & analytics' },
          ],
        };
      case 'feature-locked':
        return {
          badge: 'Premium Feature',
          title: 'Upgrade to Access This Feature',
          description: 'Get comprehensive analysis, AI insights, and more with a LinkShield account.',
          features: [
            { icon: Sparkles, text: 'Deep scan with broken links' },
            { icon: Shield, text: 'Full provider details' },
            { icon: TrendingUp, text: 'Domain reputation tracking' },
          ],
        };
      case 'results':
        return {
          badge: 'See More',
          title: 'Sign Up for Detailed Analysis',
          description: 'Create a free account to view complete scan results and save your checks.',
          features: [
            { icon: CheckCircle, text: 'Full provider reports' },
            { icon: Shield, text: 'Save scan history' },
            { icon: Users, text: 'Share results with team' },
          ],
        };
      default:
        return {
          badge: 'Get Started',
          title: 'Join LinkShield Today',
          description: 'Protect your online presence with advanced URL security and social media monitoring.',
          features: [
            { icon: Shield, text: 'Advanced URL scanning' },
            { icon: TrendingUp, text: 'Social media protection' },
            { icon: Zap, text: 'Real-time threat alerts' },
          ],
        };
    }
  };

  const content = getContent();

  /**
   * Handle sign up click
   */
  const handleSignUp = () => {
    router.push('/register');
  };

  /**
   * Handle login click
   */
  const handleLogin = () => {
    router.push('/login');
  };

  /**
   * Render inline variant
   */
  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">{content.title}</p>
            <p className="text-xs text-blue-700">{content.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogin}
            className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
          >
            Log In
          </Button>
          <Button
            size="sm"
            onClick={handleSignUp}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Render banner variant
   */
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <Badge variant="secondary" className="mb-2">
              {content.badge}
            </Badge>
            <h3 className="text-xl font-bold mb-2">{content.title}</h3>
            <p className="text-blue-100 text-sm max-w-2xl">
              {content.description}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleLogin}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Log In
            </Button>
            <Button
              onClick={handleSignUp}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render card variant (default)
   */
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <Badge variant="secondary" className="w-fit mx-auto mb-2">
          {content.badge}
        </Badge>
        <CardTitle className="text-2xl">{content.title}</CardTitle>
        <CardDescription className="text-base">
          {content.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features List */}
        <div className="space-y-3">
          {content.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">{feature.text}</p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSignUp}
            className="w-full"
            size="lg"
          >
            Sign Up Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="text-center">
            <button
              onClick={handleLogin}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>10,000+ users</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>1M+ scans</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Free forever</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
