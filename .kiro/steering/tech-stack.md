# Technology Stack

## Overview

This document provides a comprehensive list of all technologies, frameworks, libraries, and tools used in the LinkShield client application. Each technology is documented with its purpose, version, rationale for selection, and links to official documentation.

## Core Framework & Language

### React 18.2+

- **Purpose**: UI library for building component-based user interfaces
- **Why**: Industry standard with excellent ecosystem, modern hooks API, concurrent features, and strong community support
- **Key Features**: 
  - Functional components with hooks
  - Concurrent rendering for better UX
  - Automatic batching for performance
  - Server components support (future)
- **Documentation**: https://react.dev

### TypeScript 5.0+

- **Purpose**: Type-safe JavaScript superset for building robust applications
- **Why**: Catch errors at compile time, better IDE support with IntelliSense, self-documenting code, improved refactoring
- **Configuration**: Strict mode enabled for maximum type safety
- **Key Features**:
  - Static type checking
  - Interface and type definitions
  - Generics for reusable code
  - Enum and union types
- **Documentation**: https://www.typescriptlang.org

## State Management

### Zustand 4.4+

- **Purpose**: Lightweight global UI state management
- **Why**: Simple API with minimal boilerplate, no context providers needed, excellent TypeScript support, small bundle size (~1KB)
- **Use Cases**: 
  - Authentication state (user, token, isAuthenticated)
  - UI preferences (theme, language, sidebar state)
  - Global notifications and toasts
  - Temporary UI state shared across components
- **Key Features**:
  - No providers or wrappers needed
  - Hooks-based API
  - Middleware support (persist, devtools)
  - Minimal re-renders
- **Documentation**: https://github.com/pmndrs/zustand

### TanStack Query (React Query) 5.0+

- **Purpose**: Powerful server state management and data fetching library
- **Why**: Automatic caching, background updates, optimistic updates, request deduplication, built-in loading/error states
- **Use Cases**: 
  - All API data fetching (GET requests)
  - All API mutations (POST, PUT, DELETE)
  - Paginated and infinite queries
  - Real-time data with polling
- **Key Features**:
  - Automatic caching with configurable stale time
  - Background refetching
  - Optimistic updates
  - Query invalidation
  - Infinite queries for pagination
  - Request cancellation
- **Documentation**: https://tanstack.com/query

**State Management Philosophy**: We use two separate solutions for different concerns:
- **Zustand** for client-side UI state that doesn't come from the server
- **React Query** for server state that comes from API calls

This separation provides clear boundaries and optimal performance for each use case.

## Routing

### Next.js App Router (Next 15)

- **Purpose**: File-system based routing with server and client components in the `app/` directory
- **Why**: First-class support for SSR/SSG/ISR, streaming with Suspense, nested layouts, and built-in middleware and route handlers
- **Key Features**:
  - File-system routing under `app/` (e.g., `app/dashboard/page.tsx`)
  - Nested layouts and route groups for complex UX structures
  - Server Components for data-fetching efficiency, Client Components for interactivity
  - Dynamic routes and optional catch-all segments (`[id]`, `[...slug]`)
  - Route Handlers in `app/api/*` for server-side endpoints when needed
  - Middleware for authentication, redirects, and localization at the edge
  - Streaming and progressive rendering with Suspense
  - Built-in optimizations for images, fonts, and metadata
- **Documentation**: https://nextjs.org/docs/app

## Forms & Validation

### React Hook Form 7.48+

- **Purpose**: Performant form state management with minimal re-renders
- **Why**: Excellent performance, easy integration with validation libraries, minimal boilerplate, great TypeScript support
- **Key Features**:
  - Uncontrolled components for performance
  - Built-in validation
  - Easy error handling
  - Field arrays for dynamic forms
  - Integration with UI libraries
- **Documentation**: https://react-hook-form.com

### Zod 3.22+

- **Purpose**: TypeScript-first schema validation library
- **Why**: Type inference from schemas, composable validators, runtime validation, excellent error messages
- **Integration**: Used with React Hook Form via `@hookform/resolvers/zod` for form validation
- **Key Features**:
  - TypeScript type inference
  - Composable schemas
  - Custom error messages
  - Transform and refine methods
  - Parse and safeParse for validation
- **Documentation**: https://zod.dev

