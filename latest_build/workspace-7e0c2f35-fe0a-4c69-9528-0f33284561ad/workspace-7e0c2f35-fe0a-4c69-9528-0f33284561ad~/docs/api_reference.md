# API Reference

This document provides a high-level overview of the key API endpoints in the LinkShield backend. The API is built using Next.js API Routes.

## Base Path

All API routes are prefixed with `/api`.

---

### `POST /api/check`

- **Description:** The primary endpoint for submitting a URL for analysis. It accepts a URL and optional parameters (like requesting an AI analysis). It returns a `reportId` which is the slug for the report page.
- **Authentication:** Optional. If authenticated, the report is associated with the user's account.
- **Key File:** `src/app/api/check/route.ts`

---

### `GET /api/health`

- **Description:** A simple health check endpoint used to verify that the service is running. It typically returns a `200 OK` status with a confirmation message.
- **Authentication:** None.
- **Key File:** `src/app/api/health/route.ts`

---

### `/api/auth/...`

- **Description:** Endpoints related to user authentication, handled by Next-Auth.js.
- **Endpoints:**
    - `POST /api/auth/signin/credentials`: Handles the sign-in process.
    - `GET /api/auth/signout`: Handles the sign-out process.
    - `GET /api/auth/session`: Retrieves the current user session.
    - `POST /api/auth/register`: Handles new user registration.
- **Authentication:** Varies by endpoint.
- **Key Files:** `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/register/route.ts`

---

### `/api/dashboard/...`

- **Description:** A collection of endpoints that serve data specifically for the authenticated user's dashboard.
- **Endpoints:**
    - `GET /api/dashboard/stats`: Retrieves usage statistics for the user.
    - `GET /api/dashboard/history`: Gets the user's history of checked URLs.
    - `GET /api/dashboard/recent-reports`: Fetches a list of the most recent reports for the sidebar.
    - `POST /api/dashboard/shareable-reports`: Creates a public, shareable link for one of the user's reports.
    - `PUT /api/dashboard/[id]`: Updates a specific report (e.g., custom title).
- **Authentication:** Required for all endpoints.
- **Key Files:** `src/app/api/dashboard/*`

---

### `/api/reports/...`

- **Description:** Endpoint for managing and retrieving individual report details.
- **Endpoints:**
    - `GET /api/reports/[slug]`: Fetches the detailed data for a specific report using its public-facing slug.
- **Authentication:** None (for public reports).
- **Key File:** `src/app/api/reports/[slug]/route.ts`

---

### `/api/stripe/...`

- **Description:** Endpoints for handling payment processing and subscription management with Stripe.
- **Endpoints:**
    - `POST /api/stripe/checkout`: Creates a new Stripe Checkout session for a user to subscribe to a plan.
    - `POST /api/stripe/webhook`: Listens for events from Stripe (e.g., `checkout.session.completed`, `customer.subscription.deleted`) to update user plan information in the database.
- **Authentication:** Required for `checkout`. The `webhook` endpoint is public but secured with a Stripe signature.
- **Key Files:** `src/app/api/stripe/*`

---

### `/api/og/...`

- **Description:** Dynamically generates Open Graph (OG) images for social media sharing of reports.
- **Endpoints:**
    - `GET /api/og/[slug]`: Creates a custom OG image for a specific report.
    - `GET /api/og/default`: Generates a default OG image.
- **Authentication:** None.
- **Key File:** `src/app/api/og/*`

---

### `/api/analytics/...`

- **Description:** Endpoints for tracking specific analytics events.
- **Endpoints:**
    - `POST /api/analytics/sidebar-impression`: Logs an impression event when the recent reports sidebar is viewed.
- **Authentication:** None.
- **Key File:** `src/app/api/analytics/sidebar-impression/route.ts`
