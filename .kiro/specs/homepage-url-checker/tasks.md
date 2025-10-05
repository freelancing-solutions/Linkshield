# Implementation Plan

## 1. Project Setup

- [x] 1.1 Create homepage module structure
  - Create homepage components in `src/components/homepage/` directory
  - Create homepage hooks in `src/hooks/homepage/` directory
  - Create homepage services in `src/services/` directory
  - Create homepage types in `src/types/` directory
  - Create homepage utilities in `src/lib/utils/` directory
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.2 Create TypeScript interfaces
  - Create `src/types/homepage.ts`
  - Define URLCheckRequest, URLCheckResponse, ScanType interfaces
  - Define DomainReputation, ExtensionStatus, AlgorithmHealth interfaces
  - Define SubscriptionInfo interface
  - Export all types
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

## 2. API Integration

- [x] 2.1 Create URL check API methods
  - Create `src/services/url-check.service.ts`
  - Implement checkURL(url, scanType): Promise<URLCheckResponse>
  - Implement getDomainReputation(domain): Promise<DomainReputation>
  - Handle anonymous vs authenticated requests
  - _Requirements: 1.1, 1.4_

- [x] 2.2 Create Social Protection API methods
  - Create `src/services/social-protection.service.ts`
  - Implement getExtensionStatus(): Promise<ExtensionStatus>
  - Implement getExtensionAnalytics(timeRange): Promise<ExtensionAnalytics>
  - Implement getAlgorithmHealth(): Promise<AlgorithmHealth>
  - Implement analyzeVisibility(): Promise<VisibilityAnalysis>
  - Implement analyzeEngagement(): Promise<EngagementAnalysis>
  - Implement detectPenalties(): Promise<PenaltyDetection>
  - _Requirements: 1.5, 1.6, 1.7_

- [x] 2.3 Create subscriptions API methods
  - Create `src/services/subscriptions.service.ts`
  - Implement getSubscriptions(): Promise<Subscription[]>
  - Implement getSubscriptionUsage(id): Promise<UsageStats>
  - _Requirements: 1.8_

## 3. React Query Hooks

- [x] 3.1 Create URL check hooks
  - Create `src/hooks/homepage/use-url-check.ts`
  - Implement useCheckURL() mutation hook
  - Implement useDomainReputation(domain) query hook with enabled condition
  - _Requirements: 1.1, 1.4_

- [x] 3.2 Create Social Protection hooks
  - Create `src/hooks/homepage/use-social-protection.ts`
  - Implement useExtensionStatus() query hook
  - Implement useExtensionAnalytics(timeRange) query hook
  - Implement useAlgorithmHealth() query hook
  - Implement useAnalyzeVisibility() mutation hook
  - Implement useAnalyzeEngagement() mutation hook
  - Implement useDetectPenalties() mutation hook
  - _Requirements: 1.5, 1.6, 1.7_

- [x] 3.3 Create subscription hooks
  - Create `src/hooks/homepage/use-subscription.ts`
  - Implement useSubscriptions() query hook
  - Implement useSubscriptionUsage(id) query hook with enabled condition
  - _Requirements: 1.8_

## 4. Homepage Components

- [x] 4.1 Create HomePage component
  - Create `src/app/page.tsx`
  - Implement main homepage layout with hero section
  - Integrate URLCheckerForm component
  - Add conditional rendering for authenticated vs anonymous users
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 4.2 Create HeroSection component
  - Create `src/components/homepage/HeroSection.tsx`
  - Display main headline and value proposition
  - Include call-to-action buttons
  - Show trust indicators (user count, scan count)
  - Implement responsive design
  - _Requirements: 1.1_

## 5. URL Checker Components

- [x] 5.1 Create URLCheckerForm component
  - Create `src/components/homepage/URLCheckerForm.tsx`
  - Implement URL input with validation
  - Add ScanTypeSelector component
  - Integrate useCheckURL hook
  - Display loading state during scan
  - Show rate limit notice for anonymous users
  - _Requirements: 1.1, 1.2_

- [x] 5.2 Create validation utilities
  - Create `src/lib/validations/homepage.ts`
  - Implement URL validation with Zod schema
  - Add domain extraction utility
  - Add URL normalization utility
  - _Requirements: 1.1_

- [x] 5.3 Create ScanTypeSelector component
  - Create `src/components/homepage/ScanTypeSelector.tsx`
  - Display radio buttons for Quick, Comprehensive, and Deep scan types
  - Show scan type descriptions and timing
  - Disable Deep scan for anonymous users
  - Show upgrade prompt for premium features
  - _Requirements: 1.2_

## 6. Results Display Components

