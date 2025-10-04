# Project Structure

This document outlines the structure and organization of the LinkShield client application built with Next.js 15 App Router.

## Root Directory Structure

```
linkshield-client/
├── .next/                    # Next.js build output (auto-generated)
├── .env.local               # Local environment variables
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── .eslintrc.json          # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.js       # PostCSS configuration
├── components.json         # shadcn/ui configuration
├── public/                 # Static assets
├── src/                    # Source code
└── README.md              # Project documentation
```

## Source Directory Structure

```
src/
├── app/                        # Next.js App Router directory
│   ├── (auth)/                # Route group for authentication
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── register/
│   │   │   └── page.tsx       # Registration page
│   │   ├── verify-email/
│   │   │   └── page.tsx       # Email verification page
│   │   ├── forgot-password/
│   │   │   └── page.tsx       # Forgot password page
│   │   ├── reset-password/
│   │   │   └── page.tsx       # Reset password page
│   │   └── layout.tsx         # Auth layout
│   ├── dashboard/             # Dashboard routes
│   │   ├── page.tsx          # Dashboard home
│   │   ├── url-analysis/
│   │   │   ├── page.tsx      # URL analysis page
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Check detail page
│   │   ├── ai-analysis/
│   │   │   └── page.tsx      # AI analysis page
│   │   ├── reports/
│   │   │   ├── page.tsx      # Reports page
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Report detail page
│   │   ├── api-keys/
│   │   │   └── page.tsx      # API keys page
│   │   ├── profile/
│   │   │   └── page.tsx      # Profile page
│   │   ├── sessions/
│   │   │   └── page.tsx      # Sessions page
│   │   ├── subscriptions/
│   │   │   └── page.tsx      # Subscriptions page
│   │   └── layout.tsx        # Dashboard layout
│   ├── privacy/
│   │   └── page.tsx          # Privacy policy page
│   ├── terms/
│   │   └── page.tsx          # Terms of service page
│   ├── api/                   # API routes (server-side)
│   │   ├── auth/
│   │   │   └── route.ts      # Auth API endpoints
│   │   ├── url-check/
│   │   │   └── route.ts      # URL check API endpoints
│   │   ├── ai-analysis/
│   │   │   └── route.ts      # AI analysis API endpoints
│   │   └── reports/
│   │       └── route.ts      # Reports API endpoints
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── loading.tsx           # Global loading UI
│   ├── error.tsx             # Global error UI
│   └── not-found.tsx         # 404 page
│
├── components/                 # Reusable components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── form.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── popover.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── separator.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   │
│   ├── layout/                 # Layout components
│   │   ├── PageLayout.tsx      # Main page wrapper
│   │   ├── Header.tsx          # Top navigation header
│   │   ├── Sidebar.tsx         # Side navigation
│   │   ├── Footer.tsx          # Page footer
│   │   ├── DashboardLayout.tsx # Dashboard-specific layout
│   │   └── AuthLayout.tsx      # Authentication pages layout
│   │
│   ├── auth/                   # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── RequireAuth.tsx     # Protected route wrapper
│   │   └── PasswordStrengthIndicator.tsx
│   │
│   ├── url-analysis/           # URL analysis feature components
│   │   ├── UrlCheckForm.tsx
│   │   ├── UrlHistoryTable.tsx
│   │   ├── UrlHistoryFilters.tsx
│   │   ├── CheckDetailView.tsx
│   │   ├── ProviderResults.tsx
│   │   ├── BrokenLinksTable.tsx
│   │   ├── BulkAnalysisForm.tsx
│   │   ├── ReputationPanel.tsx
│   │   └── StatsCharts.tsx
│   │
│   ├── ai-analysis/            # AI analysis feature components
│   │   ├── AnalysisForm.tsx
│   │   ├── AnalysisResults.tsx
│   │   ├── SimilarContentList.tsx
│   │   ├── AnalysisHistoryTable.tsx
│   │   └── DomainStatsPanel.tsx
│   │
│   ├── reports/                # Community reports components
│   │   ├── ReportForm.tsx
│   │   ├── ReportsTable.tsx
│   │   ├── ReportsFilters.tsx
│   │   ├── ReportDetailView.tsx
│   │   ├── VoteButtons.tsx
│   │   └── ReportTemplateSelector.tsx
│   │
│   ├── dashboard/              # Dashboard components
│   │   ├── DashboardOverview.tsx
│   │   ├── StatCard.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── ProjectsList.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetailView.tsx
│   │   ├── AlertsList.tsx
│   │   ├── AlertCard.tsx
│   │   ├── TeamMembersList.tsx
│   │   └── SocialProtectionPanel.tsx
│   │
│   ├── subscriptions/          # Subscription components
│   │   ├── PlanCard.tsx
│   │   ├── PlanComparison.tsx
│   │   ├── UsagePanel.tsx
│   │   ├── UpgradeDialog.tsx
│   │   └── CancelSubscriptionDialog.tsx
│   │
│   └── shared/                 # Shared utility components
│       ├── LoadingSpinner.tsx
│       ├── LoadingSkeleton.tsx
│       ├── ErrorBoundary.tsx
│       ├── ErrorMessage.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmDialog.tsx
│       ├── ThreatBadge.tsx
│       ├── StatusBadge.tsx
│       ├── DateDisplay.tsx
│       └── CopyToClipboard.tsx
│
├── hooks/                      # Custom React hooks
│   ├── auth/
│   │   ├── useAuth.ts
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   ├── useProfile.ts
│   │   └── useSessions.ts
│   ├── url-check/
│   │   ├── useUrlCheck.ts
│   │   ├── useUrlHistory.ts
│   │   ├── useBulkCheck.ts
│   │   └── useReputation.ts
│   ├── ai-analysis/
│   │   ├── useAiAnalysis.ts
│   │   ├── useAnalysisHistory.ts
│   │   └── useDomainStats.ts
│   ├── reports/
│   │   ├── useReports.ts
│   │   ├── useCreateReport.ts
│   │   ├── useVoteReport.ts
│   │   └── useReportTemplates.ts
│   ├── dashboard/
│   │   ├── useDashboardStats.ts
│   │   ├── useProjects.ts
│   │   └── useAlerts.ts
│   ├── subscriptions/
│   │   ├── useSubscription.ts
│   │   ├── usePlans.ts
│   │   └── useUsage.ts
│   └── utils/
│       ├── useDebounce.ts
│       ├── useLocalStorage.ts
│       ├── useMediaQuery.ts
│       ├── useOnClickOutside.ts
│       └── useCopyToClipboard.ts
│
├── services/                   # API client modules
│   ├── api.ts                  # Axios instance configuration
│   ├── auth.service.ts         # Authentication API calls
│   ├── url-check.service.ts    # URL checking API calls
│   ├── ai-analysis.service.ts  # AI analysis API calls
│   ├── reports.service.ts      # Reports API calls
│   ├── dashboard.service.ts    # Dashboard API calls
│   ├── subscriptions.service.ts # Subscriptions API calls
│   ├── api-keys.service.ts     # API keys management
│   └── social-protection.service.ts # Social protection API calls
│
├── stores/                     # Zustand stores
│   ├── authStore.ts            # Authentication state
│   ├── uiStore.ts              # UI preferences (theme, sidebar)
│   └── notificationStore.ts    # Global notifications
│
├── types/                      # TypeScript types and interfaces
│   ├── user.types.ts
│   ├── url-check.types.ts
│   ├── ai-analysis.types.ts
│   ├── reports.types.ts
│   ├── dashboard.types.ts
│   ├── subscriptions.types.ts
│   ├── api.types.ts            # Common API types
│   └── index.ts                # Re-export all types
│
├── utils/                      # Utility functions
│   ├── formatters.ts           # Date, number, string formatting
│   ├── validators.ts           # Validation functions
│   ├── constants.ts            # Application constants
│   ├── errorMessages.ts        # Error message mapping
│   ├── deviceInfo.ts           # Device information detection
│   └── cn.ts                   # Tailwind class name utility
│
├── config/                     # Configuration files
│   ├── env.ts                  # Environment variables with validation
│   ├── routes.ts               # Route path constants
│   └── queryClient.ts          # React Query configuration
│
├── lib/                        # Third-party library configurations
│   └── utils.ts                # shadcn/ui utilities
│
└── styles/                     # Global styles
    ├── globals.css             # Global CSS and Tailwind directives
    └── themes/                 # Theme variables (if applicable)
        ├── light.css
        └── dark.css
```