**Example Integration**:
```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const { register, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

## UI Component Library

### shadcn/ui (Radix UI + Tailwind CSS) ⭐ PRIMARY UI LIBRARY

- **Purpose**: Accessible, customizable component primitives built on Radix UI - **This is our primary UI component library**
- **Why**: Copy-paste components (not npm package), full control over code, accessible by default (WCAG AA), excellent TypeScript support, seamless Tailwind CSS integration
- **Architecture**: Components are copied into your project (`src/components/ui/`) rather than installed as dependencies, giving you complete ownership and customization control
- **Installation**: Components are added via CLI: `npx shadcn-ui@latest add button`
- **Key Components**: 
  - **Form Controls**: Button, Input, Select, Checkbox, Radio, Switch, Slider, Textarea
  - **Overlays**: Dialog, Sheet, Popover, Dropdown Menu, Tooltip, Hover Card
  - **Forms**: Form (with React Hook Form integration), Label, Error Message
  - **Data Display**: Table, Tabs, Accordion, Card, Badge, Avatar, Separator
  - **Feedback**: Toast, Alert, Alert Dialog, Progress, Skeleton
  - **Navigation**: Command, Navigation Menu, Breadcrumb
  - **Layout**: Aspect Ratio, Scroll Area, Resizable
- **Accessibility**: Built on Radix UI primitives with ARIA attributes, keyboard navigation, and focus management
- **Styling**: Uses Tailwind CSS utility classes with CSS variables for theming
- **TypeScript**: Fully typed with excellent IntelliSense support
- **Documentation**: https://ui.shadcn.com

**Important**: All UI components in this application should use shadcn/ui components. Do not create custom button, input, dialog, or other UI primitives from scratch - use the shadcn/ui versions instead.

### Tailwind CSS 3.4+

- **Purpose**: Utility-first CSS framework for rapid UI development
- **Why**: Fast development, consistent design system, small production bundle, excellent IDE support, no CSS naming conflicts
- **Configuration**: Custom theme with LinkShield brand colors, spacing, and typography
- **Key Features**:
  - Utility classes for all CSS properties
  - Responsive design with breakpoint prefixes
  - Dark mode support
  - Custom theme configuration
  - JIT (Just-In-Time) compiler
  - PurgeCSS for production optimization
- **Documentation**: https://tailwindcss.com

**Tailwind Configuration Example**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
    },
  },
};
```

## shadcn/ui Usage Guidelines

### Component Installation

shadcn/ui components are installed individually as needed:

```bash
# Install a single component
npx shadcn-ui@latest add button

# Install multiple components
npx shadcn-ui@latest add button input form dialog

# Components are copied to src/components/ui/
```

### Component Usage Example

```typescript
// Import shadcn/ui components from @/components/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Use in your components
export function LoginForm() {
  return (
    <form>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <Button type="submit">Log In</Button>
    </form>
  );
}
```

### Form Integration with React Hook Form

shadcn/ui provides a Form component that integrates seamlessly with React Hook Form:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Customization

Since components are copied into your project, you can customize them directly:

```typescript
// src/components/ui/button.tsx
// Modify variants, sizes, or add new ones
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        // Add your custom variant
        custom: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
      },
    },
  }
);
```

### Available Components

The following shadcn/ui components are commonly used in this application:

- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Form
- **Overlays**: Dialog, Sheet, Popover, Dropdown Menu, Tooltip, Alert Dialog
- **Data Display**: Table, Card, Badge, Avatar, Separator, Tabs, Accordion
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Navigation**: Command, Navigation Menu, Breadcrumb

### Best Practices

1. **Always use shadcn/ui components** instead of creating custom UI primitives
2. **Install components as needed** rather than all at once
3. **Customize in place** by editing the component files in `src/components/ui/`
4. **Follow the composition pattern** by combining shadcn/ui components
5. **Use the Form component** for all forms with React Hook Form integration
6. **Leverage variants** for different component styles rather than custom classes

## HTTP Client

### Axios 1.6+

- **Purpose**: Promise-based HTTP client for making API requests
- **Why**: Request/response interceptors, automatic JSON parsing, request cancellation, better error handling than fetch
- **Configuration**: 
  - Base URL: `https://api.linkshield.site/api/v1`
  - Request interceptor for auth token injection
  - Response interceptor for error handling
  - Timeout configuration
- **Key Features**:
  - Interceptors for request/response transformation
  - Automatic JSON data transformation
  - Request cancellation with AbortController
  - Progress tracking for uploads
  - XSRF protection
- **Documentation**: https://axios-http.com

**Axios Configuration Example**:
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.linkshield.site/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Development Tools

### Next.js 15.x (App Router)

- **Purpose**: React framework with an integrated dev server, build system, routing, and rendering model
- **Why**: End-to-end solution (routing, data fetching, SSR/ISR/SSG, middleware, images/fonts) with excellent DX and production optimizations
- **Key Features**:
  - `next dev` with Fast Refresh and Turbopack-based development
  - `next build` for optimized production bundles and route-level code splitting
  - `next start` for running the production server
  - App Router with server/client components and nested layouts
  - Middleware and Route Handlers
  - Image Optimization and built-in font optimization
  - First-class TypeScript support
- **Documentation**: https://nextjs.org/docs

### ESLint 8.54+

- **Purpose**: Pluggable JavaScript and TypeScript linter
- **Why**: Catch errors and enforce code quality standards, customizable rules, excellent IDE integration
- **Configuration**: 
  - React plugin for React-specific rules
  - TypeScript plugin for type-aware linting
  - Accessibility plugin (eslint-plugin-jsx-a11y)
  - Import plugin for import/export validation
