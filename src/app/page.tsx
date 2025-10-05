'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/homepage/HeroSection';
import { URLCheckerForm } from '@/components/homepage/URLCheckerForm';
import { ScanResults } from '@/components/homepage/ScanResults';
import { SocialProtectionPanel } from '@/components/homepage/SocialProtectionPanel';
import { SocialAccountScan } from '@/components/homepage/SocialAccountScan';
import { SubscriptionPlanCard } from '@/components/homepage/SubscriptionPlanCard';
import { QuickActionsPanel } from '@/components/homepage/QuickActionsPanel';
import { SignUpCTA } from '@/components/homepage/SignUpCTA';
import type { URLCheckResponse } from '@/types/homepage';

export default function HomePage() {
  const [results, setResults] = useState<URLCheckResponse | null>(null);

  // TODO: Get actual auth state from auth store
  const isAuthenticated = false;

  // Mock recent activity data
  const recentActivity = isAuthenticated ? {
    lastScan: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    totalScans: 42,
    lastReport: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  } : undefined;

  const handleResultsReceived = (checkResults: URLCheckResponse) => {
    setResults(checkResults);
    // Scroll to results section
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* URL Checker Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <URLCheckerForm
            isAuthenticated={isAuthenticated}
            onResultsReceived={handleResultsReceived}
          />
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section id="results-section" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Scan Results
              </h2>
              <ScanResults results={results} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </section>
      )}

      {/* Authenticated User Dashboard */}
      {isAuthenticated && (
        <>
          {/* Quick Actions Section */}
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <QuickActionsPanel recentActivity={recentActivity} />
              </div>
            </div>
          </section>

          {/* Social Protection Section */}
          <section className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Social Protection Panel */}
                  <SocialProtectionPanel />
                  
                  {/* Social Account Scan */}
                  <SocialAccountScan />
                </div>
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <SubscriptionPlanCard />
              </div>
            </div>
          </section>
        </>
      )}

      {/* Anonymous User CTA */}
      {!isAuthenticated && !results && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SignUpCTA variant="card" context="general" />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose LinkShield?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Multi-provider threat detection with real-time analysis
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get results in seconds with our optimized scanning engine
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Social Protection</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor and protect your social media presence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