## File Naming Conventions

### Components

**Format**: PascalCase with `.tsx` extension

```
✅ Good:
- UserCard.tsx
- UrlHistoryTable.tsx
- DashboardOverview.tsx

❌ Bad:
- userCard.tsx
- url-history-table.tsx
- dashboard_overview.tsx
```

### Hooks

**Format**: camelCase with `use` prefix and `.ts` extension

```
✅ Good:
- useAuth.ts
- useUrlHistory.ts
- useDebounce.ts

❌ Bad:
- Auth.ts
- url-history.ts
- UseDebounce.ts
```

### Services

**Format**: camelCase with `.service.ts` suffix

```
✅ Good:
- auth.service.ts
- url-check.service.ts
- ai-analysis.service.ts

❌ Bad:
- authService.ts
- UrlCheckService.ts
- ai_analysis_service.ts
```

### Types

**Format**: camelCase with `.types.ts` suffix

```
✅ Good:
- user.types.ts
- url-check.types.ts
- api.types.ts

❌ Bad:
- userTypes.ts
- UrlCheckTypes.ts
- api_types.ts
```

### Utilities

**Format**: camelCase with `.ts` extension

```
✅ Good:
- formatters.ts
- validators.ts
- constants.ts

❌ Bad:
- Formatters.ts
- Validators.ts
- CONSTANTS.ts
```

### Stores

**Format**: camelCase with `Store` suffix and `.ts` extension

```
✅ Good:
- authStore.ts
- uiStore.ts
- notificationStore.ts

❌ Bad:
- auth-store.ts
- UIStore.ts
- notification_store.ts
```

## Feature-Based Organization

