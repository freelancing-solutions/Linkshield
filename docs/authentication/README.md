# Authentication System Documentation

## Overview

The LinkShield authentication system provides a complete user authentication and account management solution built with Next.js 15, React Query, and Zustand.

## Features

- ✅ User registration with email verification
- ✅ Login with JWT token authentication
- ✅ Password reset flow
- ✅ Profile management
- ✅ Session management with device tracking
- ✅ Password strength validation
- ✅ Protected routes
- ✅ Automatic token refresh handling
- ✅ Toast notifications for user feedback

## Architecture

### State Management

The authentication system uses a dual state management approach:

**Zustand** - For UI state:
- User data
- Authentication token
- Authentication status
- Loading states

**React Query** - For server state:
- API data fetching
- Mutations (login, register, etc.)
- Automatic caching
- Background refetching

### Authentication Flow

```
Registration → Email Verification → Login → Dashboard
                                      ↓
                              Protected Routes
```

## Components

### Core Components

#### `RegisterForm`
User registration form with validation.

**Props:** None

**Features:**
- Email, password, full name, company fields
- Password strength indicator
- Terms acceptance checkbox
- Marketing consent option
- Real-time validation

**Usage:**
```tsx
import { RegisterForm } from '@/components/auth';

<RegisterForm />
```

#### `LoginForm`
User login form.

**Props:** None

**Features:**
- Email and password fields
- Remember me checkbox
- Password visibility toggle
- Forgot password link

**Usage:**
```tsx
import { LoginForm } from '@/components/auth';

<LoginForm />
```

#### `PasswordStrengthIndicator`
Visual password strength indicator.

**Props:**
- `password: string` - Password to evaluate
- `showCriteria?: boolean` - Show criteria checklist (default: true)

**Usage:**
```tsx
import { PasswordStrengthIndicator } from '@/components/auth';

<PasswordStrengthIndicator 
  password={password} 
  showCriteria={true} 
/>
```

#### `RequireAuth`
Route protection wrapper component.

**Props:**
- `children: React.ReactNode` - Protected content

**Usage:**
```tsx
import { RequireAuth } from '@/components/auth';

<RequireAuth>
  <ProtectedPage />
</RequireAuth>
```

#### `AuthProvider`
Authentication context provider.

**Props:**
- `children: React.ReactNode`

**Usage:**
```tsx
import { AuthProvider } from '@/components/auth';

<AuthProvider>
  <App />
</AuthProvider>
```

## Hooks

### Authentication Hooks

#### `useLogin()`
Login mutation hook.

**Returns:**
- `mutate: (data: LoginFormData) => void`
- `isPending: boolean`
- `isError: boolean`
- `error: Error | null`

**Usage:**
```tsx
import { useLogin } from '@/hooks/auth';

const login = useLogin();

const handleLogin = (data) => {
  login.mutate(data);
};
```

#### `useRegister()`
Registration mutation hook.

**Returns:**
- `mutate: (data: RegisterFormData) => void`
- `isPending: boolean`
- `isError: boolean`

**Usage:**
```tsx
import { useRegister } from '@/hooks/auth';

const register = useRegister();

const handleRegister = (data) => {
  register.mutate(data);
};
```

#### `useLogout()`
Logout mutation hook.

**Returns:**
- `mutate: () => void`
- `isPending: boolean`

**Usage:**
```tsx
import { useLogout } from '@/hooks/auth';

const logout = useLogout();

const handleLogout = () => {
  logout.mutate();
};
```

#### `useProfile()`
Profile query hook.

**Returns:**
- `data: User | undefined`
- `isLoading: boolean`
- `isError: boolean`
- `error: Error | null`

**Usage:**
```tsx
import { useProfile } from '@/hooks/auth';

const { data: user, isLoading } = useProfile();
```

### Session Management Hooks

#### `useSessions()`
Fetch active sessions.

**Returns:**
- `data: Session[] | undefined`
- `isLoading: boolean`

**Usage:**
```tsx
import { useSessions } from '@/hooks/auth';

const { data: sessions, isLoading } = useSessions();
```

#### `useRevokeSession()`
Revoke a specific session.

**Returns:**
- `mutate: (sessionId: string) => void`
- `isPending: boolean`

**Usage:**
```tsx
import { useRevokeSession } from '@/hooks/auth';

const revokeSession = useRevokeSession();

const handleRevoke = (sessionId) => {
  revokeSession.mutate(sessionId);
};
```

## API Integration

### Base Configuration

All API requests go through the configured Axios instance:

```typescript
// src/services/api.ts
export const apiClient = axios.create({
  baseURL: 'https://api.linkshield.site/api/v1',
  timeout: 30000,
});
```

### Request Interceptor

Automatically adds JWT token to requests:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles 401 errors and automatic logout:

```typescript
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Routes

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification
- `/resend-verification` - Resend verification email
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token

### Protected Routes

- `/dashboard` - Dashboard home
- `/dashboard/profile` - Profile management
- `/dashboard/sessions` - Session management

## Validation

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Email Validation

- Valid email format
- RFC 5322 compliant

## Error Handling

### Error Messages

User-friendly error messages are mapped from backend error codes:

```typescript
import { getErrorMessage } from '@/utils/error-messages';

const message = getErrorMessage('EMAIL_ALREADY_EXISTS');
// "This email is already registered..."
```

### Toast Notifications

Success and error messages are displayed via toast notifications:

```typescript
import { toast } from 'react-hot-toast';

toast.success('Login successful!');
toast.error('Invalid credentials');
```

## Security

### Token Storage

JWT tokens are stored in memory (Zustand store) for security:

```typescript
// Tokens are NOT stored in localStorage
// They are cleared when the browser tab closes
```

### Protected Routes

Routes are protected using the `RequireAuth` component:

```typescript
<RequireAuth>
  <ProtectedPage />
</RequireAuth>
```

### Session Management

Users can view and revoke active sessions:

- View all active sessions
- See device information
- Revoke individual sessions
- Terminate all other sessions

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

## Troubleshooting

### Common Issues

**Issue: Token expired**
- Solution: User will be automatically logged out and redirected to login

**Issue: Email not verified**
- Solution: Resend verification email from login page

**Issue: Password too weak**
- Solution: Follow password requirements shown in strength indicator

**Issue: Rate limit exceeded**
- Solution: Wait a few minutes before trying again

## Best Practices

1. **Always use hooks** - Don't call API services directly
2. **Handle loading states** - Show loading indicators during async operations
3. **Display error messages** - Use toast notifications for user feedback
4. **Validate on client** - Use Zod schemas for form validation
5. **Protect routes** - Wrap protected pages with RequireAuth
6. **Clear auth on logout** - Always clear tokens and user data

## Support

For issues or questions:
- Check the troubleshooting guide above
- Review the component documentation
- Check the API integration guide

---

**Last Updated:** January 2025
