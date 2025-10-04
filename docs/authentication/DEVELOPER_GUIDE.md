# Authentication Developer Guide

## Getting Started

This guide explains how to work with the authentication system as a developer.

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── dashboard/           # Protected pages
│       ├── profile/
│       └── sessions/
├── components/auth/         # Auth components
├── hooks/auth/              # Auth hooks
├── services/                # API services
├── stores/                  # Zustand stores
├── types/                   # TypeScript types
└── utils/                   # Utilities

```

## Adding a New Authentication Feature

### Step 1: Define Types

```typescript
// src/types/auth.types.ts
export interface NewFeatureData {
  field1: string;
  field2: number;
}
```

### Step 2: Create API Service

```typescript
// src/services/auth.service.ts
export const authService = {
  newFeature: async (data: NewFeatureData) => {
    return apiClient.post('/user/new-feature', data);
  },
};
```

### Step 3: Create Hook

```typescript
// src/hooks/auth/use-new-feature.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export function useNewFeature() {
  return useMutation({
    mutationFn: (data: NewFeatureData) => authService.newFeature(data),
    onSuccess: () => {
      toast.success('Feature completed!');
    },
    onError: () => {
      toast.error('Feature failed');
    },
  });
}
```

### Step 4: Create Component

```typescript
// src/components/auth/NewFeatureForm.tsx
export function NewFeatureForm() {
  const newFeature = useNewFeature();
  
  const handleSubmit = (data) => {
    newFeature.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Step 5: Create Page

```typescript
// src/app/dashboard/new-feature/page.tsx
import { NewFeatureForm } from '@/components/auth/NewFeatureForm';

export default function NewFeaturePage() {
  return <NewFeatureForm />;
}
```

## State Management

### Zustand Store

The auth store manages authentication state:

```typescript
// src/stores/authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}
```

**Usage:**

```typescript
import { useAuthStore } from '@/stores/authStore';

const { user, isAuthenticated } = useAuthStore();
```

### React Query

React Query manages server state:

```typescript
// Query (GET)
const { data, isLoading } = useQuery({
  queryKey: ['profile'],
  queryFn: () => authService.getProfile(),
});

// Mutation (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: (data) => authService.updateProfile(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
});
```

## Form Validation

### Zod Schemas

All forms use Zod for validation:

```typescript
// src/lib/validations/auth.ts
export const myFormSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Too short'),
});
```

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(myFormSchema),
});
```

## Error Handling

### Adding New Error Messages

```typescript
// src/utils/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  NEW_ERROR_CODE: 'User-friendly message here',
};
```

### Using Error Messages

```typescript
import { getErrorMessage } from '@/utils/error-messages';

const message = getErrorMessage(errorCode);
toast.error(message);
```

## Testing

### Unit Tests

```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// auth-flow.test.tsx
describe('Authentication Flow', () => {
  it('should complete registration', async () => {
    // Test implementation
  });
});
```

## API Integration

### Request Flow

```
Component → Hook → Service → API Client → Backend
                                    ↓
                              Interceptors
                                    ↓
                            Response/Error
```

### Adding New Endpoint

```typescript
// 1. Add to service
export const authService = {
  newEndpoint: async (data) => {
    return apiClient.post('/user/new-endpoint', data);
  },
};

// 2. Create hook
export function useNewEndpoint() {
  return useMutation({
    mutationFn: authService.newEndpoint,
  });
}

// 3. Use in component
const newEndpoint = useNewEndpoint();
newEndpoint.mutate(data);
```

## Routing

### Adding Protected Route

```typescript
// src/app/dashboard/new-page/page.tsx
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function NewPage() {
  return (
    <RequireAuth>
      <div>Protected content</div>
    </RequireAuth>
  );
}
```

### Adding Public Route

```typescript
// src/app/(auth)/new-auth-page/page.tsx
export default function NewAuthPage() {
  return <div>Public auth page</div>;
}
```

## Styling

### Tailwind CSS

All components use Tailwind CSS:

```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold">Title</h2>
</div>
```

### shadcn/ui Components

Use shadcn/ui for UI components:

```bash
npx shadcn@latest add button
```

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>
```

## Best Practices

### 1. Type Everything

```typescript
// ✅ Good
interface Props {
  user: User;
  onEdit: (user: User) => void;
}

// ❌ Bad
interface Props {
  user: any;
  onEdit: any;
}
```

### 2. Use Hooks for Logic

```typescript
// ✅ Good
const login = useLogin();
login.mutate(data);

// ❌ Bad
authService.login(data); // Don't call directly
```

### 3. Handle Loading States

```typescript
// ✅ Good
{isLoading ? <Spinner /> : <Content />}

// ❌ Bad
<Content /> // No loading state
```

### 4. Show Error Messages

```typescript
// ✅ Good
onError: (error) => {
  toast.error(getErrorMessage(error));
}

// ❌ Bad
onError: (error) => {
  console.log(error); // Silent failure
}
```

### 5. Validate Forms

```typescript
// ✅ Good
const schema = z.object({
  email: z.string().email(),
});

// ❌ Bad
// No validation
```

## Debugging

### React Query Devtools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>
```

### Zustand Devtools

```typescript
import { devtools } from 'zustand/middleware';

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    // Store implementation
  }))
);
```

### Console Logging

```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## Common Patterns

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateProfile,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['profile'] });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['profile']);
    
    // Optimistically update
    queryClient.setQueryData(['profile'], newData);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['profile'], context.previous);
  },
});
```

### Conditional Queries

```typescript
const { data } = useQuery({
  queryKey: ['profile'],
  queryFn: getProfile,
  enabled: isAuthenticated, // Only run if authenticated
});
```

### Query Invalidation

```typescript
// Invalidate after mutation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['profile'] });
}
```

## Performance Tips

1. **Use React.memo** for expensive components
2. **Implement code splitting** with dynamic imports
3. **Configure stale times** appropriately
4. **Use optimistic updates** for better UX
5. **Debounce search inputs**

## Security Considerations

1. **Never store tokens in localStorage** - Use memory only
2. **Always validate on backend** - Client validation is UX only
3. **Handle 401 errors** - Automatic logout
4. **Use HTTPS** - Always in production
5. **Sanitize user input** - Prevent XSS

## Deployment

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.linkshield.site/api/v1
NEXT_PUBLIC_ENV=production
```

### Build

```bash
npm run build
npm run start
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

**Last Updated:** January 2025
