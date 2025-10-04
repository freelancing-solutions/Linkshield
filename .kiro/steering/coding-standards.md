# LinkShield Coding Standards

## TypeScript Standards

### Strict Mode Required
Always use TypeScript strict mode. All code must be fully typed.

```typescript
// ✅ Good - Explicit types
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, className }) => {
  // ...
};

// ❌ Bad - No types
export const UserCard = ({ user, onEdit, className }) => {
  // ...
};
```

### Type Definitions
- Define interfaces for all props, API responses, and data models
- Use `type` for unions, intersections, and utility types
- Use `interface` for object shapes and component props
- Export types that are used across multiple files

### Avoid `any`
Never use `any` type. Use `unknown` if type is truly unknown, then narrow with type guards.

```typescript
// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  throw new Error('Invalid data type');
}

// ❌ Bad
function processData(data: any) {
  return data.toUpperCase();
}
```

## React Standards

### Component Structure
Follow this order in components:

1. Imports
2. Type definitions
3. Component function
4. Hooks (useState, useEffect, custom hooks)
5. Event handlers
6. Render logic
7. Return JSX

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  initialCount: number;
}

export const Counter: React.FC<Props> = ({ initialCount }) => {
  // Hooks
  const [count, setCount] = useState(initialCount);
  
  // Event handlers
  const handleIncrement = () => setCount(c => c + 1);
  const handleDecrement = () => setCount(c => c - 1);
  
  // Render
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={handleIncrement}>+</Button>
      <Button onClick={handleDecrement}>-</Button>
    </div>
  );
};
```

### Hooks Rules
- Only call hooks at the top level
- Don't call hooks inside loops, conditions, or nested functions
- Custom hooks must start with `use`
- Extract complex logic into custom hooks

### Props Destructuring
Always destructure props in the function signature:

```typescript
// ✅ Good
export const UserCard: React.FC<Props> = ({ user, onEdit }) => {
  return <div>{user.name}</div>;
};

// ❌ Bad
export const UserCard: React.FC<Props> = (props) => {
  return <div>{props.user.name}</div>;
};
```

## Naming Conventions

### Files
- Components: PascalCase (e.g., `UserCard.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useUrlHistory.ts`)
- Services: camelCase with `.service.ts` suffix (e.g., `url-check.service.ts`)
- Types: camelCase with `.types.ts` suffix (e.g., `user.types.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)

### Variables and Functions
- Variables: camelCase (e.g., `userName`, `isLoading`)
- Functions: camelCase (e.g., `handleSubmit`, `fetchUserData`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- Components: PascalCase (e.g., `UserCard`, `DashboardPage`)

### Boolean Variables
Prefix with `is`, `has`, `should`, or `can`:

```typescript
const isLoading = true;
const hasError = false;
const shouldRender = true;
const canEdit = false;
```

## API Integration Standards

### Service Layer Pattern
All API calls must go through service modules:

```typescript
// src/services/url-check.service.ts
export const urlCheckService = {
  check: (url: string) => 
    apiClient.post<UrlCheckResponse>('/url-check/check', { url }),
    
  getHistory: (filters: UrlHistoryFilters) => 
    apiClient.get<UrlCheck[]>('/url-check/history', { params: filters }),
};
```

### React Query Hooks
Wrap service calls in React Query hooks:

```typescript
// src/hooks/useUrlCheck.ts
export const useUrlCheck = () => {
  return useMutation({
    mutationFn: (url: string) => urlCheckService.check(url),
    onSuccess: (data) => {
      toast.success('URL checked successfully');
    },
    onError: (error) => {
      toast.error('Failed to check URL');
    },
  });
};
```

### Error Handling
- Handle errors in React Query hooks
- Show user-friendly error messages
- Log errors for debugging
- Don't expose technical details to users

## Form Standards

### React Hook Form + Zod
All forms must use React Hook Form with Zod validation:

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

### Form Validation
- Client-side validation is for UX only
- Always validate on the backend
- Show clear error messages
- Disable submit button while submitting

## Styling Standards

### Tailwind CSS
Use Tailwind utility classes for all styling:

```typescript
// ✅ Good
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold">Title</h2>
</div>

// ❌ Bad - Don't use inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <h2 style={{ fontSize: '20px' }}>Title</h2>
</div>
```

### Responsive Design
Use Tailwind breakpoints for responsive design:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Dark Mode
Support dark mode with Tailwind's dark mode classes:

```typescript
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

## Testing Standards

### Unit Tests
- Test individual functions and hooks
- Use Jest and React Testing Library
- Test user behavior, not implementation details
- Aim for 80%+ code coverage

### Integration Tests
- Test component interactions
- Mock API calls
- Test complete user flows

### E2E Tests
- Use Playwright for critical user flows
- Test authentication, URL checking, subscription management
- Run in CI/CD pipeline

## Code Quality

### ESLint and Prettier
- Run ESLint before committing
- Use Prettier for consistent formatting
- Fix all linting errors
- No warnings in production builds

### Code Reviews
- All code must be reviewed before merging
- Check for type safety, performance, accessibility
- Ensure tests are included
- Verify documentation is updated

### Comments
- Write self-documenting code
- Add comments for complex logic
- Document why, not what
- Keep comments up to date

## Git Standards

### Commit Messages
Follow conventional commits format:

```
feat: add URL bulk analysis feature
fix: resolve authentication token expiration issue
docs: update API integration guide
refactor: extract form validation logic into hook
test: add tests for URL history component
```

### Branch Naming
- Feature: `feature/url-bulk-analysis`
- Bug fix: `fix/auth-token-expiration`
- Refactor: `refactor/form-validation`

### Pull Requests
- Clear title and description
- Link to related issues
- Include screenshots for UI changes
- Ensure CI/CD passes

---

**Remember**: These standards ensure code quality, maintainability, and consistency across the LinkShield client application.
