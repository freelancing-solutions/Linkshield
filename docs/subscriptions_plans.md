# Subscription Plans and Feature Gating

This document outlines the different subscription plans available in LinkShield, their features, limits, and how these limits are enforced within the system.

## Plan Definitions

LinkShield operates on a freemium model with multiple tiers. The plans and their corresponding limits are defined in the `Plan` model in the database.

**Source of Truth:**
- `prisma/schema.prisma`: The `Plan` model defines the specifics of each tier, while the `User` model tracks each user's current plan and their usage.
- `src/app/pricing/page.tsx`: The user-facing page that displays the plans to customers.

### Available Plans

| Plan        | Price    | Checks / Month | AI Analyses / Month | Target Audience         |
|-------------|----------|----------------|---------------------|-------------------------|
| **Free**    | $0       | 50             | 5                   | Casual users            |
| **Pro**     | $20/mo   | 1,000          | 50                  | Power users, developers |
| **Enterprise**| Custom   | Unlimited      | Unlimited           | Businesses, teams       |

*Note: The specific limits are defined in the `Plan` table in the database and may be subject to change.*

## Feature Gating and Limit Enforcement

The system enforces plan limits by checking a user's current plan and their usage for the billing period. This logic is typically applied in API routes or middleware before a resource-intensive action is performed.

### User Model

The `User` model in `prisma/schema.prisma` is central to enforcing limits. It contains the following critical fields:

- `plan`: A string (`free`, `pro`, `enterprise`) indicating the user's current subscription tier.
- `checks_used_this_month`: A counter for the number of URL checks performed.
- `ai_analyses_used_this_month`: A counter for the number of AI-powered analyses performed.
- `plan_expires_at`: A timestamp indicating when the current plan (if paid) expires.

### Enforcement Workflow

Here is a typical workflow for checking if a user can perform a paid action (e.g., an AI analysis):

```mermaid
graph TD
    A[User requests AI Analysis] --> B{API Endpoint: /api/analyze/ai};
    B --> C{Get User Session};
    C --> D{Find User in DB};
    D --> E{Check Plan & Usage};
    subgraph "Validation Logic"
        E -- "Is user on a valid plan?" --> F[plan == 'pro' || plan == 'enterprise'?];
        F -- "Yes" --> G[ai_analyses_used_this_month < plan.limit?];
        F -- "No (Free Plan)" --> H[Return 402 Payment Required];
        G -- "Yes (Limit OK)" --> I[Proceed with Analysis];
        G -- "No (Limit Exceeded)" --> J[Return 429 Too Many Requests];
    end
    I --> K[Increment ai_analyses_used_this_month];
    K --> L[Return Analysis Result];

    style H fill:#f99,stroke:#333,stroke-width:2px
    style J fill:#f99,stroke:#333,stroke-width:2px
```

1.  **Request:** A user initiates an action that is subject to limits, such as a URL check or AI analysis.
2.  **Authentication:** The API endpoint first verifies that the user is authenticated.
3.  **Fetch User Data:** It retrieves the user's record from the database, including their `plan` and current usage counters.
4.  **Check Limits:** The backend logic compares the user's `*_used_this_month` counter against the limits defined for their `plan`.
5.  **Grant or Deny Access:**
    - If the user is within their limits, the action is performed, and the usage counter is incremented.
    - If the user has exceeded their limits, the API returns an error (e.g., `429 Too Many Requests`) and prompts the user to upgrade their plan.
    - If the user is on a plan that does not grant access to the feature, the API returns a `402 Payment Required` error.

### Resetting Usage

A background job or cron task is expected to run periodically (e.g., monthly) to reset the `checks_used_this_month` and `ai_analyses_used_this_month` counters for all users, aligning with the start of a new billing cycle.
