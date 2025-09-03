# Design Document

## Overview

The AI Features system provides subscription-gated AI analysis capabilities with usage tracking and efficient result caching. The system integrates with the existing URL analysis workflow while enforcing plan-based access controls and managing AI processing resources.

## Architecture

### Feature Gating Architecture
1. UI-level gating based on user plan in session
2. API-level validation before processing requests
3. Database-level usage tracking and limit enforcement
4. Middleware integration for consistent access control

### AI Analysis Flow
1. User requests analysis with AI option enabled
2. System validates user plan and usage limits
3. Content hash checked for existing AI analysis
4. New AI analysis created if needed, otherwise reused
5. Usage counter incremented on successful processing
6. AI analysis linked to user's check record

## Components and Interfaces

### Client Components
- **AIAnalysisToggle**: Checkbox/toggle for enabling AI analysis (plan-gated)
- **AIAnalysisResults**: Component for displaying AI analysis results
- **UpgradePrompt**: Component shown to Free users for AI features

### Server Components
- **AIGatingProvider**: Context provider for AI feature access state
- **PlanGate**: Higher-order component for plan-based feature gating

### API Enhancements
- **Enhanced /api/check**: Modified to handle AI analysis requests
- **AI Usage Middleware**: Validates limits before processing
- **AI Analysis Service**: Handles AI processing and caching logic

### Utilities
- **aiGating.ts**: Plan validation and feature access functions
- **usageTracking.ts**: Usage counter management and limit enforcement
- **aiAnalysis.ts**: AI processing and result caching utilities

## Data Models

### Enhanced User Model
```typescript
interface User {
  id: string
  email: string
  plan: 'free' | 'pro'
  ai_analyses_used_this_month: number
  createdAt: Date
  updatedAt: Date
}
```

### AIAnalysis Model
```typescript
interface AIAnalysis {
  id: string
  contentHash: string
  processingStatus: 'pending' | 'completed' | 'failed'
  analysisResult: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Check-AIAnalysis Relationship
```typescript
interface Check {
  id: string
  userId?: string
  url: string
  aiAnalysisId?: string
  // ... other fields
}
```

## Error Handling

### Plan Gating Errors
- Free user AI request: 402 Payment Required with upgrade message
- Invalid plan data: 403 Forbidden with authentication prompt
- Missing session: 401 Unauthorized with sign-in redirect

### Usage Limit Errors
- Monthly limit exceeded: 429 Too Many Requests with limit details
- Usage tracking failure: Log error but allow request to proceed
- Counter synchronization issues: Background reconciliation process

### AI Processing Errors
- AI service unavailable: Graceful degradation with standard analysis
- Processing timeout: Mark as failed, don't increment usage
- Invalid content: Return validation error, don't increment usage

## Testing Strategy

### Unit Tests
- Plan validation functions
- Usage tracking and limit enforcement
- AI analysis caching logic
- Content hash generation and matching

### Integration Tests
- End-to-end AI analysis flow for Pro users
- Feature gating for Free users
- Usage counter accuracy across requests
- AI analysis reuse and caching behavior

### Performance Tests
- AI analysis response times
- Database query performance for usage tracking
- Caching effectiveness for repeated content
- Concurrent request handling for usage limits