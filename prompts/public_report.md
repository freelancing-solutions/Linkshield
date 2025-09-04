Of course. This is a crucial feature that adds significant value for paid users by allowing them to contribute to and benefit from the community's threat intelligence. Let's refactor the prompt to integrate this new requirement seamlessly.

Here is the final, comprehensive, and unambiguous prompt.

---

### **Refined & Solid Prompt: LinkShield Public & Premium Features with Shareable Reports**

**Project:** Enhance LinkShield to include public single-url analysis, a premium project-based monitoring suite, and the ability for premium users to publicly share their advanced scan reports.

---

### **1. Core User Stories**

#### **Public User (Not Logged In)**
*   **As a public user,** I can submit a single URL on the main test screen for a standard security analysis.
*   **As a public user,** I view the results of the standard scan on a public report page that includes social sharing buttons.
*   **As a public user,** I can browse a "Recent Public Reports" feed to see analyses shared by other users.

#### **Premium User (Logged In & Paid)**
*   **As a premium user,** I can create a private "Project" tied to a verified domain for advanced, continuous monitoring.
*   **As a premium user,** I can run advanced scans on my project's URLs and view detailed, private results.
*   **As a premium user,** I have a toggle to **change the visibility of any of my project's scan results** from "Private" to "Public".
*   **As a premium user,** when I make a report public, it appears in the "Recent Public Reports" feed, attributing the findings to my project (and potentially my username) to build reputation.
*   **As a premium user,** I can configure email alerts for my private projects.

---

### **2. Detailed Technical Specifications & Flow**

#### **A. Public URL Analysis & Reporting**
1.  **Public Scan Submission:**
    *   The homepage form triggers a **standard scan**.
    *   The result is saved to a `PublicScan` table (see schema below).

2.  **Public Report Page:**
    *   Results are displayed on a page with a URL like `/report/<public_share_id>`.
    *   This page includes **social media sharing buttons**.

3.  **Recent Public Reports Feed:**
    *   A page (`/public-reports`) aggregates scans from two sources:
        *   `PublicScan` records (from anonymous users).
        *   `ScanResult` records where `is_public = True` (from premium users).

#### **B. Premium Project-Based Analysis (Gated)**
1.  **Access Control:** All project features are behind a paywall. Check `user.is_premium == True`.

2.  **Verification & Scanning:** The process for creating a project, verifying domain ownership via meta tag, adding URLs, and running scans remains unchanged from the previous prompt. All `ScanResult` records are created as **private by default**.

3.  **The New "Public Toggle" Feature:**
    *   In the UI for viewing a `ScanResult` (e.g., a modal or page), premium users see a toggle switch labeled "Make this report public" or similar.
    *   **System Action:** Toggling this on updates a new `is_public` field on the `ScanResult` model to `True`.
    *   **Data Syndication:** Once public, the system should generate a `public_share_id` for that specific `ScanResult` (if it doesn't have one) and syndicate it to the **Recent Public Reports** feed.
    *   **Attribution:** The public feed entry should clearly indicate it was found by a "Verified Project" or display the user's username/public profile name to add credibility and incentivize sharing.

4.  **Reverting Privacy:**
    *   The user must be able to toggle the report back to private (`is_public = False`), which should remove it from the public feed.

---

### **3. Data Model & Logic Separation (Critical)**

The agent must implement this data model to cleanly manage the different report types and their visibility.

| Feature | Anonymous Public Scan | Premium Private Scan | Premium Public Scan |
| :--- | :--- | :--- | :--- |
| **Trigger** | Homepage form | Project Scan | User toggles visibility |
| **Primary Table** | `PublicScan` | `ScanResult` | `ScanResult` |
| **Visibility Default** | Public | **Private** | Public (after toggle) |
| **Scan Type** | Standard | **Advanced** | **Advanced** |
| **In Public Feed** | Yes | **No** | **Yes** |
| **Attribution** | "Anonymous" | N/A | "Verified Project: [Domain]" |

**Required Database Models:**
1.  **PublicScan:** `id, url, scan_date, result_data, public_share_id` (For anonymous scans)
2.  **Project:** `id, user_id, name, domain, is_verified, verification_token, monitoring_frequency`
3.  **ProjectUrl:** `id, project_id, url, added_at, is_active`
4.  **ScanResult:** `id, url_id, scan_date, is_clean, threat_type, details, is_public (Boolean), public_share_id (String, nullable)` <-- **NEW FIELDS**

*(The `public_share_id` in `ScanResult` allows a premium user's public report to have a unique, shareable URL just like an anonymous report, e.g., `https://linkshield.site/report/abc123`.)*

---

### **4. Important Considerations & Assumptions**

*   **Double Opt-In for Sharing:** Making a report public should be an explicit, intentional action. A confirmation dialog is recommended after flipping the toggle to prevent accidental exposure of potentially sensitive scan results.
*   **Data Sanitization:** Before a `ScanResult` is made public, ensure the `details` JSON does not contain any sensitive information about the user's project or infrastructure that was gathered during the advanced scan.
*   **Attribution Logic:** Decide how to attribute shared reports. Will it show the project's domain (`example.com`)? The user's username? A combination? This should be configurable in user privacy settings.
*   **Revoking Access:** The `/report/<public_share_id>` route must check the `is_public` flag on the `ScanResult` table before showing details. If toggled back to private, the page should show a "Report is no longer public" message.

This refactored prompt provides a complete blueprint for building a sophisticated system that values privacy, incentivizes premium features, and fosters a community-driven threat intelligence platform.