For large features with many related files, use feature folders:

```
src/features/
├── url-analysis/
│   ├── components/
│   │   ├── UrlHistoryTable.tsx
│   │   ├── CheckDetailView.tsx
│   │   ├── BulkAnalysisForm.tsx
│   │   └── index.ts            # Re-export components
│   ├── hooks/
│   │   ├── useUrlCheck.ts
│   │   ├── useUrlHistory.ts
│   │   └── index.ts
│   ├── types/
│   │   └── url-check.types.ts
│   ├── services/
│   │   └── url-check.service.ts
│   ├── pages/
│   │   ├── UrlAnalysisPage.tsx
│   │   └── CheckDetailPage.tsx
│   └── index.ts                # Re-export public API
│
└── dashboard/
    ├── components/
    ├── hooks/
    ├── types/
    ├── services/
    ├── pages/
    └── index.ts
```

**Benefits**:
- Co-location of related code
- Clear feature boundaries
- Easier to find and modify feature code
- Can be extracted into separate packages if needed
- Reduces cognitive load when working on a feature

**When to Use**:
- Feature has 5+ related components
- Feature has its own data models and API calls
- Feature is relatively independent from other features
- Team wants to work on feature in isolation

**When Not to Use**:
- Small features with 1-2 components
- Highly interconnected features
- Shared components used across many features

## Testing Structure

Tests mirror the source structure:

```
tests/
├── unit/                       # Unit tests
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.test.tsx
│   │   └── shared/
│   │       └── LoadingSpinner.test.tsx
│   ├── hooks/
│   │   └── useDebounce.test.ts
│   └── utils/
│       └── formatters.test.ts
│
├── integration/                # Integration tests
│   ├── auth-flow.test.tsx
│   ├── url-check-flow.test.tsx
│   └── dashboard-flow.test.tsx
│
└── e2e/                        # End-to-end tests (Playwright)
    ├── auth.spec.ts
    ├── url-analysis.spec.ts
    ├── reports.spec.ts
    └── subscriptions.spec.ts
```

**Test File Naming**:
- Unit/Integration: `*.test.tsx` or `*.test.ts`
- E2E: `*.spec.ts`

## Configuration Files

### tsconfig.json

TypeScript configuration with strict mode and path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### next.config.ts

Next.js configuration with path aliases:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@/components': './src/components',
      '@/hooks': './src/hooks',
      '@/services': './src/services',
      '@/types': './src/types',
      '@/utils': './src/utils',
      '@/stores': './src/stores',
    };
    return config;
  },
};

export default nextConfig;
```

### tailwind.config.js

Tailwind CSS configuration with custom theme:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## Import Organization

Organize imports in this order:

```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// 2. Internal absolute imports (using @ alias)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import { urlCheckService } from '@/services/url-check.service';
import { UrlCheck } from '@/types/url-check.types';
import { formatDate } from '@/utils/formatters';

// 3. Relative imports
import { UrlHistoryTable } from './UrlHistoryTable';
import { UrlHistoryFilters } from './UrlHistoryFilters';

// 4. Styles (if any)
import './styles.css';
```

## Index Files

Use `index.ts` files to re-export public APIs:

```typescript
// src/components/url-analysis/index.ts
export { UrlCheckForm } from './UrlCheckForm';
export { UrlHistoryTable } from './UrlHistoryTable';
export { CheckDetailView } from './CheckDetailView';
export { BulkAnalysisForm } from './BulkAnalysisForm';

// Usage in other files
import { UrlCheckForm, UrlHistoryTable } from '@/components/url-analysis';
```

## Environment Files

```
.env.example          # Template with all variables (committed)
.env.local            # Local development overrides (not committed)
.env.development      # Development environment (not committed)
.env.production       # Production environment (not committed)
```

**Example .env.example**:
```bash
# API Configuration (Client-side)
NEXT_PUBLIC_API_BASE_URL=https://api.linkshield.site/api/v1

# Feature Flags (Client-side)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SOCIAL_PROTECTION=true

# Environment (Client-side)
NEXT_PUBLIC_ENV=development

# Server-side only variables
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

## Environment Variables

Environment variables are handled differently in Next.js:

### Client-side Variables (NEXT_PUBLIC_ prefix)

Variables accessible in the browser must have the `NEXT_PUBLIC_` prefix:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.linkshield.site/api/v1
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

Usage in components:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### Server-side Variables

Variables without the prefix are only available on the server:

```bash
# .env.local
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

Usage in API routes or server components:
```typescript
const dbUrl = process.env.DATABASE_URL;
```

## Summary

Following this project structure ensures:

- **Consistency**: Everyone knows where to find and place files
- **Scalability**: Structure supports growth without reorganization
- **Maintainability**: Related code is co-located and easy to find
- **Clarity**: Clear separation between different types of code
- **Flexibility**: Can use flat or feature-based structure as needed

When in doubt, follow these principles:
1. Co-locate related files
2. Use clear, descriptive names
3. Follow established naming conventions
4. Keep the structure flat until complexity demands nesting
5. Prefer feature folders for large, independent features

---

**Last Updated**: January 2025