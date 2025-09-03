# Test Specification: Authentication

This document outlines the test cases for the user authentication system.

## 1. Sign-In Page (`/auth/signin`)

### 1.1. UI Elements
- **Test Case 1.1.1:** Verify that the sign-in page renders correctly.
  - **Given:** A user navigates to `/auth/signin`.
  - **When:** The page loads.
  - **Then:** The page should display an email input field, a password input field, and a "Sign In" button.

### 1.2. Form Submission
- **Test Case 1.2.1:** Verify successful sign-in with valid credentials.
  - **Given:** A user exists in the database with the email `test@example.com`.
  - **When:** The user enters `test@example.com` and *any* password, and clicks "Sign In".
  - **Then:** The user should be redirected to the `/dashboard` page.

- **Test Case 1.2.2:** Verify failed sign-in with an email that does not exist.
  - **Given:** No user exists in the database with the email `nouser@example.com`.
  - **When:** The user enters `nouser@example.com` and any password, and clicks "Sign In".
  - **Then:** An "Invalid credentials" error message should be displayed, and the user should remain on the `/auth/signin` page.

- **Test Case 1.2.3:** Verify that input fields are required.
  - **Given:** A user is on the sign-in page.
  - **When:** The user attempts to submit the form with either the email or password field empty.
  - **Then:** The browser's native HTML5 validation should prevent submission.

## 2. Session Management

### 2.1. Session Creation
- **Test Case 2.1.1:** Verify that a JWT session cookie is created upon successful login.
  - **Given:** A user successfully signs in.
  - **When:** The user is redirected to the dashboard.
  - **Then:** A secure, HTTP-only cookie containing the session JWT should be present in the browser.

### 2.2. Session Data
- **Test Case 2.2.1:** Verify that the session object contains the correct user data.
  - **Given:** A user with the `pro` plan is logged in.
  - **When:** An API route or server component accesses the user's session.
  - **Then:** The session object should contain the correct `user.id` and `user.plan` (`pro`).

## 3. Route Protection

### 3.1. Protected Server-Side Pages
- **Test Case 3.1.1:** Verify that an unauthenticated user is redirected from a protected page.
  - **Given:** An unauthenticated user.
  - **When:** The user attempts to navigate directly to `/dashboard`.
  - **Then:** The user should be redirected to the `/auth/signin` page.

### 3.2. Protected API Routes
- **Test Case 3.2.1:** Verify that an unauthenticated user cannot access a protected API route.
  - **Given:** An unauthenticated user.
  - **When:** The user sends a request to a protected endpoint like `/api/dashboard/stats`.
  - **Then:** The API should return a `401 Unauthorized` or `403 Forbidden` error response.

## 4. Sign-Out

- **Test Case 4.1.1:** Verify that the sign-out process works correctly.
  - **Given:** An authenticated user is on the dashboard.
  - **When:** The user clicks the "Sign Out" button.
  - **Then:** The session cookie should be cleared, and the user should be redirected to the homepage or sign-in page.