- [x] 6.1 Create ScanResults component
  - Create `src/components/homepage/ScanResults.tsx`
  - Display overall risk score with RiskScoreGauge
  - Show threat level with ThreatLevelBadge
  - Render provider results with ProviderResultsAccordion
  - Include broken links tab if applicable
  - Add ResultActions component
  - _Requirements: 1.3_

- [x] 6.2 Create RiskScoreGauge component
  - Create `src/components/homepage/RiskScoreGauge.tsx`
  - Display circular progress gauge (0-100)
  - Use color coding: green (0-30), yellow (31-70), red (71-100)
  - Show animated score counting
  - _Requirements: 1.3_

- [x] 6.3 Create ThreatLevelBadge component
  - Create `src/components/homepage/ThreatLevelBadge.tsx`
  - Display threat level (Safe, Suspicious, Dangerous)
  - Use appropriate colors and icons
  - Show tooltip with explanation
  - _Requirements: 1.3_

- [x] 6.4 Create ProviderResultsAccordion component
  - Create `src/components/homepage/ProviderResultsAccordion.tsx`
  - Display collapsible sections for each security provider
  - Show provider name, status, and details
  - Include provider logos and confidence scores
  - _Requirements: 1.3_

- [x] 6.5 Create BrokenLinksTab component
  - Create `src/components/homepage/BrokenLinksTab.tsx`
  - Display list of broken links found during scan
  - Show link URL, status code, and error message
  - Include fix suggestions
  - _Requirements: 1.3_

- [x] 6.6 Create ResultActions component
  - Create `src/components/homepage/ResultActions.tsx`
  - Add "View in History" button (authenticated users only)
  - Add "Download Report" button (premium users only)
  - Add "Share Results" button with copy link functionality
  - _Requirements: 1.3_

## 7. Domain Reputation Components

- [x] 7.1 Create DomainReputationBadge component
  - Create `src/components/homepage/DomainReputationBadge.tsx`
  - Display domain reputation score and status
  - Show historical data if available
  - Include tooltip with reputation factors
  - Use useDomainReputation hook
  - _Requirements: 1.4_

## 8. Social Protection Components

- [x] 8.1 Create SocialProtectionPanel component
  - Create `src/components/homepage/SocialProtectionPanel.tsx`
  - Display extension status with ExtensionStatusCard
  - Show algorithm health summary
  - Include social account scan options
  - Only visible to authenticated users
  - _Requirements: 1.5, 1.6, 1.7_

- [x] 8.2 Create ExtensionStatusCard component
  - Create `src/components/homepage/ExtensionStatusCard.tsx`
  - Show extension installation status
  - Display protection statistics (blocked content, warnings)
  - Include download/update buttons
  - Show last sync timestamp
  - _Requirements: 1.5_

- [x] 8.3 Create AlgorithmHealthSummary component
  - Create `src/components/homepage/AlgorithmHealthSummary.tsx`
  - Display overall algorithm health score
  - Show individual metric scores (visibility, engagement, penalties)
  - Include trend indicators (up/down arrows)
  - Add "View Details" link to full report
  - Use useAlgorithmHealth hook
  - _Requirements: 1.6_

## 9. Social Account Analysis Components

- [x] 9.1 Create SocialAccountScan component
  - Create `src/components/homepage/SocialAccountScan.tsx`
  - Provide input for social media profile URLs
  - Include platform selection (Twitter, Instagram, Facebook, LinkedIn)
  - Integrate visibility and engagement analysis hooks
  - Display scan progress and results
  - _Requirements: 1.7_

## 10. Subscription Components

- [x] 10.1 Create SubscriptionPlanCard component
  - Create `src/components/homepage/SubscriptionPlanCard.tsx`
  - Display current subscription plan and usage
  - Show usage statistics and limits
  - Include upgrade/downgrade buttons
  - Display billing information
  - Use useSubscriptions and useSubscriptionUsage hooks
  - _Requirements: 1.8_

## 11. Action Components

- [x] 11.1 Create QuickActionsPanel component
  - Create `src/components/homepage/QuickActionsPanel.tsx`
  - Display quick action buttons for authenticated users
  - Include: "Scan History", "API Keys", "Settings", "Reports"
  - Show recent activity summary
  - _Requirements: 1.1, 1.2, 1.3_

## 12. Utility Components

- [x] 12.1 Create ViewInHistoryButton component
  - Create `src/components/homepage/ViewInHistoryButton.tsx`
  - Navigate to scan history with pre-filtered results
  - Only visible to authenticated users
  - Include scan timestamp and URL
  - _Requirements: 1.3_

