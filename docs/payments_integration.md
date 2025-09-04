# Refactored Payment Integration Plan: PayPal

## Overview

LinkShield will integrate PayPal as an additional payment processor alongside Stripe. This integration will handle the entire subscription lifecycle, from creating checkout sessions to managing subscription updates and cancellations via webhooks.

**Key Files to Create/Modify:**
- `src/app/pricing/page.tsx`: Update to support PayPal checkout initiation
- `src/app/api/paypal/checkout/route.ts`: Backend endpoint for creating PayPal orders
- `src/app/api/paypal/webhook/route.ts`: Backend endpoint for processing PayPal events
- `prisma/schema.prisma`: Add `paypal_subscription_id` and `paypal_order_id` fields to User model
- `src/lib/paypal.ts`: New PayPal API client utility

## PayPal Subscription Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant PricingPage as UI (pricing/page.tsx)
    participant CheckoutAPI as API (/api/paypal/checkout)
    participant PayPal
    participant WebhookAPI as API (/api/paypal/webhook)
    participant Database

    User->>+PricingPage: 1. Clicks "Upgrade" with PayPal
    PricingPage->>+CheckoutAPI: 2. POST request with planId
    CheckoutAPI->>+PayPal: 3. Create Subscription Plan (if needed)
    PayPal-->>-CheckoutAPI: Returns planId
    CheckoutAPI->>+PayPal: 4. Create Subscription with custom_id (userId)
    PayPal-->>-CheckoutAPI: Returns approval_url and subscriptionId
    CheckoutAPI-->>-PricingPage: 5. Returns { approval_url }
    PricingPage->>+PayPal: 6. Redirect user to approval_url
    User->>+PayPal: 7. Approves subscription on PayPal
    PayPal-->>User: 8. Redirects back to LinkShield
    
    Note over PayPal, Database: In the background...

    PayPal->>+WebhookAPI: 9. POST event: BILLING.SUBSCRIPTION.ACTIVATED
    WebhookAPI->>WebhookAPI: 10. Verifies PayPal signature
    WebhookAPI->>+Database: 11. Updates User record:
    Note right of Database: - Sets user.plan = 'pro'
    - Sets user.paypal_subscription_id
    - Sets plan_expires_at
    Database-->>-WebhookAPI: Confirms update
    WebhookAPI-->>-PayPal: 12. Returns 200 OK
```

### Step-by-Step Description

1.  **Initiate Upgrade:** A logged-in user on the `/pricing` page clicks the "Upgrade with PayPal" button for a paid plan.
2.  **Create Subscription:** The frontend calls the `/api/paypal/checkout` endpoint, passing the `planId` for the selected plan.
3.  **Backend Logic:**
    - The API authenticates the user.
    - It checks if a corresponding PayPal billing plan exists. If not, it creates one.
    - It creates a PayPal subscription, embedding the user's internal `userId` in the `custom_id` field.
    - The `approval_url` and `subscriptionId` are returned to the client.
4.  **Redirect to PayPal:** The frontend redirects the user to the PayPal approval URL.
5.  **Payment Approval:** The user approves the subscription on PayPal's platform.
6.  **Webhook Notification:** After approval, PayPal sends a `BILLING.SUBSCRIPTION.ACTIVATED` event to the `/api/paypal/webhook` endpoint.
7.  **Webhook Processing:**
    - The webhook handler verifies the request signature to ensure it came from PayPal.
    - It extracts the `userId` from the subscription's `custom_id` field.
    - It updates the corresponding `User` in the database to reflect the new plan, expiration date, and `paypal_subscription_id`.
    - It returns a `200` status to PayPal to acknowledge receipt.

## Implementation Details

### Database Schema Updates
```prisma
model User {
  id                     String   @id @default(cuid())
  // ... existing fields
  stripe_customer_id     String?  @unique
  paypal_subscription_id String?  @unique
  paypal_order_id        String?  @unique
  // ... existing fields
}
```

### PayPal API Client
```typescript
// src/lib/paypal.ts
import { PayPalEnvironment, PayPalHttpClient, core } from '@paypal/checkout-server-sdk';

function environment(): PayPalEnvironment {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  
  return process.env.NODE_ENV === 'production'
    ? new core.LiveEnvironment(clientId, clientSecret)
    : new core.SandboxEnvironment(clientId, clientSecret);
}

export const paypalClient = new PayPalHttpClient(environment());
```

### Checkout Endpoint
```typescript
// src/app/api/paypal/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { paypalClient } from '@/lib/paypal';
import { subscriptions } from '@paypal/checkout-server-sdk';

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    const user = await getCurrentUser(); // Your auth implementation
    
    // Create or get PayPal billing plan
    const planId = await createOrGetBillingPlan(priceId);
    
    // Create subscription
    const request = new subscriptions.SubscriptionsCreateRequest();
    request.requestBody({
      plan_id: planId,
      custom_id: user.id,
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing`
      }
    });
    
    const response = await paypalClient.execute(request);
    const subscription = response.result;
    
    return NextResponse.json({ approval_url: subscription.links.find(link => link.rel === 'approve')?.href });
  } catch (error) {
    console.error('PayPal checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
```

### Webhook Endpoint
```typescript
// src/app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@paypal/checkout-server-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('paypal-transmission-id');
    const timestamp = req.headers.get('paypal-transmission-time');
    const certUrl = req.headers.get('paypal-cert-url');
    const authAlgo = req.headers.get('paypal-auth-algo');
    const transmissionSig = req.headers.get('paypal-transmission-sig');
    
    // Verify webhook signature
    const verified = await verifyWebhookSignature({
      webhookId: process.env.PAYPAL_WEBHOOK_ID!,
      eventBody: body,
      transmissionId: signature!,
      transmissionTime: timestamp!,
      transmissionSig: transmissionSig!,
      certUrl: certUrl!,
      authAlgo: authAlgo!
    });
    
    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(body);
    
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event);
        break;
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(event);
        break;
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

## Environment Variables
Add the following to your environment configuration:
```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id
```

## Subscription Management

PayPal subscription changes are handled via webhooks:

- **Event:** `BILLING.SUBSCRIPTION.CANCELLED` or `BILLING.SUBSCRIPTION.EXPIRED`
- **Action:** When PayPal sends these events, the webhook handler updates the user's record in the database, downgrading their `plan` to `"free"` and clearing the subscription-related fields.

This integration ensures that user access rights within LinkShield remain synchronized with their subscription status in both Stripe and PayPal payment systems.