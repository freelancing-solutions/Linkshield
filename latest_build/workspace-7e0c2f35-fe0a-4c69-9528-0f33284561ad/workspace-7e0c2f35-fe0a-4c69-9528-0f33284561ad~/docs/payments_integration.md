# Payments and Subscription Management

This document details how LinkShield integrates with Stripe to handle payments, subscriptions, and billing management.

## Overview

Stripe is the exclusive payment processor for LinkShield. The integration manages the entire subscription lifecycle, from creating a checkout session to handling subscription updates and cancellations via webhooks.

**Key Files:**
- `src/app/pricing/page.tsx`: The client-side page where users initiate a subscription.
- `src/app/api/stripe/checkout/route.ts`: The backend endpoint for creating a Stripe Checkout session.
- `src/app/api/stripe/webhook/route.ts`: The backend endpoint that listens for and processes events from Stripe.
- `prisma/schema.prisma`: The `User` model contains the `stripe_customer_id` to link a user to a Stripe customer.

## Subscription Creation Flow

This is the end-to-end process for a user subscribing to a paid plan.

```mermaid
sequenceDiagram
    participant User
    participant PricingPage as UI (pricing/page.tsx)
    participant CheckoutAPI as API (/api/stripe/checkout)
    participant Stripe
    participant WebhookAPI as API (/api/stripe/webhook)
    participant Database

    User->>+PricingPage: 1. Clicks "Upgrade" for a plan
    PricingPage->>+CheckoutAPI: 2. POST request with priceId
    CheckoutAPI->>+Stripe: 3. Create Customer (if new)
    Stripe-->>-CheckoutAPI: Returns customerId
    CheckoutAPI->>+Stripe: 4. Create Checkout Session with userId in metadata
    Stripe-->>-CheckoutAPI: Returns sessionId
    CheckoutAPI-->>-PricingPage: 5. Returns { sessionId }
    PricingPage->>+Stripe: 6. redirectToCheckout({ sessionId })
    User->>+Stripe: 7. Enters payment details on Stripe's page
    Stripe-->>User: 8. Shows success message, redirects back to LinkShield
    
    Note over Stripe, Database: In the background...

    Stripe->>+WebhookAPI: 9. POST event: checkout.session.completed
    WebhookAPI->>WebhookAPI: 10. Verifies Stripe signature
    WebhookAPI->>+Database: 11. Updates User record:
    Note right of Database: - Sets user.plan = 'pro'
    - Sets user.stripe_customer_id
    - Sets plan_expires_at
    Database-->>-WebhookAPI: Confirms update
    WebhookAPI-->>-Stripe: 12. Returns 200 OK
```

### Step-by-Step Description

1.  **Initiate Upgrade:** A logged-in user on the `/pricing` page clicks the "Upgrade" button for a paid plan.
2.  **Create Checkout Session:** The frontend calls the `/api/stripe/checkout` endpoint, passing the `stripePriceId` for the selected plan.
3.  **Backend Logic:**
    - The API authenticates the user.
    - It checks if the user is already a customer in Stripe via the `stripe_customer_id` on the `User` model. If not, a new Stripe Customer object is created.
    - It then creates a new Stripe Checkout Session, crucially embedding the user's internal `userId` in the `metadata` of the session. This is essential for linking the transaction back to the correct user.
    - The `sessionId` is returned to the client.
4.  **Redirect to Stripe:** The frontend uses Stripe.js to redirect the user to the secure, Stripe-hosted checkout page.
5.  **Payment Completion:** The user completes the payment on Stripe's platform.
6.  **Webhook Notification:** After the payment is successfully processed, Stripe sends a `checkout.session.completed` event to the `/api/stripe/webhook` endpoint.
7.  **Webhook Processing:**
    - The webhook handler first verifies the request signature to ensure it came from Stripe.
    - It then extracts the `userId` from the event's `metadata`.
    - It updates the corresponding `User` in the database to reflect the new plan, expiration date, and `stripe_customer_id`.
    - It returns a `200` status to Stripe to acknowledge receipt of the event.

## Subscription Management (Cancellations & Updates)

Subscription changes are also handled via webhooks.

- **Event:** `customer.subscription.deleted` or `customer.subscription.updated`
- **Action:** When Stripe sends these events (e.g., a user cancels their plan from the Stripe billing portal), the webhook handler at `/api/stripe/webhook` receives them.
- **Logic:** The handler identifies the user via the `stripe_customer_id` and updates their record in the LinkShield database, typically by downgrading their `plan` to `"free"` and clearing the `plan_expires_at` field.

This ensures that the user's access rights within the LinkShield application are always in sync with their subscription status in Stripe.
