/**
 * BrokenLinksTab Component
 * 
 * Displays list of broken links found during deep scan.
 */

'use client';

import { ExternalLink, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BrokenLink } from '@/types/homepage';

interface BrokenLinksTabProps {
    links: BrokenLink[];
}

export const BrokenLinksTab: React.FC<BrokenLinksTabProps> = ({ links }) => {
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const getStatusCodeColor = (code: number): string => {
        if (code >= 400 && code < 500) {
            return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
        }
        if (code >= 500) {
            return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
        }
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    };

    const getStatusCodeLabel = (code: number): string => {
        const labels: Record<number, string> = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            408: 'Timeout',
            500: 'Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
        };
        return labels[code] || `Error ${code}`;
    };

    const getSuggestion = (code: number): string => {
        if (code === 404) {
            return 'The page may have been moved or deleted. Check if the URL is correct.';
        }
        if (code >= 500) {
            return 'The server is experiencing issues. Try again later or contact the site owner.';
        }
        if (code === 403) {
            return 'Access to this resource is restricted. You may need special permissions.';
        }
        return 'Check the URL and try again. Contact the site owner if the problem persists.';
    };

    if (links.length === 0) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    No Broken Links Found
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                    All links on this page are working correctly.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                            {links.length} broken link{links.length > 1 ? 's' : ''} detected
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                            These links may lead to missing pages or server errors. Consider fixing or removing them.
                        </p>
                    </div>
                </div>
            </div>

            {/* Broken Links List */}
            <div className="space-y-3">
                {links.map((link, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                    >
                        <div className="space-y-3">
                            {/* URL and Status Code */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
                                        >
                                            {link.url}
                                        </a>
                                        <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                    </div>

                                    {link.context && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Found in: {link.context}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusCodeColor(
                                            link.status_code
                                        )}`}
                                    >
                                        {link.status_code}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(link.url)}
                                        className="h-8 w-8 p-0"
                                        aria-label="Copy URL"
                                    >
                                        {copiedUrl === link.url ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Error Message */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {getStatusCodeLabel(link.status_code)}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {link.error_message}
                                </p>
                            </div>

                            {/* Suggestion */}
                            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    <strong>Suggestion:</strong> {getSuggestion(link.status_code)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
