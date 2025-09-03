# Test Specification: Admin Feature

This document outlines test cases for the Admin Dashboard feature, including Role-Based Access Control (RBAC), the Admin API, and the frontend UI.

## 1. Role-Based Access Control (RBAC)

### 1.1. Session and Token
- **Test Case 1.1.1:** Verify an admin user's session includes the ADMIN role.
  - **Given:** A user with the `ADMIN` role in the database successfully signs in.
  - **When:** The session JWT is created.
  - **Then:** The decoded JWT and the session object available via `getServerSession` must contain `role: 'ADMIN'`. 

- **Test Case 1.1.2:** Verify a regular user's session includes the USER role.
  - **Given:** A user with the default (`USER`) role signs in.
  - **When:** The session object is created.
  - **Then:** The session object must contain `role: 'USER'`. 

### 1.2. Middleware and Page Protection
- **Test Case 1.2.1:** Verify that a non-admin user cannot access an admin API route.
  - **Given:** An authenticated user with the `USER` role.
  - **When:** They send a `GET` request to `/api/admin/stats`.
  - **Then:** The API should return a `403 Forbidden` error.

- **Test Case 1.2.2:** Verify that an unauthenticated user cannot access an admin API route.
  - **Given:** An unauthenticated user.
  - **When:** They send a `GET` request to `/api/admin/stats`.
  - **Then:** The API should return a `401 Unauthorized` or `403 Forbidden` error.

- **Test Case 1.2.3:** Verify that a non-admin user is redirected from admin UI pages.
  - **Given:** An authenticated user with the `USER` role.
  - **When:** They attempt to navigate directly to `/admin/dashboard`.
  - **Then:** They should be redirected to the main user dashboard (`/dashboard`) or the homepage.

## 2. Admin API Endpoints (`/api/admin/...`)

**Note:** For all tests below, the request is assumed to be from an authenticated `ADMIN` user.

### 2.1. `GET /api/admin/stats`
- **Test Case 2.1.1:** Verify the endpoint returns system statistics.
  - **Given:** The database contains a known number of users, reports, and subscriptions.
  - **When:** A `GET` request is made to `/api/admin/stats`.
  - **Then:** The API should return a JSON object with the correct aggregate counts (e.g., `{ users: { total: 10 }, reports: { total: 50 } }`).

### 2.2. `GET /api/admin/users`
- **Test Case 2.2.1:** Verify the endpoint returns a paginated list of users.
  - **When:** A `GET` request is made to `/api/admin/users`.
  - **Then:** The API should return a list of user objects.

### 2.3. `PUT /api/admin/users/[id]`
- **Test Case 2.3.1:** Verify an admin can change a user's plan.
  - **Given:** A user with `id: 'user-123'` has the `free` plan.
  - **When:** A `PUT` request is sent to `/api/admin/users/user-123` with the body `{ "plan": "pro" }`.
  - **Then:** The user's record in the database should be updated to reflect `plan: 'pro'`. 

### 2.4. `DELETE /api/admin/users/[id]`
- **Test Case 2.4.1:** Verify an admin can delete a user.
  - **Given:** A user with `id: 'user-123'` exists.
  - **When:** A `DELETE` request is sent to `/api/admin/users/user-123`.
  - **Then:** The user's record should be removed from the database.

### 2.5. `DELETE /api/admin/reports/[id]`
- **Test Case 2.5.1:** Verify an admin can delete a report.
  - **Given:** A report with `id: 'report-456'` exists.
  - **When:** A `DELETE` request is sent to `/api/admin/reports/report-456`.
  - **Then:** The report's record should be removed from the database.

## 3. Admin Frontend UI

- **Test Case 3.1:** Verify the "Admin" navigation link is visible only to admins.
  - **Given:** An authenticated user with the `ADMIN` role is on the site.
  - **When:** The main navigation bar renders.
  - **Then:** A link to `/admin/dashboard` should be visible.
  - **And Given:** A user with the `USER` role is on the site.
  - **When:** The main navigation bar renders.
  - **Then:** The link to `/admin/dashboard` should NOT be visible.

- **Test Case 3.2:** Verify the user management page renders correctly.
  - **Given:** An admin user navigates to `/admin/users`.
  - **When:** The API call to `/api/admin/users` returns a list of users.
  - **Then:** The page should display a table containing the list of users.
