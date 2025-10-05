# Homepage Components API Reference

## Table of Contents

1. [Components](#components)
2. [Hooks](#hooks)
3. [Utilities](#utilities)
4. [Types](#types)

## Components

### SocialAccountScan

Provides interface for scanning social media accounts.

```typescript
import { SocialAccountScan } from '@/components/homepage/SocialAccountScan';

<SocialAccountScan className="custom-class" />
```

**Props:**
- `className?: string` - Additional CSS classes

**Features:**
- Platform selection (Twitter, Instagram, Facebook, LinkedIn)
- Profile URL validation
- Visibility, engagement, and penalty analysis
- Tabbed results display

---

### QuickActionsPanel

Quick access panel for authenticated users.

```typescript
import { QuickActionsPanel } from '@/components/homepage/QuickActionsPanel';

<QuickActionsPanel
  recentActivity={{
    lastScan: '2025-01-04T10:30:00Z',
    totalScans: 42,
    lastReport: '2025-01-03T15:20:00Z',
  }}
/>
```

**Props:**
- `className?: string` - Additional CSS classes
- `recentActivity?: object` - Recent activity data
  - `lastScan?: string` - ISO timestamp of last scan
  - `totalScans?: number` - Total number of scans
  - `lastReport?: string` - ISO timestamp of last report

---

### ViewInHistoryButton

Navigation button to view scan in history.

```typescript
import { ViewInHistoryButton } from '@/components/homepage/ViewInHistoryButton';

<ViewInHistoryButton
  checkId="check_123"
  url="https://example.com"
  timestamp="2025-01-04T10:30:00Z"
  variant="outline"
  size="default"
/>
```

**Props:**
- `checkId: string` - Unique check identifier
- `url: string` - URL that was checked
- `timestamp: string` - ISO timestamp of check
- `variant?: 'default' | 'outline' | 'ghost'` - Button variant
- `size?: 'default' | 'sm' | 'lg' | 'icon'` - Button size
- `className?: string` - Additional CSS classes

---

### ViewInHistoryLink

Alternative link version with more details.

```typescript
import { ViewInHistoryLink } from '@/components/homepage/ViewInHistoryButton';

<ViewInHistoryLink
  checkId="check_123"
  url="https://example.com"
  timestamp="2025-01-04T10:30:00Z"
/>
```

**Props:**
- `checkId: string` - Unique check identifier
- `url: string` - URL that was checked
- `timestamp: string` - ISO timestamp of check
- `className?: string` - Additional CSS classes

---

### SignUpCTA

Call-to-action component for anonymous users.

```typescript
import { SignUpCTA } from '@/components/homepage/SignUpCTA';

<SignUpCTA
  variant="card"
  context="rate-limit"
/>
```

**Props:**
- `variant?: 'inline' | 'card' | 'banner'` - Display variant
- `context?: 'rate-limit' | 'feature-locked' | 'results' | 'general'` - Context for messaging
- `className?: string` - Additional CSS classes

**Variants:**
- `inline` - Compact inline banner
- `card` - Full card with features list (default)
- `banner` - Full-width gradient banner

**Contexts:**
- `rate-limit` - Shown when rate limit is reached
- `feature-locked` - Shown when premium feature is accessed
- `results` - Shown after scan results
- `general` - General sign-up promotion

---

### RateLimitNotice

Displays rate limit information.

```typescript
import { RateLimitNotice, parseRateLimitHeaders } from '@/components/homepage/RateLimitNotice';

// Parse headers from API response
const rateLimitInfo = parseRateLimitHeaders(response.headers);

<RateLimitNotice
  rateLimitInfo={rateLimitInfo}
  variant="warning"
  showUpgrade={true}
/>
```

**Props:**
- `rateLimitInfo?: RateLimitInfo` - Rate limit data
- `variant?: 'warning' | 'error' | 'info'` - Display variant
- `showUpgrade?: boolean` - Show upgrade CTA (default: true)
- `className?: string` - Additional CSS classes

**RateLimitInfo Type:**
```typescript
interface RateLimitInfo {
  limit: number;        // Total limit
  remaining: number;    // Remaining requests
  reset: number;        // Unix timestamp when limit resets
}
```

**Helper Function:**
```typescript
parseRateLimitHeaders(headers: Headers): RateLimitInfo | null
```

---

### ErrorDisplay

Displays error messages with appropriate styling.

```typescript
import { ErrorDisplay } from '@/components/homepage/ErrorDisplay';

<ErrorDisplay
  error={error}
  type="network"
  onRetry={handleRetry}
  showDetails={true}
/>
```

**Props:**
- `error: HomepageError | Error | string` - Error object or message
- `type?: ErrorType` - Error type for icon selection
- `onRetry?: () => void` - Retry callback
- `showDetails?: boolean` - Show expandable error details
- `className?: string` - Additional CSS classes

**Error Types:**
- `network` - Network connectivity issues
- `timeout` - Request timeout
- `server` - Server error
- `validation` - Validation error
- `auth` - Authentication required
- `upgrade` - Upgrade required
- `general` - General error

---

### ErrorCard

Card variant for full-page errors.

```typescript
import { ErrorCard } from '@/components/homepage/ErrorDisplay';

<ErrorCard
  error={error}
  type="network"
  onRetry={handleRetry}
/>
```

**Props:**
- `error: HomepageError | Error | string` - Error object or message
- `type?: ErrorType` - Error type for icon selection
- `onRetry?: () => void` - Retry callback
- `className?: string` - Additional CSS classes

---

### LoadingSpinner

Loading animation with optional progress.

```typescript
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

<LoadingSpinner
  size="md"
  progress={75}
  estimatedTime={30}
  message="Scanning URL..."
/>
```

**Props:**
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Spinner size
- `progress?: number` - Progress percentage (0-100)
- `estimatedTime?: number` - Estimated time remaining (seconds)
- `message?: string` - Loading message
- `className?: string` - Additional CSS classes

---

### InlineLoadingSpinner

Smaller inline variant for buttons.

```typescript
import { InlineLoadingSpinner } from '@/components/shared/LoadingSpinner';

<button disabled={isLoading}>
  {isLoading && <InlineLoadingSpinner />}
  Submit
</button>
```

**Props:**
- `size?: 'sm' | 'md'` - Spinner size
- `className?: string` - Additional CSS classes

---

### FullPageLoadingSpinner

Full-page loading overlay.

```typescript
import { FullPageLoadingSpinner } from '@/components/shared/LoadingSpinner';

<FullPageLoadingSpinner
  message="Loading..."
  progress={50}
  estimatedTime={10}
/>
```

**Props:**
- `message?: string` - Loading message
- `progress?: number` - Progress percentage (0-100)
- `estimatedTime?: number` - Estimated time remaining (seconds)

---

### Skeleton Loaders

Various skeleton loading placeholders.

```typescript
import {
  Skeleton,
  ScanResultsSkeleton,
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  StatCardSkeleton,
  ListSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  GridSkeleton,
  AccordionSkeleton,
  TimelineSkeleton,
} from '@/components/shared/SkeletonLoaders';

// Basic skeleton
<Skeleton className="h-4 w-full" />

// Scan results skeleton
<ScanResultsSkeleton />

// Table skeleton
<TableSkeleton rows={5} columns={4} />

// Grid skeleton
<GridSkeleton items={6} columns={3} />
```

## Hooks

### useAnalyzeVisibility

Trigger visibility analysis for social accounts.

```typescript
import { useAnalyzeVisibility } from '@/hooks/homepage/use-social-protection';

const analyzeVisibility = useAnalyzeVisibility();

const handleAnalyze = async () => {
  try {
    const result = await analyzeVisibility.mutateAsync();
    console.log('Visibility score:', result.score);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
```

**Returns:**
- `mutateAsync: () => Promise<VisibilityAnalysis>` - Trigger analysis
- `isPending: boolean` - Loading state
- `isError: boolean` - Error state
- `error: Error | null` - Error object

---

### useAnalyzeEngagement

Trigger engagement analysis for social accounts.

```typescript
import { useAnalyzeEngagement } from '@/hooks/homepage/use-social-protection';

const analyzeEngagement = useAnalyzeEngagement();

const handleAnalyze = async () => {
  const result = await analyzeEngagement.mutateAsync();
  console.log('Engagement score:', result.score);
};
```

**Returns:**
- `mutateAsync: () => Promise<EngagementAnalysis>` - Trigger analysis
- `isPending: boolean` - Loading state
- `isError: boolean` - Error state
- `error: Error | null` - Error object

---

### useDetectPenalties

Detect penalties on social accounts.

```typescript
import { useDetectPenalties } from '@/hooks/homepage/use-social-protection';

const detectPenalties = useDetectPenalties();

const handleDetect = async () => {
  const result = await detectPenalties.mutateAsync();
  if (result.penalties_found) {
    console.log('Penalties:', result.penalties);
  }
};
```

**Returns:**
- `mutateAsync: () => Promise<PenaltyDetection>` - Trigger detection
- `isPending: boolean` - Loading state
- `isError: boolean` - Error state
- `error: Error | null` - Error object

## Utilities

### mapApiError

Map API errors to user-friendly format.

```typescript
import { mapApiError } from '@/lib/utils/homepage-errors';

try {
  await apiCall();
} catch (error) {
  const mappedError = mapApiError(error);
  console.log(mappedError.userMessage);
  console.log('Retryable:', mappedError.retryable);
  console.log('Requires auth:', mappedError.requiresAuth);
}
```

**Parameters:**
- `error: any` - API error object

**Returns:**
```typescript
interface HomepageError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  requiresAuth: boolean;
  requiresUpgrade: boolean;
  details?: Record<string, any>;
}
```

---

### retryWithBackoff

Retry function with exponential backoff.

```typescript
import { retryWithBackoff } from '@/lib/utils/homepage-errors';

const result = await retryWithBackoff(
  () => apiCall(),
  {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  }
);
```

**Parameters:**
- `fn: () => Promise<T>` - Function to retry
- `config?: RetryConfig` - Retry configuration
  - `maxAttempts?: number` - Maximum retry attempts (default: 3)
  - `delayMs?: number` - Initial delay in milliseconds (default: 1000)
  - `backoffMultiplier?: number` - Backoff multiplier (default: 2)

**Returns:**
- `Promise<T>` - Result of successful function call

---

### Error Detection Utilities

```typescript
import {
  isNetworkError,
  isTimeoutError,
  isRateLimitError,
  requiresAuthentication,
  requiresUpgrade,
  getRetryDelay,
} from '@/lib/utils/homepage-errors';

// Check error types
if (isNetworkError(error)) {
  // Handle network error
}

if (isRateLimitError(error)) {
  const delay = getRetryDelay(error);
  // Wait for delay before retrying
}

if (requiresAuthentication(error)) {
  // Redirect to login
}

if (requiresUpgrade(error)) {
  // Show upgrade CTA
}
```

## Types

### URLCheckResponse

```typescript
interface URLCheckResponse {
  check_id: string;
  url: string;
  risk_score: number; // 0-100
  threat_level: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
  scan_type: ScanType;
  provider_results: ProviderResult[];
  broken_links?: BrokenLink[];
  scan_duration_ms: number;
  checked_at: string;
  metadata?: {
    title?: string;
    description?: string;
    favicon_url?: string;
  };
}
```

### VisibilityAnalysis

```typescript
interface VisibilityAnalysis {
  analysis_id: string;
  score: number; // 0-100
  reach_metrics: {
    impressions: number;
    reach: number;
    visibility_rate: number;
  };
  recommendations: string[];
  analyzed_at: string;
}
```

### EngagementAnalysis

```typescript
interface EngagementAnalysis {
  analysis_id: string;
  score: number; // 0-100
  engagement_metrics: {
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
  };
  recommendations: string[];
  analyzed_at: string;
}
```

### PenaltyDetection

```typescript
interface PenaltyDetection {
  detection_id: string;
  penalties_found: boolean;
  penalties: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    detected_at: string;
  }>;
  recommendations: string[];
  analyzed_at: string;
}
```

### HomepageError

```typescript
interface HomepageError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  requiresAuth: boolean;
  requiresUpgrade: boolean;
  details?: Record<string, any>;
}
```

For complete type definitions, see `src/types/homepage.ts`.