- [x] 12.2 Create SignUpCTA component
  - Create `src/components/homepage/SignUpCTA.tsx`
  - Display call-to-action for anonymous users
  - Highlight premium features and benefits
  - Include sign-up and login buttons
  - _Requirements: 1.1, 1.2_

- [x] 12.3 Create RateLimitNotice component
  - Create `src/components/homepage/RateLimitNotice.tsx`
  - Display rate limit information for anonymous users
  - Show remaining scans and reset time
  - Include upgrade prompt
  - _Requirements: 1.1, 1.2_

## 13. Error Handling and Loading States

- [x] 13.1 Create error handling utilities
  - Create `src/lib/utils/homepage-errors.ts`
  - Map API error codes to user-friendly messages
  - Handle network errors and timeouts
  - Include retry logic for transient failures
  - _Requirements: All homepage requirements_

- [x] 13.2 Create ErrorDisplay component
  - Create `src/components/homepage/ErrorDisplay.tsx`
  - Display error messages with appropriate styling
  - Include retry buttons where applicable
  - Show different error states (network, validation, server)
  - _Requirements: All homepage requirements_

- [x] 13.3 Create LoadingSpinner component
  - Create `src/components/shared/LoadingSpinner.tsx`
  - Display loading animation during API calls
  - Include progress indicators for long-running scans
  - Show estimated completion time
  - Support different sizes (sm, md, lg)
  - _Requirements: All homepage requirements_

- [x] 13.4 Create SkeletonLoaders
  - Create skeleton loaders for: results, cards, charts
  - Match actual component layouts
  - Use shimmer animation
  - _Requirements: All homepage requirements_

## 14. Responsive Design

- [x] 14.1 Implement mobile layout
  - Stack components vertically on mobile
  - Adjust font sizes and spacing
  - Make buttons touch-friendly (min 44x44px)
  - Test on various screen sizes
  - _Requirements: All homepage requirements_

- [x] 14.2 Implement tablet layout
  - Use 2-column layout for cards
  - Adjust sidebar placement
  - Optimize for landscape and portrait
  - _Requirements: All homepage requirements_

- [x] 14.3 Implement desktop layout
  - Use 3-column layout with sidebars
  - Maximize use of screen space
  - Implement hover states
  - _Requirements: All homepage requirements_

## 15. Testing

- [x] 15.1 Write unit tests for validation
  - Test URL validation logic
  - Test scan type gating logic
  - Test error message mapping
  - _Requirements: 1.1, 1.2_

- [x] 15.2 Write component tests
  - Test URLCheckerForm submission
  - Test ScanResults rendering
  - Test ExtensionStatusCard states
  - Test AlgorithmHealthSummary actions
  - Test SubscriptionPlanCard display
  - _Requirements: All homepage requirements_

- [x] 15.3 Write integration tests
  - Test complete URL check flow
  - Test anonymous vs authenticated experience
  - Test Social Protection integration
  - Test plan-based feature gating
  - _Requirements: All homepage requirements_

- [x] 15.4 Write E2E tests
  - Test homepage load and URL check
  - Test scan type selection
  - Test results display
  - Test Social Protection features
  - Test quick actions navigation
  - _Requirements: All homepage requirements_

## 16. Accessibility

- [x] 16.1 Implement keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Implement logical tab order
  - Add keyboard shortcuts (e.g., Enter to submit)
  - Test with keyboard only
  - _Requirements: All homepage requirements_

- [x] 16.2 Add ARIA labels
  - Add proper labels to form inputs
  - Add ARIA labels to buttons and links
  - Implement ARIA live regions for dynamic updates
  - Add screen reader descriptions
  - _Requirements: All homepage requirements_

- [x] 16.3 Ensure color accessibility
  - Use WCAG AA compliant color contrast
  - Don't rely solely on color for threat levels
  - Add icons in addition to color coding
  - Test with color blindness simulators
  - _Requirements: All homepage requirements_

## 17. Performance Optimization

- [x] 17.1 Optimize initial load
  - Lazy load Social Protection components
  - Defer non-critical scripts
  - Optimize images and icons
  - Implement code splitting
  - _Requirements: All homepage requirements_

- [x] 17.2 Optimize data fetching
  - Cache domain reputation lookups
  - Debounce URL input (300ms)
  - Cancel pending requests on new submission
  - Prefetch extension status for authenticated users
  - _Requirements: All homepage requirements_

## 18. Documentation

- [x] 18.1 Add component documentation
  - Add JSDoc comments to all components
  - Document props interfaces
  - Add usage examples
  - Document scan types and limitations
  - _Requirements: All homepage requirements_

- [x] 18.2 Create user documentation
  - Document how to use URL checker
  - Explain scan types
  - Document Social Protection features
  - Create FAQ for common issues
  - _Requirements: All homepage requirements_