- **Key Rules**:
  - No unused variables
  - Consistent code style
  - React hooks rules
  - Accessibility checks
- **Documentation**: https://eslint.org

### Prettier 3.1+

- **Purpose**: Opinionated code formatter
- **Why**: Consistent code formatting across team, no debates about style, automatic formatting on save
- **Configuration**: 
  - Single quotes
  - 2-space indentation
  - Trailing commas
  - Line width: 100 characters
- **Integration**: Works with ESLint via `eslint-config-prettier`
- **Documentation**: https://prettier.io

## Testing Framework

### Jest 29.7+

- **Purpose**: JavaScript testing framework with built-in test runner, assertion library, and mocking
- **Why**: Next.js native integration, comprehensive testing features, excellent TypeScript support, mature ecosystem
- **Key Features**:
  - Zero configuration with Next.js
  - Built-in mocking capabilities
  - Snapshot testing
  - Code coverage reports
  - Watch mode
  - Parallel test execution
- **Documentation**: https://jestjs.io

### React Testing Library 14.1+

- **Purpose**: Testing library for React components
- **Why**: Tests user behavior not implementation details, encourages accessible components, simple API
- **Key Features**:
  - Query by accessible attributes (role, label, text)
  - User event simulation
  - Async utilities for testing async behavior
  - Custom render with providers
- **Philosophy**: "The more your tests resemble the way your software is used, the more confidence they can give you"
- **Documentation**: https://testing-library.com/react

### Playwright 1.40+

- **Purpose**: End-to-end testing framework
- **Why**: Cross-browser testing (Chromium, Firefox, WebKit), reliable and fast, great debugging tools, auto-wait
- **Key Features**:
  - Cross-browser testing
  - Auto-wait for elements
  - Network interception
  - Screenshots and videos
  - Parallel test execution
  - Trace viewer for debugging
- **Documentation**: https://playwright.dev

**Testing Strategy**:
- **Unit Tests** (Jest): Test individual functions, hooks, and utilities
- **Integration Tests** (Jest + React Testing Library): Test component interactions
- **E2E Tests** (Playwright): Test complete user flows

## Additional Libraries

### date-fns 3.0+

- **Purpose**: Modern JavaScript date utility library
- **Why**: Lightweight, immutable, tree-shakeable, comprehensive date manipulation
- **Use Cases**: Date formatting, parsing, comparison, manipulation
- **Documentation**: https://date-fns.org

### react-hot-toast 2.4+

- **Purpose**: Lightweight toast notification library
- **Why**: Simple API, customizable, accessible, small bundle size (~5KB)
- **Use Cases**: Success messages, error notifications, loading states
- **Documentation**: https://react-hot-toast.com

### lucide-react 0.294+

- **Purpose**: Beautiful and consistent icon library
- **Why**: Tree-shakeable, React components, consistent design, large icon set (1000+)
- **Use Cases**: UI icons throughout the application
- **Documentation**: https://lucide.dev

### recharts 2.10+

- **Purpose**: Composable charting library built on React components
- **Why**: React-native API, responsive, customizable, good documentation
- **Use Cases**: Dashboard charts, analytics visualization, usage statistics
- **Documentation**: https://recharts.org

## Development Dependencies

### TypeScript ESLint

- **Package**: `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- **Purpose**: TypeScript support for ESLint
- **Documentation**: https://typescript-eslint.io

### Vite Plugins

### Next.js Configuration

- `next.config.ts`: Global Next.js configuration (images, redirects, headers, experimental flags)
- `app/` directory: Routing, layouts, and page components structure
- `middleware.ts`: Edge middleware for auth, redirects, and security headers
- TypeScript path mapping via `tsconfig.json` (`compilerOptions.paths`)

### Testing Utilities

- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **jest-environment-jsdom**: JSDOM environment for Jest testing

## Version Management

### Node.js

- **Required Version**: 18.0.0 or higher
- **Recommended**: 20.x LTS
- **Why**: Modern JavaScript features, native ESM support, performance improvements

### Package Manager

- **Recommended**: npm 9+ or yarn 1.22+
- **Lock File**: package-lock.json (npm) or yarn.lock (yarn)
- **Why**: Consistent dependency resolution across environments

## Environment Variables

The application uses environment variables for configuration:

```bash
# API Configuration (client)
NEXT_PUBLIC_API_BASE_URL=https://api.linkshield.site/api/v1

# Feature Flags (client)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SOCIAL_PROTECTION=true

# Environment (client-only when needed)
NEXT_PUBLIC_ENV=development
```

**Notes**:
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to client-side code.
- Server-only secrets must NOT be prefixed and should be accessed via `process.env` in Server Components, Route Handlers, or middleware.

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **No IE11 Support**: Modern JavaScript features and ESM modules

## Bundle Size Targets

- **Initial Bundle**: < 200KB gzipped
- **Route Chunks**: < 50KB gzipped each
- **Vendor Chunk**: < 150KB gzipped

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

---

**Last Updated**: January 2025
