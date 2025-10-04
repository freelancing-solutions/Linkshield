# Routing and Navigation

## Overview

The LinkShield client uses Next.js 15 App Router for file-system based routing and navigation. This document explains how to implement routes, protect authenticated pages, handle navigation patterns, and leverage Next.js App Router features.

## Next.js App Router Structure

### File-System Based Routing

Next.js App Router uses the file system to define routes. All routes are defined in the `src/app/` directory:

```
src/app/
├── layout.tsx              # Root layout (applies to all routes)
├── page.tsx               # Home page (/)
├── loading.tsx            # Global loading UI
├── error.tsx              # Global error UI
├── not-found.tsx          # 404 page
├── (auth)/                # Route group (doesn't affect URL)
│   ├── layout.tsx         # Auth layout
│   ├── login/
│   │   └── page.tsx       # /login
│   ├── register/
│   │   └── page.tsx       # /register
│   ├── verify-email/
│   │   └── page.tsx       # /verify-email
│   ├── forgot-password/
│   │   └── page.tsx       # /forgot-password
│   └── reset-password/
│       └── page.tsx       # /reset-password
├── dashboard/             # Dashboard routes
│   ├── layout.tsx         # Dashboard layout
│   ├── page.tsx          # /dashboard
│   ├── url-analysis/
│   │   ├── page.tsx      # /dashboard/url-analysis
│   │   └── [id]/
│   │       └── page.tsx  # /dashboard/url-analysis/[id]
│   ├── reports/
│   │   ├── page.tsx      # /dashboard/reports
│   │   └── [id]/
│   │       └── page.tsx  # /dashboard/reports/[id]
│   ├── api-keys/
│   │   └── page.tsx      # /dashboard/api-keys
│   ├── profile/
│   │   └── page.tsx      # /dashboard/profile
│   ├── sessions/
│   │   └── page.tsx      # /dashboard/sessions
│   └── subscriptions/
│       └── page.tsx      # /dashboard/subscriptions
├── privacy/
│   └── page.tsx          # /privacy
├── terms/
│   └── page.tsx          # /terms
└── api/                  # API routes
    ├── auth/
    │   └── route.ts      # /api/auth
    ├── url-check/
    │   └── route.ts      # /api/url-check
    └── reports/
        └── route.ts      # /api/reports
```

## Route Components

### Page Components

Each route requires a `page.tsx` file that exports a React component:

```typescript
// src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Layout Components

Layouts wrap pages and can be nested. They persist across route changes:

```typescript
// src/app/layout.tsx (Root Layout)
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

```typescript
// src/app/dashboard/layout.tsx (Dashboard Layout)
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Route Groups

Route groups organize routes without affecting the URL structure. Use parentheses:

```typescript
// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
```

## Dynamic Routes

### Dynamic Segments

Use square brackets for dynamic route segments:

```typescript
// src/app/dashboard/reports/[id]/page.tsx
interface ReportPageProps {
  params: { id: string };
}

export default function ReportPage({ params }: ReportPageProps) {
  const { id } = params;
  
  return (
    <div>
      <h1>Report {id}</h1>
      {/* Report content */}
    </div>
  );
}
```

### Catch-all Routes

Use `[...slug]` for catch-all routes:

```typescript
// src/app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: { slug: string[] };
}

export default function DocsPage({ params }: DocsPageProps) {
  const { slug } = params;
  // slug will be an array: ['getting-started', 'installation']
  
  return <div>Docs: {slug.join('/')}</div>;
}
```

## Navigation

### Link Component

Use Next.js `Link` component for client-side navigation:

```typescript
import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/reports">Reports</Link>
      <Link href="/dashboard/profile">Profile</Link>
    </nav>
  );
}
```

### useRouter Hook

For programmatic navigation:

```typescript
'use client';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      router.push('/dashboard');
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {/* Form content */}
    </form>
  );
}
```

### usePathname Hook

Get the current pathname:

```typescript
'use client';
import { usePathname } from 'next/navigation';

export function ActiveLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  );
}
```

## Authentication and Route Protection

### Middleware for Route Protection

Create middleware to protect routes:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/api/protected'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if accessing auth pages with token
  const authRoutes = ['/login', '/register'];
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Server-Side Authentication Check

For server components, check authentication server-side:

```typescript
// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');
  
  if (!token) {
    redirect('/login');
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Client-Side Route Protection

For client components, use a wrapper component:

```typescript
// src/components/auth/RequireAuth.tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
}
```

## API Routes

### Creating API Routes

API routes are created in the `src/app/api/` directory:

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Authenticate user
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Set auth cookie
    const response = NextResponse.json({ user });
    response.cookies.set('auth_token', user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Dynamic API Routes

Use dynamic segments in API routes:

```typescript
// src/app/api/reports/[id]/route.ts
interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  
  try {
    const report = await getReport(id);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: 'Report not found' },
      { status: 404 }
    );
  }
}
```

## Loading and Error States

### Loading UI

Create loading.tsx files for loading states:

```typescript
// src/app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

### Error Boundaries

Create error.tsx files for error handling:

```typescript
// src/app/dashboard/error.tsx
'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

## SEO and Metadata

### Static Metadata

Export metadata from page components:

```typescript
// src/app/dashboard/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - LinkShield',
  description: 'Monitor and analyze your URLs with LinkShield dashboard',
};

export default function DashboardPage() {
  return <div>Dashboard</div>;
}
```

### Dynamic Metadata

Generate metadata dynamically:

```typescript
// src/app/dashboard/reports/[id]/page.tsx
import { Metadata } from 'next';

interface ReportPageProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: ReportPageProps
): Promise<Metadata> {
  const report = await getReport(params.id);
  
  return {
    title: `${report.title} - LinkShield`,
    description: report.description,
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  return <div>Report {params.id}</div>;
}
```

## Best Practices

### 1. Use Server Components by Default

Server components are the default in App Router. Only use 'use client' when needed:

```typescript
// Server component (default)
export default function ServerComponent() {
  return <div>Server rendered</div>;
}

// Client component (when interactivity is needed)
'use client';
export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Leverage Layouts for Shared UI

Use layouts to share UI between routes:

```typescript
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 3. Use Route Groups for Organization

Organize routes without affecting URLs:

```
src/app/
├── (marketing)/
│   ├── page.tsx          # /
│   ├── about/
│   │   └── page.tsx      # /about
│   └── contact/
│       └── page.tsx      # /contact
└── (app)/
    ├── dashboard/
    │   └── page.tsx      # /dashboard
    └── settings/
        └── page.tsx      # /settings
```

### 4. Implement Proper Error Handling

Create error boundaries at appropriate levels:

```typescript
// src/app/dashboard/error.tsx
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-boundary">
      <h2>Dashboard Error</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 5. Use TypeScript for Route Parameters

Define proper types for route parameters:

```typescript
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  return <div>Page {params.id}</div>;
}
```

## Migration from React Router

### Key Differences

1. **File-system routing** instead of route configuration
2. **Server components** by default
3. **Built-in layouts** instead of wrapper components
4. **Middleware** for route protection
5. **API routes** co-located with pages

### Migration Steps

1. Move page components from `src/pages/` to `src/app/*/page.tsx`
2. Convert route configuration to file-system structure
3. Replace React Router hooks with Next.js navigation hooks
4. Move route protection logic to middleware
5. Update import paths and component structure

This routing strategy provides a scalable, type-safe, and performant navigation system that leverages Next.js App Router's full capabilities while maintaining clean separation of concerns and excellent developer experience.