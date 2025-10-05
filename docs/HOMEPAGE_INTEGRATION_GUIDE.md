# Homepage Integration Guide

## Overview

This guide explains how to integrate and use the homepage URL checker components in your LinkShield application.

## Component Architecture

```
HomePage (src/app/page.tsx)
├── HeroSection
├── URLCheckerForm
│   ├── ScanTypeSelector
│   ├── RateLimitNotice (anonymous users)
│   └── ErrorDisplay (on errors)
├── ScanResults (after scan)
│   ├── RiskScoreGauge
│   ├── ThreatLevelBadge
│   ├── ProviderResultsAccordion
│   ├── BrokenLinksTab
│   ├── ResultActions
│   │   └── ViewInHistoryButton (authenticated)
│   └── DomainReputationBadge
├── QuickActionsPanel (authenticated)
├── SocialProtectionPanel (authenticated)
│   ├── ExtensionStatusCard
│   ├── AlgorithmHealthSummary
│   └── SocialAccountScan
├── SubscriptionPlanCard (authenticated)
└── SignUpCTA (anonymous)
```

## Basic Usage

### 1. URL Checking Flow

```typescript
import { URLCheckerForm } from '@/components/homepage/URLCheckerForm';
import { ScanResults } from '@/components/homepage/ScanResults';
import { useState } from 'react';

function HomePage() {
  const [results, setResults] = useState(null);
  const isAuthenticated = false; // Get from auth store

  return (
    <>
      <URLCheckerForm
        isAuthenticated={isAuthenticated}
        onResultsReceived={setResults}
      />
      
      {results && (
        <ScanResults 
          results={results} 
          isAuthenticated={isAuthenticated} 
        />
      )}
    </>
  );
}
```

### 2. Error Handling

```typescript
import { ErrorDisplay } from '@/components/homepage/ErrorDisplay';
import { mapApiError } from '@/lib/utils/homepage-errors';

function MyComponent() {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    const mappedError = mapApiError(err);
    setError(mappedError);
  };

  return (
    <>
      {error && (
        <ErrorDisplay
          error={error}
          type="network"
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
```

### 3. Loading States

```typescript
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ScanResultsSkeleton } from '@/components/shared/SkeletonLoaders';

function MyComponent() {
  const { data, isLoading } = useUrlCheck();

  if (isLoading) {
    return <ScanResultsSkeleton />;
  }

  return <ScanResults results={data} />;
}
```

### 4. Rate Limiting

```typescript
import { RateLimitNotice, parseRateLimitHeaders } from '@/components/homepage/RateLimitNotice';

function MyComponent() {
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  const handleApiError = (error) => {
    if (error.response?.status === 429) {
      const info = parseRateLimitHeaders(error.response.headers);
      setRateLimitInfo(info);
    }
  };

  return (
    <>
      {rateLimitInfo && (
        <RateLimitNotice
          rateLimitInfo={rateLimitInfo}
          variant="warning"
          showUpgrade={true}
        />
      )}
    </>
  );
}
```

### 5. Sign-Up CTAs

```typescript
import { SignUpCTA } from '@/components/homepage/SignUpCTA';

// Card variant (default)
<SignUpCTA variant="card" context="general" />

// Inline variant
<SignUpCTA variant="inline" context="rate-limit" />

// Banner variant
<SignUpCTA variant="banner" context="feature-locked" />
```

### 6. Social Account Analysis

```typescript
import { SocialAccountScan } from '@/components/homepage/SocialAccountScan';

// Only show to authenticated users
{isAuthenticated && (
  <SocialAccountScan />
)}
```

### 7. Quick Actions Panel

```typescript
import { QuickActionsPanel } from '@/components/homepage/QuickActionsPanel';

const recentActivity = {
  lastScan: '2025-01-04T10:30:00Z',
  totalScans: 42,
  lastReport: '2025-01-03T15:20:00Z',
};

<QuickActionsPanel recentActivity={recentActivity} />
```

## Authentication Gating

Components that require authentication:

```typescript
import { useAuthStore } from '@/stores/authStore';

function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {/* Always visible */}
      <URLCheckerForm isAuthenticated={isAuthenticated} />

      {/* Authenticated only */}
      {isAuthenticated && (
        <>
          <QuickActionsPanel />
          <SocialProtectionPanel />
          <SocialAccountScan />
          <SubscriptionPlanCard />
        </>
      )}

      {/* Anonymous only */}
      {!isAuthenticated && (
        <SignUpCTA variant="card" context="general" />
      )}
    </>
  );
}
```

## Responsive Design

All components are responsive by default:

- **Mobile (< 768px)**: Single column, stacked layout
- **Tablet (768px - 1024px)**: 2-column grid where appropriate
- **Desktop (> 1024px)**: 3-column grid, full features

### Custom Breakpoints

```typescript
// Tailwind breakpoints used:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## Error Recovery

### Retry Logic

```typescript
import { retryWithBackoff } from '@/lib/utils/homepage-errors';

const checkUrl = async (url: string) => {
  return retryWithBackoff(
    () => urlCheckService.check({ url, scan_type: 'SECURITY' }),
    {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 2,
    }
  );
};
```

### Error Type Detection

```typescript
import {
  isNetworkError,
  isTimeoutError,
  isRateLimitError,
  requiresAuthentication,
  requiresUpgrade,
} from '@/lib/utils/homepage-errors';

const handleError = (error) => {
  if (isNetworkError(error)) {
    // Show network error message
  } else if (isRateLimitError(error)) {
    // Show rate limit notice
  } else if (requiresAuthentication(error)) {
    // Redirect to login
  } else if (requiresUpgrade(error)) {
    // Show upgrade CTA
  }
};
```

## Performance Optimization

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const SocialAccountScan = dynamic(
  () => import('@/components/homepage/SocialAccountScan').then(mod => ({ default: mod.SocialAccountScan })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);
```

### React Query Caching

```typescript
// Configure stale times based on data volatility
useQuery({
  queryKey: ['url-history'],
  queryFn: getUrlHistory,
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});
```

## Accessibility

All components include:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast (WCAG AA)

### Testing Accessibility

```bash
# Run axe accessibility tests
npm run test:a11y

# Test with keyboard only
# - Tab through all interactive elements
# - Enter/Space to activate buttons
# - Escape to close modals
```

## Common Patterns

### Conditional Rendering

```typescript
// Show different content based on auth state
{isAuthenticated ? (
  <QuickActionsPanel />
) : (
  <SignUpCTA variant="card" />
)}

// Show content based on subscription plan
{user?.subscription_plan === 'PRO' ? (
  <DeepScanOption />
) : (
  <UpgradeCTA />
)}
```

### Loading States

```typescript
// Use skeleton loaders
{isLoading ? (
  <ScanResultsSkeleton />
) : (
  <ScanResults results={data} />
)}

// Use spinner for inline loading
{isSubmitting && <InlineLoadingSpinner />}
```

### Error Boundaries

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorCard error="Something went wrong" />}>
  <SocialAccountScan />
</ErrorBoundary>
```

## Troubleshooting

### Component Not Rendering

1. Check authentication state
2. Verify props are passed correctly
3. Check console for errors
4. Ensure required hooks are available

### Styles Not Applied

1. Verify Tailwind CSS is configured
2. Check for conflicting CSS
3. Ensure dark mode classes are correct
4. Clear Next.js cache: `rm -rf .next`

### API Errors

1. Check network tab for failed requests
2. Verify API base URL is correct
3. Check authentication token
4. Review error messages in console

## Best Practices

1. **Always handle loading states** - Use skeletons or spinners
2. **Always handle errors** - Show user-friendly messages
3. **Gate features by auth** - Check `isAuthenticated` before rendering
4. **Gate features by plan** - Check subscription plan for premium features
5. **Use TypeScript** - Leverage type safety
6. **Test accessibility** - Use keyboard and screen readers
7. **Optimize performance** - Lazy load heavy components
8. **Cache API responses** - Use React Query effectively

## Examples

See `src/app/page.tsx` for a complete integration example.

## Support

For issues or questions:
- Check component JSDoc comments
- Review type definitions in `src/types/homepage.ts`
- See error codes in `src/lib/utils/homepage-errors.ts`
