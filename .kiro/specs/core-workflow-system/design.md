# Design Document

## Overview

The Core Workflow system manages the primary user journey from URL submission through analysis to report sharing. It supports both anonymous and authenticated workflows while providing comprehensive report management and public sharing capabilities.

## Architecture

### URL Analysis Flow
1. User submits URL via form (homepage or dashboard)
2. System validates URL format and accessibility
3. Analysis engine processes URL and generates report
4. Report stored with unique slug for access
5. User redirected to report view page

### Report Sharing Flow
1. Report owner accesses their report
2. Share button triggers modal with sharing options
3. System generates public slug and updates report status
4. Public URL provided for sharing
5. Public reports accessible without authentication

### Access Control
- Anonymous users: Can submit URLs and view any accessible reports
- Authenticated users: Can submit URLs (linked to account) and share owned reports
- Report ownership: Determined by userId association during creation

## Components and Interfaces

### Client Components
- **URLSubmissionForm**: Form component for URL input with validation
- **ReportViewer**: Component for displaying analysis results
- **ShareButton**: Button component visible only to report owners
- **ShareModal**: Modal dialog for managing report sharing
- **PublicReportViewer**: Component for viewing publicly shared reports

### Server Components
- **AnalysisEngine**: Core service for processing URL analysis
- **ReportManager**: Service for report CRUD operations and access control
- **SharingService**: Service for managing public report sharing

### API Routes
- **POST /api/check**: Handles URL submission and analysis initiation
- **GET /api/reports/[slug]**: Retrieves report data for viewing
- **POST /api/dashboard/shareable-reports**: Creates public sharing links
- **GET /api/reports/public/[publicSlug]**: Serves publicly shared reports

### Utilities
- **urlValidation.ts**: URL format and accessibility validation
- **slugGeneration.ts**: Unique slug generation for reports
- **reportAccess.ts**: Access control and ownership validation

## Data Models

### Report Model
```typescript
interface Report {
  id: string
  slug: string
  publicSlug?: string
  userId?: string
  url: string
  analysisData: AnalysisResult
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Analysis Result
```typescript
interface AnalysisResult {
  url: string
  title?: string
  description?: string
  performance: PerformanceMetrics
  seo: SEOAnalysis
  accessibility: AccessibilityResults
  // Additional analysis fields
}
```

### Sharing Configuration
```typescript
interface SharingConfig {
  reportId: string
  publicSlug: string
  isActive: boolean
  createdAt: Date
  accessCount: number
}
```

## Error Handling

### URL Validation Errors
- Invalid URL format: Return 400 Bad Request with validation message
- Inaccessible URL: Return 422 Unprocessable Entity with accessibility error
- Malformed requests: Return 400 Bad Request with specific error details

### Report Access Errors
- Non-existent report: Return 404 Not Found with user-friendly message
- Unauthorized access: Return 403 Forbidden for private reports
- Server errors: Return 500 Internal Server Error with generic message

### Sharing Errors
- Non-owner sharing attempt: Return 403 Forbidden
- Already shared report: Return existing public URL
- Sharing service failure: Return 500 with retry suggestion

## Testing Strategy

### Unit Tests
- URL validation functions
- Slug generation uniqueness
- Report access control logic
- Sharing configuration management

### Integration Tests
- Complete URL submission to report viewing flow
- Report sharing end-to-end workflow
- Public report access without authentication
- Report ownership and access control validation

### Performance Tests
- URL analysis processing times
- Report loading performance
- Database query optimization for report retrieval
- Concurrent analysis request handling