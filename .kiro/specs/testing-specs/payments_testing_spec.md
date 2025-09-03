# Test Specification: Payments and Subscriptions

This document outlines test cases for the payments and subscription management system, focusing on the application's integration with Stripe.

**Note:** These tests should be designed to run against a mocked Stripe API.

## 1. Pricing Page (`/pricing`)

- **Test Case 1.1:** Verify that clicking an "Upgrade" button initiates the checkout process.
  - **Given:** An authenticated user is on the `/pricing` page.
  - **When:** The user clicks the "Upgrade" button for the "Pro" plan.
  - **Then:** A `POST` request should be sent to `/api/stripe/checkout` with the correct `priceId` for the Pro plan.

- **Test Case 1.2:** Verify unauthenticated user is prompted to log in.
  - **Given:** An unauthenticated user is on the `/pricing` page.
  - **When:** The user clicks an "Upgrade" button.
  - **Then:** The user should be redirected to the `/auth/signin` page.

## 2. Checkout API (`/api/stripe/checkout`)

- **Test Case 2.1:** Verify the endpoint is protected.
  - **Given:** An unauthenticated user.
  - **When:** A `POST` request is sent to `/api/stripe/checkout`.
  - **Then:** The API should return a `401 Unauthorized` or `403 Forbidden` error.

- **Test Case 2.2:** Verify a Stripe Checkout session is created.
  - **Given:** An authenticated user sends a valid `priceId` to the endpoint.
  - **When:** The API processes the request.
  - **Then:** A call to the (mocked) Stripe API to create a `checkout.session` should be made.
  - **And:** The `metadata` of the created session must contain the user's `userId`.
  - **And:** The API should return a `sessionId` to the client.

## 3. Stripe Webhook API (`/api/stripe/webhook`)

### 3.1. Signature Verification
- **Test Case 3.1.1:** Verify that a request with an invalid signature is rejected.
  - **Given:** A `POST` request is sent to the webhook endpoint.
  - **When:** The request has a missing or invalid Stripe signature header.
  - **Then:** The API should return a `400 Bad Request` error.

### 3.2. Event: `checkout.session.completed`
- **Test Case 3.2.1:** Verify user plan is upgraded on successful checkout.
  - **Given:** A user exists with the `free` plan.
  - **When:** The webhook API receives a valid `checkout.session.completed` event for that user subscribing to the `pro` plan (identified via `metadata.userId`).
  - **Then:** The user's record in the database should be updated to `plan: 'pro'`.
  - **And:** The `stripe_customer_id` should be set on the user's record.

### 3.3. Event: `customer.subscription.deleted`
- **Test Case 3.3.1:** Verify user plan is downgraded on subscription cancellation.
  - **Given:** A user exists with the `pro` plan.
  - **When:** The webhook API receives a valid `customer.subscription.deleted` event for that user.
  - **Then:** The user's record in the database should be updated to `plan: 'free'`.

## 4. Plan Limit Enforcement

- **Test Case 4.1:** Verify a free user is blocked from a pro feature.
  - **Given:** A user on the `free` plan has exceeded their `ai_analyses_used_this_month` limit.
  - **When:** The user attempts to perform another AI analysis.
  - **Then:** The relevant API endpoint should return a `402 Payment Required` or `429 Too Many Requests` error.

- **Test Case 4.2:** Verify an upgraded user can access a pro feature.
  - **Given:** A user was on the `free` plan, exceeded their limits, and then upgraded to the `pro` plan.
  - **When:** The user attempts to perform an AI analysis after their plan has been updated.
  - **Then:** The action should be successful (assuming they are within the new `pro` plan limits).
