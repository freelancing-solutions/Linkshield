# Environment Variables

This document lists the necessary environment variables for running the LinkShield application. These variables should be stored in a `.env.local` file in the project root for local development.

## General Configuration

### `NODE_ENV`
- **Description:** Specifies the application environment.
- **Values:** `development` or `production`.
- **Usage:** Controls various framework and application behaviors, such as logging, caching, and database connection pooling.

### `NEXT_PUBLIC_APP_URL`
- **Description:** The full public URL of the application.
- **Usage:** Used on both client and server to generate absolute URLs for redirects (like after a Stripe checkout), OG images, and shareable links.
- **Example:** `https://app.linkshield.com`

### `NEXT_PUBLIC_SOCKET_URL`
- **Description:** The URL for the WebSocket server.
- **Usage:** Used by the client-side Socket.IO instance to establish a real-time connection.
- **Example:** `https://ws.linkshield.com` or the same as `NEXT_PUBLIC_APP_URL` if served together.

## Database

### `DATABASE_URL`
- **Description:** The connection string for the PostgreSQL/PlanetScale database.
- **Usage:** Required by Prisma to connect to the database for all query and migration operations.
- **Example:** `postgresql://user:password@host:port/database?sslmode=require`

## Authentication

### `NEXTAUTH_URL`
- **Description:** The canonical URL of the Next.js application. It is a security measure to prevent session hijacking.
- **Usage:** Required by Next-Auth.js for generating callback URLs and ensuring secure redirects.
- **Note:** In development, this is often `http://localhost:3000`. In production, it should be the same as `NEXT_PUBLIC_APP_URL`.

### `NEXTAUTH_SECRET`
- **Description:** A secret string used to sign and encrypt JWTs, cookies, and other security tokens.
- **Usage:** Critical for session security. This should be a long, random, and private string.
- **Command to generate:** `openssl rand -base64 32`

## Payments (Stripe)

### `STRIPE_API_KEY`
- **Description:** The secret API key for your Stripe account.
- **Usage:** Used by the Stripe Node.js library on the backend to perform actions like creating customers and checkout sessions.
- **Example:** `sk_test_...` or `sk_live_...`

### `STRIPE_WEBHOOK_SECRET`
- **Description:** The secret key for verifying incoming webhooks from Stripe.
- **Usage:** Ensures that requests to `/api/stripe/webhook` are genuinely from Stripe. You get this when you create a webhook endpoint in your Stripe dashboard.
- **Example:** `whsec_...`

## Caching (Redis)

### `REDIS_URL`
- **Description:** The connection string for your Redis instance.
- **Usage:** Used by the caching service to connect to Redis for storing and retrieving cached data.
- **Example:** `redis://:password@host:port`

## AI Services (Optional)

These variables are required if the AI features are fully enabled.

### `OPENAI_API_KEY`
- **Description:** Your secret API key for the OpenAI API.
- **Usage:** Required by the AI processing service to perform tasks like content summarization and analysis.

### `PINECONE_API_KEY`
- **Description:** Your API key for the Pinecone vector database.
- **Usage:** Required by the AI processing service to store and query vector embeddings for similarity searches.
