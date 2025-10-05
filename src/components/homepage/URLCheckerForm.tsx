/**
 * URLCheckerForm Component
 * 
 * Main URL input form with scan type selection and validation.
 * Handles both anonymous and authenticated user flows.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCheckURL } from '@/hooks/homepage';
import { urlCheckFormSchema, normalizeURL, checkURLHeuristics } from '@/lib/validations/homepage';
import type { URLCheckFormData } from '@/lib/validations/homepage';
import type { URLCheckResponse } from '@/types/homepage';
import { ScanTypeSelector } from './ScanTypeSelector';
import { RateLimitNotice } from './RateLimitNotice';
import { DomainReputationBadge } from './DomainReputationBadge';

interface URLCheckerFormProps {
  isAuthenticated?: boolean;
  onResultsReceived?: (results: URLCheckResponse) => void;
}

export const URLCheckerForm: React.FC<URLCheckerFormProps> = ({
  isAuthenticated = false,
  onResultsReceived,
}) => {
  const [heuristics, setHeuristics] = useState<string[]>([]);
  const checkURL = useCheckURL();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<URLCheckFormData>({
    resolver: zodResolver(urlCheckFormSchema),
    defaultValues: {
      url: '',
      scanType: 'SECURITY',
    },
  });

  const urlValue = watch('url');
  const scanType = watch('scanType');

  // Check URL heuristics when URL changes
  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('url', url);

    if (url.length > 10) {
      const normalized = normalizeURL(url);
      const { warnings } = checkURLHeuristics(normalized);
      setHeuristics(warnings);
    } else {
      setHeuristics([]);
    }
  };

  const onSubmit = async (data: URLCheckFormData) => {
    try {
      const normalizedURL = normalizeURL(data.url);
      const result = await checkURL.mutateAsync({
        url: normalizedURL,
        scanType: data.scanType,
      });

      if (onResultsReceived) {
        onResultsReceived(result);
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error('URL check failed:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url" className="text-lg font-semibold">
            Enter URL to Check
          </Label>
          <div className="relative">
            <Input
              id="url"
              type="text"
              placeholder="https://example.com"
              {...register('url')}
              onChange={handleURLChange}
              className="text-lg py-6 pr-12"
              disabled={checkURL.isPending}
              aria-invalid={!!errors.url}
              aria-describedby={errors.url ? 'url-error' : undefined}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          {errors.url && (
            <p id="url-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.url.message}
            </p>
          )}

          {/* Heuristic Warnings */}
          {heuristics.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Potential Issues Detected:
                  </p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {heuristics.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Domain Reputation Badge */}
          {urlValue && urlValue.length > 10 && (
            <div className="mt-3">
              <DomainReputationBadge url={normalizeURL(urlValue)} />
            </div>
          )}
        </div>

        {/* Scan Type Selector */}
        <ScanTypeSelector
          value={scanType}
          onChange={(value) => setValue('scanType', value)}
          isAuthenticated={isAuthenticated}
          disabled={checkURL.isPending}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-lg py-6"
          disabled={checkURL.isPending || !urlValue}
        >
          {checkURL.isPending ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Scanning URL...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Check URL Security
            </>
          )}
        </Button>

        {/* Rate Limit Notice for Anonymous Users */}
        {!isAuthenticated && (
          <RateLimitNotice />
        )}
      </form>

      {/* Loading Progress */}
      {checkURL.isPending && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Analyzing URL security...
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Checking against multiple security providers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
