/**
 * HeroSection Component
 * 
 * Main hero section for the homepage with headline, value proposition,
 * and trust indicators.
 */

'use client';

import { Shield, CheckCircle, Users, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-4">
        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Trusted by 100,000+ users worldwide</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Protect Yourself from
            <span className="text-blue-600 dark:text-blue-400"> Malicious URLs</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Check any URL for security threats in seconds. Powered by multiple security providers 
            and AI-driven analysis to keep you safe online.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              10M+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              URLs Scanned
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              100K+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Active Users
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-4">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              &lt;5s
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Average Scan Time
            </p>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
};
