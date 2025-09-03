# Implementation Plan

- [ ] 1. Set up AI analysis data models and database schema
  - Create AIAnalysis table with contentHash, processingStatus, and analysisResult fields
  - Add ai_analyses_used_this_month field to User model
  - Create database migration for new schema changes
  - Write database utility functions for AI analysis operations
  - _Requirements: 4.1, 4.2, 3.1_

- [ ] 2. Implement plan gating utilities and middleware
  - Create aiGating.ts utility functions for plan validation
  - Implement plan-based feature access checking functions
  - Add middleware for validating AI feature access on API routes
  - Write unit tests for plan gating logic
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 3. Create usage tracking and limit enforcement system
  - Implement usageTracking.ts functions for counter management
  - Add usage limit validation before AI analysis processing
  - Create monthly usage counter reset functionality
  - Write tests for usage tracking accuracy and limit enforcement
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Build AI analysis toggle component with plan gating
  - Create AIAnalysisToggle component with conditional rendering based on user plan
  - Add visual indicators for Free users about Pro feature requirements
  - Implement toggle state management and form integration
  - Write component tests for plan-based visibility and behavior
  - _Requirements: 1.1, 2.1, 2.3_

- [ ] 5. Enhance /api/check endpoint with AI analysis support
  - Modify existing /api/check route to handle includeAI parameter
  - Add plan validation and usage limit checking before processing
  - Implement AI analysis request handling and database operations
  - Write API tests for AI analysis request processing and error handling
  - _Requirements: 1.2, 1.3, 2.2, 3.1, 3.2_

- [ ] 6. Implement AI analysis caching and reuse logic
  - Create content hash generation for URL analysis results
  - Add logic to check for existing AI analyses before creating new ones
  - Implement AI analysis linking to multiple checks when reused
  - Write tests for caching behavior and analysis reuse scenarios
  - _Requirements: 4.2, 4.4_

- [ ] 7. Create AI analysis processing service
  - Implement aiAnalysis.ts service for handling AI processing workflow
  - Add AIAnalysis record creation with pending status
  - Implement status updates for completed and failed analyses
  - Write tests for AI processing service and status management
  - _Requirements: 4.1, 4.3_

- [ ] 8. Add AI analysis results display components
  - Create AIAnalysisResults component for showing analysis data
  - Add loading states for pending AI analysis processing
  - Implement error handling for failed AI analyses
  - Write component tests for various AI analysis states and display scenarios
  - _Requirements: 1.1, 1.3_