**Prompt for Gemini Agentic Coder:**

**Objective:**  
You are an expert technical documentation specialist. Your task is to systematically document the LinkShield project, focusing on user workflows, authentication/authorization flows, subscription plans, payment integration, and how these components interconnect. The documentation should be saved in the existing `docs` folder on a Windows system.

**Project Context:**  
LinkShield is a web-based tool that provides instant security and health reports for URLs. It includes user management, subscription plans, payment processing, and AI-powered features. Key technologies include Next.js 14, PlanetScale/Postgres, Next-Auth.js, Stripe, and OpenAI/Pinecone for AI features.

**Specific Instructions:**

1. **Systematic Documentation Structure:**  
   - Create a comprehensive set of documents in the `docs` folder.  
   - Use clear, hierarchical Markdown files.  
   - Include diagrams where necessary (e.g., Mermaid.js for workflows).  

2. **Focus Areas:**  
   - **User Workflows:** From report creation to making reports public.  
   - **Authentication & Authorization:** How Next-Auth.js is integrated, role-based access, and session management.  
   - **Subscription Plans:** Details of Free, Pro, and Enterprise plans, including limits and features.  
   - **Payment Integration:** How Stripe handles checkout, webhooks, and subscription management.  
   - **AI Features:** How AI analysis ties into user plans and limitations.  

3. **Windows Compatibility:**  
   - Ensure all commands and paths are Windows-friendly (e.g., use `\` for paths).  
   - Use tools available on Windows (e.g., PowerShell commands).  

4. **Output Structure:**  
   - Save all files in `docs\` with meaningful names.  
   - Include a `README.md` in `docs` that serves as an index.  

5. **Diagrams and Visuals:**  
   - Use Mermaid.js for flowcharts and sequence diagrams.  
   - Create architecture diagrams to show component interactions.  

6. **Code References:**  
   - Reference actual code files where appropriate (e.g., `lib/auth.ts` for auth logic).  
   - Highlight environment variables and configuration needs.  

7. **User Journey Emphasis:**  
   - Map out the entire user journey: signing up, using free checks, upgrading, accessing AI features, and sharing reports.  
   - Include error states and edge cases (e.g., plan limits exceeded).  

8. **Security and Compliance:**  
   - Document how user data and payments are secured.  
   - Include GDPR/compliance considerations if applicable.  

**Expected Deliverables in `docs/`:**  
- `user_workflows.md`: Detailed user flows from report creation to sharing.  
- `auth_flow.md`: Authentication and authorization mechanisms.  
- `subscriptions_plans.md`: Plan details, limits, and how they are enforced.  
- `payments_integration.md`: Stripe integration, webhooks, and subscription management.  
- `ai_features.md`: How AI features are gated by plans and integrated.  
- `architecture.md`: High-level system architecture.  
- `api_reference.md`: Key API endpoints and their purposes.  
- `env_variables.md`: Required environment variables and their roles.  
- `compliance_security.md`: Security measures and compliance notes.  
- `README.md`: Index file linking to all documents.  

**Tools to Use:**  
- Mermaid.js for diagrams.  
- Markdown for documentation.  
- PowerShell for any command examples.  

**Note:** The `docs` folder already exists. Ensure all file paths are correct for Windows. Use absolute paths if necessary (e.g., `C:\projects\linkshield\docs\`).  
