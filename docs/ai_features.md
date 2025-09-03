# AI-Powered Features

This document describes the architecture and workflow for the AI-powered analysis features within LinkShield, which are designed to provide deeper insights into URL content.

## Overview

LinkShield integrates AI capabilities to offer advanced content analysis, including summarization, topic extraction, and quality scoring. These features are gated and available only to users on specific subscription plans.

The system is designed to be extensible, with the database schema ready to support these features, even if the final implementation of the AI service calls is handled by a separate process.

**Key Components:**
- **Models:** `AIAnalysis` and `SimilarPage` in `prisma/schema.prisma`.
- **Trigger:** The `/api/check/route.ts` endpoint, which conditionally initiates an AI analysis.
- **Usage Tracking:** The `ai_analyses_used_this_month` field on the `User` model.
- **Data Consumption:** Reports and UI components use the data from the `AIAnalysis` model to display insights.

## AI Analysis Workflow

The process is initiated by the user and gated by their subscription plan.

```mermaid
sequenceDiagram
    participant User
    participant Frontend as LinkShield UI
    participant CheckAPI as API (/api/check)
    participant Database
    participant AIProcessor as Background Service (Assumed)

    User->>+Frontend: 1. Submits URL with "Include AI Analysis" checked
    Frontend->>+CheckAPI: 2. POST request with `includeAI: true`
    CheckAPI->>+Database: 3. Get user plan and usage
    Database-->>-CheckAPI: Returns user data

    CheckAPI->>CheckAPI: 4. Verify user is within plan limits
    alt Plan limit exceeded
        CheckAPI-->>-Frontend: Return 429 Too Many Requests
    else Plan limit OK
        CheckAPI->>+Database: 5. Create AIAnalysis record with 'pending' status
        Database-->>-CheckAPI: Returns new record
        CheckAPI-->>-Frontend: 6. Returns report data
    end

    Note over Database, AIProcessor: A background service monitors for pending jobs.

    AIProcessor->>+Database: 7. Fetches pending AIAnalysis record
    AIProcessor->>AIProcessor: 8. Calls external services (OpenAI, Pinecone)
    AIProcessor->>+Database: 9. Updates AIAnalysis record with results and 'completed' status
    Database-->>-AIProcessor: Confirms update
```

### Step-by-Step Description

1.  **User Request:** A user on a qualifying plan (e.g., Pro or Enterprise) submits a URL for analysis and explicitly opts-in for the AI-powered deep scan.

2.  **API Call:** The frontend makes a request to `/api/check`, indicating that an AI analysis is requested (`includeAI: true`).

3.  **Gating and Validation:** The API endpoint performs the following checks:
    - It retrieves the user's current `plan` and `ai_analyses_used_this_month` from the database.
    - It verifies that the user's plan allows for AI features and that they have not exceeded their monthly quota.
    - If the user cannot perform the analysis, an appropriate error (`402` or `429`) is returned.

4.  **Creating the AIAnalysis Record:**
    - If the validation passes, the system creates a new record in the `AIAnalysis` table.
    - This record is linked to the user and the specific URL check.
    - Initially, it is created with a `processingStatus` of `"pending"`.
    - The user's `ai_analyses_used_this_month` counter is incremented.

5.  **Background Processing (Assumed):**
    - A separate background service or serverless function is responsible for handling the actual AI processing.
    - This service polls the database for records with a `pending` status.
    - Upon finding a job, it would execute the necessary calls to external services like **OpenAI** (for text summarization, topic analysis) and **Pinecone** (for vector embedding storage and similarity searches).

6.  **Updating the Record:**
    - Once the external services return their results, the background processor updates the `AIAnalysis` record in the database.
    - It populates fields like `contentSummary`, `topicCategories`, and `qualityMetrics`.
    - The `processingStatus` is changed to `"completed"`.

7.  **Displaying Results:**
    - When the user views the report, the frontend fetches the associated `AIAnalysis` data. If the status is `completed`, the AI-generated insights are displayed to the user.

This asynchronous, queue-based approach ensures that the user-facing API request remains fast and responsive, while the potentially long-running AI tasks are handled separately.
