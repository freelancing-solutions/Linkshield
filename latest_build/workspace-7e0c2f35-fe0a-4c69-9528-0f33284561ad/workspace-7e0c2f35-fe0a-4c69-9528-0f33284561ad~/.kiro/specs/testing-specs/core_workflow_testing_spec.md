# Test Specification: Core Workflow (Analysis & Sharing)

This document outlines test cases for the core user workflow: analyzing a URL and sharing the resulting report.

## 1. URL Analysis

### 1.1. URL Submission Form
- **Test Case 1.1.1:** Verify anonymous user can submit a URL.
  - **Given:** An unauthenticated user is on the homepage.
  - **When:** They enter a valid URL and submit the form.
  - **Then:** An analysis should be triggered, and they should be redirected to the report page.

- **Test Case 1.1.2:** Verify authenticated user can submit a URL.
  - **Given:** An authenticated user is on their dashboard.
  - **When:** They enter a valid URL and submit the form.
  - **Then:** An analysis should be triggered, the report should be associated with their account, and they should be redirected to the report page.

- **Test Case 1.1.3:** Verify submission of an invalid URL.
  - **Given:** A user is on a page with the submission form.
  - **When:** They enter an invalid URL (e.g., "not-a-url").
  - **Then:** The API should return a validation error (e.g., `400 Bad Request`), and the UI should display an appropriate error message.

### 1.2. Analysis API (`/api/check`)
- **Test Case 1.2.1:** Verify the API returns a report slug on success.
  - **Given:** A valid URL is sent to `/api/check`.
  - **When:** The analysis completes successfully.
  - **Then:** The API should respond with a JSON object containing the `reportId` (slug).

- **Test Case 1.2.2:** Verify the report is linked to the user when authenticated.
  - **Given:** An authenticated user sends a request to `/api/check`.
  - **When:** The report is created in the database.
  - **Then:** The report record should have a `userId` field that matches the authenticated user's ID.

## 2. Report Viewing

### 2.1. Report Page (`/reports/[slug]`)
- **Test Case 2.1.1:** Verify a report can be viewed using its slug.
  - **Given:** A report exists with a specific slug.
  - **When:** A user navigates to `/reports/[slug]`.
  - **Then:** The page should load and display the analysis details for that report.

- **Test Case 2.1.2:** Verify the "Share" button is visible to the report owner.
  - **Given:** An authenticated user is viewing a report that they own.
  - **When:** The report page loads.
  - **Then:** The "Share" button should be visible and enabled.

- **Test Case 2.1.3:** Verify the "Share" button is not visible to other users.
  - **Given:** An authenticated user is viewing a report owned by another user (or an anonymous report).
  - **When:** The report page loads.
  - **Then:** The "Share" button should not be present.

## 3. Report Sharing

### 3.1. Sharing Workflow
- **Test Case 3.1.1:** Verify the share modal opens.
  - **Given:** A report owner is viewing their own report.
  - **When:** They click the "Share" button.
  - **Then:** A modal dialog (`ShareModal`) should appear.

- **Test Case 3.1.2:** Verify the share API creates a public link.
  - **Given:** A report owner has opened the share modal.
  - **When:** They confirm the action to share the report.
  - **Then:** A `POST` request should be sent to `/api/dashboard/shareable-reports`.
  - **And:** The corresponding report in the database should be updated (e.g., `isPublic` set to `true`, a public slug generated).
  - **And:** The modal should display the new public URL.

### 3.2. Public Access
- **Test Case 3.2.1:** Verify that a public report is accessible to anyone.
  - **Given:** A report has been made public.
  - **When:** Any user (including unauthenticated users) navigates to the public report URL.
  - **Then:** The report page should load and display the analysis.
