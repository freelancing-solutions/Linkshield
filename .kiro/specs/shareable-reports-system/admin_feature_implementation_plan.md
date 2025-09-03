# Implementation Plan: Admin Feature

This document outlines the step-by-step plan for implementing the LinkShield Admin Dashboard feature, based on the existing documentation.

## Phase 1: Backend - Data Model and Authentication

**Objective:** Update the database schema and authentication system to support a user `role`.

1.  **Modify Database Schema:**
    -   **Action:** Edit `prisma/schema.prisma`.
    -   **Change:** Add `role String @default("USER")` to the `User` model.

2.  **Apply Database Migration:**
    -   **Action:** Run a shell command.
    -   **Command:** `npx prisma migrate dev --name add_user_role`

3.  **Update Authentication Flow:**
    -   **Action:** Edit `src/lib/auth.ts`.
    -   **Change:** Modify the `jwt` and `session` callbacks to include the `role` field, mirroring how the `plan` field is handled.

## Phase 2: Backend - API Endpoints

**Objective:** Create the secure API endpoints required for the admin dashboard.

1.  **Create Admin Middleware:**
    -   **Action:** Create a new file at `src/lib/middleware/admin-middleware.ts`.
    -   **Content:** The middleware will get the user's session and check if `session.user.role === 'ADMIN'`. If not, it will return a `403 Forbidden` response.

2.  **Implement Admin API Routes:**
    -   **Action:** Create new route files within a new `src/app/api/admin/` directory.
    -   **Details:** Each route will be wrapped with the admin middleware.
    -   **Files to Create:**
        -   `src/app/api/admin/stats/route.ts` (GET)
        -   `src/app/api/admin/users/route.ts` (GET)
        -   `src/app/api/admin/users/[id]/route.ts` (PUT, DELETE)
        -   `src/app/api/admin/reports/route.ts` (GET)
        -   `src/app/api/admin/reports/[id]/route.ts` (DELETE)

## Phase 3: Frontend - User Interface

**Objective:** Build the React components and pages for the admin dashboard.

1.  **Create Admin Layout:**
    -   **Action:** Create a new file at `src/app/admin/layout.tsx`.
    -   **Content:** This layout will be the root for the admin section. It will contain logic to get the user's session and redirect them if they are not an `ADMIN`.

2.  **Create Admin Pages:**
    -   **Action:** Create the page files for the admin section.
    -   **Files to Create:**
        -   `src/app/admin/dashboard/page.tsx`: Will fetch from `/api/admin/stats` and display the data.
        -   `src/app/admin/users/page.tsx`: Will contain a client component that fetches from `/api/admin/users` and displays them in a data table.
        -   `src/app/admin/reports/page.tsx`: Will contain a client component that fetches from `/api/admin/reports` and displays them in a data table.

3.  **Update Main Navigation:**
    -   **Action:** Edit the existing `src/components/navbar.tsx` component.
    -   **Change:** Add a new navigation link to `/admin/dashboard` that is only rendered if the user's session contains `role: 'ADMIN'`.

---

This plan covers all necessary changes, from the database to the UI, to deliver the complete Admin Feature. Please review this plan. Once you approve it, I will begin implementation starting with Phase 1.
