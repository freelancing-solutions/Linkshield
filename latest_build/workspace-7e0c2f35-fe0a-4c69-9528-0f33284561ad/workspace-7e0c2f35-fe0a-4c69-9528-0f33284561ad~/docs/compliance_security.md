# Security and Compliance

This document outlines the key security measures and compliance considerations for the LinkShield application.

## Security Measures

LinkShield is built with security as a priority, incorporating several industry-standard practices to protect user data and ensure service reliability.

### Authentication
- **Framework:** Authentication is managed by [Next-Auth.js](https://next-auth.js.org/), a reputable, open-source solution.
- **Session Management:** The application uses JSON Web Tokens (JWTs) for sessions. These tokens are stored in secure, HTTP-only cookies, which helps mitigate Cross-Site Scripting (XSS) attacks trying to access session data.
- **Secrets:** All session tokens and cookies are signed with a strong, private `NEXTAUTH_SECRET`, preventing tampering.

### Payment Processing
- **PCI Compliance:** All payment and credit card information is handled exclusively by [Stripe](https://stripe.com/), a certified PCI Service Provider Level 1. Sensitive financial data never touches the LinkShield servers.
- **Data Storage:** Only non-sensitive metadata, such as the `stripe_customer_id`, is stored in the application database to link users with their subscriptions.

### API and Network Security
- **Rate Limiting:** The API implements a simple, in-memory, IP-based rate limiter to protect against brute-force attacks and denial-of-service attempts. By default, it allows 10 requests per IP address per minute.
  - **File:** `src/lib/middleware/rate-limit-middleware.ts`
- **Webhook Security:** Webhooks received from Stripe are verified using a secret signature (`STRIPE_WEBHOOK_SECRET`). This ensures that only legitimate requests from Stripe can trigger changes to user subscription data.
  - **File:** `src/app/api/stripe/webhook/route.ts`

### Data and Application Security
- **SQL Injection Prevention:** The application uses the [Prisma ORM](https://www.prisma.io/) for all database interactions. Prisma's query builder uses parameterized queries, which provides robust protection against SQL injection attacks.
- **Input Validation:** The project is configured to use [Zod](https://zod.dev/) for schema-based input validation. This ensures that data sent to API endpoints conforms to the expected shape and type, preventing a wide range of potential vulnerabilities.
- **Cross-Site Scripting (XSS) Prevention:** As a React application, LinkShield benefits from React's automatic escaping of content rendered in JSX. This prevents malicious scripts injected into data from being executed in the user's browser. A review of the codebase found one use of `dangerouslySetInnerHTML` in a charting component, but its input is programmatically generated and not sourced from user content, mitigating the risk.

## Compliance

### GDPR (General Data Protection Regulation)
As LinkShield collects and processes personal data of users, it falls under the scope of GDPR if it serves customers in the European Union.

**Personal Data Collected:**
- **User Account:** Email address and name.
- **Usage Data:** IP addresses (for rate limiting), user agent strings.
- **Payment:** While Stripe handles the details, the application is aware of the user's subscription status and customer ID.

**Considerations for GDPR Compliance:**
- **Privacy Policy:** A clear and accessible privacy policy must be available to users, detailing what data is collected, why, and how it is processed.
- **User Consent:** Consent must be explicitly obtained for data collection, especially for non-essential cookies or tracking.
- **Data Subject Rights:** The application should have a process for honoring user rights, including the right to access, rectify, or erase their personal data (e.g., a "Delete Account" feature that scrubs personal information).
- **Data Processing Agreements (DPAs):** DPAs should be in place with all third-party data processors, such as Stripe, PlanetScale, and any AI service providers.
