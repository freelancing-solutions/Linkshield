# Test Specification: AI Features

This document outlines test cases for the AI-powered analysis features, focusing on access control (gating) and usage tracking.

## 1. Feature Gating

### 1.1. UI Gating
- **Test Case 1.1.1:** Verify the AI analysis option is available to Pro plan users.
  - **Given:** An authenticated user with a `pro` plan is on the dashboard.
  - **When:** The URL analysis form is displayed.
  - **Then:** A checkbox or toggle for "Include AI Analysis" should be visible and enabled.

- **Test Case 1.1.2:** Verify the AI analysis option is not available to Free plan users.
  - **Given:** An authenticated user with a `free` plan is on the dashboard.
  - **When:** The URL analysis form is displayed.
  - **Then:** The option to include AI analysis should be hidden or disabled.

### 1.2. API Gating
- **Test Case 1.2.1:** Verify a Pro user can trigger an AI analysis.
  - **Given:** An authenticated user with a `pro` plan who is within their usage limits.
  - **When:** A request is sent to `/api/check` with `includeAI: true`.
  - **Then:** The API should process the request successfully and create an `AIAnalysis` record.

- **Test Case 1.2.2:** Verify a Free user is blocked from triggering an AI analysis via the API.
  - **Given:** An authenticated user with a `free` plan.
  - **When:** A request is sent to `/api/check` with `includeAI: true`.
  - **Then:** The API should return a `402 Payment Required` or `403 Forbidden` error.

## 2. Usage Tracking and Limits

- **Test Case 2.1:** Verify that performing an AI analysis increments the user's usage counter.
  - **Given:** A Pro user has `ai_analyses_used_this_month` set to `5`.
  - **When:** The user successfully requests an AI analysis.
  - **Then:** The user's `ai_analyses_used_this_month` count in the database should become `6`.

- **Test Case 2.2:** Verify a user who has reached their limit is blocked.
  - **Given:** A Pro user's `ai_analyses_used_this_month` is equal to their plan's monthly limit.
  - **When:** The user attempts to request another AI analysis.
  - **Then:** The API should return a `429 Too Many Requests` error.

- **Test Case 2.3:** Verify the counter is not incremented on a failed request.
  - **Given:** A Pro user has `ai_analyses_used_this_month` set to `5`.
  - **When:** The user's request for an AI analysis fails for a reason other than rate limiting (e.g., invalid URL).
  - **Then:** The user's `ai_analyses_used_this_month` count should remain `5`.

## 3. Database State

- **Test Case 3.1:** Verify an `AIAnalysis` record is created in a pending state.
  - **Given:** A user successfully requests an AI analysis.
  - **When:** The `/api/check` endpoint completes processing.
  - **Then:** A new row should exist in the `AIAnalysis` table linked to the user and the check.
  - **And:** The `processingStatus` of the new record should be `pending`.

- **Test Case 3.2:** Verify that existing analyses are reused.
  - **Given:** An `AIAnalysis` record already exists for a specific URL's content hash.
  - **When:** A different user requests an AI analysis for a URL with the same content.
  - **Then:** A new `AIAnalysis` record should **not** be created. The existing record should be associated with the new check.
