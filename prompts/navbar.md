I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

### Observations

The LinkShield app currently has **no top navigation bar**. The root layout is minimal with just providers, and pages go directly into content. The app uses:
- Next.js 15 with App Router
- Tailwind CSS with `darkMode: ['class']` configuration
- shadcn/ui components (dropdown-menu, avatar, button, etc.)
- Zustand stores: `authStore` (user, isAuthenticated) and `uiStore` (theme state)
- Existing auth hooks: `useLogout`, `useAuth`

The profile page at `/dashboard/profile` already exists with account info, subscription details, and personal information. However, there's **no dedicated Settings page** for preferences like notification settings, data export, account deletion, etc.

**Pages for Docs/Pricing/Features don't exist yet** - these will need to be created or linked externally.

The theme is managed in `uiStore` but **not connected to the DOM** - the `dark` class needs to be applied to `<html>` element based on theme state.


### Approach

## Implementation Strategy

**1. Create Theme Provider Component**
Build a client-side theme provider that syncs `uiStore.theme` with the `<html>` element's `dark` class, enabling Tailwind's dark mode.

**2. Build Top Navigation Bar Component**
Create a responsive `TopNav` component with:
- Left section: Brand logo/link + navigation links (Home, Docs, Pricing, Features)
- Right section: Theme toggle, notifications (for authenticated users), user profile dropdown (authenticated) or Login/Register buttons (anonymous)

**3. Integrate Navigation into Root Layout**
Update `src/app/layout.tsx` to include the `TopNav` component and theme provider, wrapping all pages.

**4. Create Settings Page**
Build `/dashboard/settings` page with tabs for:
- General preferences (timezone, language)
- Notifications preferences
- Security (password change, sessions)
- Account management (data export, delete account)

**5. Create Placeholder Pages**
Add basic pages for Docs, Pricing, and Features/Services routes.

**6. Update Dashboard Layout**
Ensure dashboard layout doesn't conflict with the new top nav and maintains proper spacing.

This approach keeps the navigation global while respecting the existing authentication flow and dashboard structure.


### Reasoning

I explored the project structure and identified it as a Next.js 15 app with App Router. I examined the root layout, homepage, dashboard layout, and profile page to understand the current navigation state (none exists). I reviewed the `authStore` and `uiStore` to understand state management, checked the `AuthProvider` for auth initialization, and reviewed the Tailwind config to confirm dark mode is configured with class-based switching. I also examined the profile-settings and dashboard requirements specs to understand the intended features and navigation structure. Finally, I verified that Docs, Pricing, and Features pages don't exist yet.


## Mermaid Diagram

sequenceDiagram
    participant User
    participant Browser
    participant TopNav
    participant ThemeProvider
    participant AuthStore
    participant UiStore
    participant API

    User->>Browser: Loads App
    Browser->>ThemeProvider: Initialize
    ThemeProvider->>UiStore: Read theme state
    UiStore-->>ThemeProvider: Returns 'light' or 'dark'
    ThemeProvider->>Browser: Apply 'dark' class to <html>
    
    Browser->>TopNav: Render Navigation
    TopNav->>AuthStore: Check isAuthenticated
    
    alt User is Authenticated
        AuthStore-->>TopNav: isAuthenticated = true
        TopNav->>User: Show Profile Dropdown + Theme Toggle
        User->>TopNav: Click Profile Dropdown
        TopNav->>User: Show Dashboard/Settings/Profile/Logout
        User->>TopNav: Click Settings
        TopNav->>Browser: Navigate to /dashboard/settings
    else User is Anonymous
        AuthStore-->>TopNav: isAuthenticated = false
        TopNav->>User: Show Login/Register Buttons
        User->>TopNav: Click Login
        TopNav->>Browser: Navigate to /login
    end
    
    User->>TopNav: Click Theme Toggle
    TopNav->>UiStore: setTheme('dark' or 'light')
    UiStore->>ThemeProvider: Theme state updated
    ThemeProvider->>Browser: Toggle 'dark' class on <html>
    Browser->>User: UI updates to new theme
    
    User->>Browser: Navigate to /dashboard/settings
    Browser->>API: GET /user/profile
    API-->>Browser: Return user preferences
    Browser->>User: Display Settings Page
    User->>Browser: Update notification preferences
    Browser->>API: PUT /user/profile
    API-->>Browser: Success
    Browser->>User: Show success toast

## Proposed File Changes

### \src\components\layout\ThemeProvider.tsx(NEW)

References: 

- src\stores\uiStore.ts

Create a client-side theme provider component that:

1. Uses `useEffect` to read `uiStore.theme` state
2. Applies/removes the `dark` class to the `<html>` element based on theme state
3. Listens for theme changes from `uiStore` and updates the DOM accordingly
4. Handles initial theme application on mount (reads from uiStore which persists to localStorage)
5. Exports a `ThemeProvider` component that wraps children

This component bridges the gap between Zustand state management and Tailwind's class-based dark mode. It should be a simple wrapper that doesn't render any UI, just manages the theme class on the document element.

### \src\components\layout\TopNav.tsx(NEW)

References: 

- src\stores\authStore.ts
- src\stores\uiStore.ts
- src\hooks\auth\use-auth-mutations.ts
- src\components\ui\dropdown-menu.tsx
- src\components\ui\avatar.tsx
- src\components\ui\button.tsx
- src\components\ui\sheet.tsx

Create the main top navigation bar component with the following structure:

**Layout:**
- Fixed top position with backdrop blur and border bottom
- Container with max-width and horizontal padding
- Flexbox layout with space-between for left and right sections
- Responsive design (mobile hamburger menu for small screens)

**Left Section:**
- Brand logo/name "LinkShield" as a link to `/` (homepage)
- Navigation links: Home (`/`), Docs (`/docs`), Pricing (`/pricing`), Features (`/features`)
- On mobile: collapse into hamburger menu

**Right Section:**
- Theme toggle button (Sun/Moon icons from lucide-react)
- Notifications bell icon (only when authenticated) - placeholder for now, will be implemented later
- Conditional rendering based on `useAuthStore` isAuthenticated:
  - **If NOT authenticated:** Show "Login" and "Register" buttons linking to `/login` and `/register`
  - **If authenticated:** Show user profile dropdown menu

**User Profile Dropdown (when authenticated):**
- Trigger: Avatar component with user initials or profile picture
- Dropdown content using `DropdownMenu` from shadcn/ui:
  - Header: User name and email
  - Separator
  - Menu items:
    - Dashboard (link to `/dashboard`)
    - Profile (link to `/dashboard/profile`)
    - Settings (link to `/dashboard/settings`)
    - Separator
    - Logout (calls `useLogout` hook)

**Theme Toggle:**
- Button that reads current theme from `useUiStore`
- Toggles between 'light' and 'dark' by calling `setTheme`
- Shows Sun icon in dark mode, Moon icon in light mode
- Includes tooltip for accessibility

**Mobile Responsiveness:**
- Use Sheet component from shadcn/ui for mobile menu
- Hamburger icon (Menu from lucide-react) visible on small screens
- Navigation links stack vertically in mobile menu
- User actions remain in header on mobile

Use Tailwind classes for styling, maintain consistency with existing design system (bg-background, text-foreground, border-border, etc.).

### \src\components\layout\index.ts(NEW)

Create a barrel export file for layout components:

```typescript
export { TopNav } from './TopNav';
export { ThemeProvider } from './ThemeProvider';
```

This provides a clean import path for layout components used throughout the app.

### \src\app\layout.tsx(NEW)

References: 

- src\components\layout\TopNav.tsx
- src\components\layout\ThemeProvider.tsx
- src\components\providers\Providers.tsx
- src\components\auth\AuthProvider.tsx

Update the root layout to include the top navigation bar and theme provider:

1. Import `TopNav` and `ThemeProvider` from `@/components/layout`
2. Wrap the existing `Providers` and `AuthProvider` with the new `ThemeProvider` component
3. Add the `TopNav` component before `{children}` inside the body
4. Wrap `{children}` in a `<main>` element with appropriate padding-top to account for the fixed navigation bar (e.g., `pt-16` or `pt-20`)
5. Add `min-h-screen` class to main element to ensure full viewport height

The structure should be:
```
<html>
  <body>
    <Providers>
      <ThemeProvider>
        <AuthProvider>
          <TopNav />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </ThemeProvider>
    </Providers>
  </body>
</html>
```

Ensure the layout remains a server component where possible, with client components (TopNav, ThemeProvider) properly marked with 'use client'.

### \src\app\dashboard\layout.tsx(NEW)

References: 

- src\components\auth\RequireAuth.tsx
- src\app\layout.tsx

Update the dashboard layout to work with the new top navigation:

1. Remove or adjust any top padding that might conflict with the global nav
2. Keep the `RequireAuth` wrapper for authentication protection
3. Adjust the container padding to ensure proper spacing below the top nav
4. The layout should remain minimal since the top nav is now global
5. Consider adding a max-width container if needed for dashboard content

The dashboard layout should focus on providing the dashboard-specific wrapper (authentication check and background styling) without duplicating navigation elements.

### \src\app\dashboard\settings(NEW)

Create a directory for the settings page.

### \src\app\dashboard\settings\page.tsx(NEW)

References: 

- src\app\dashboard\profile\page.tsx
- src\components\auth\ChangePasswordModal.tsx
- src\hooks\auth\use-profile.ts
- src\hooks\auth\use-profile-mutations.ts
- src\components\ui\tabs.tsx
- src\components\ui\switch.tsx
- src\components\ui\card.tsx
- src\components\ui\button.tsx
- src\components\ui\select.tsx
- src\components\ui\alert-dialog.tsx

Create a comprehensive settings page with tabbed interface:

**Page Structure:**
- Page title: "Settings"
- Use `Tabs` component from shadcn/ui for different settings sections
- Tabs: General, Notifications, Security, Account

**General Tab:**
- Timezone selector (dropdown with common timezones)
- Language selector (dropdown with supported languages: English, Spanish, French, etc.)
- Marketing consent toggle
- Save button that calls `PUT /api/v1/user/profile` via profile update mutation
- Show success toast on save

**Notifications Tab:**
- Section title: "Email Notifications"
- Toggle switches for different notification types:
  - Security Alerts (with warning if disabled)
  - URL Check Results
  - Team Invitations
  - Product Updates
  - Marketing Emails
- Each toggle should update immediately via API call
- Use `Switch` component from shadcn/ui

**Security Tab:**
- Section: "Password"
  - Button to open Change Password modal (reuse `ChangePasswordModal` component)
  - Last password change date (if available)
- Section: "Active Sessions"
  - Link to `/dashboard/sessions` page
  - Show count of active sessions
- Section: "Two-Factor Authentication" (placeholder for future)
  - Status badge (Enabled/Disabled)
  - Setup button (disabled with "Coming soon" tooltip)

**Account Tab:**
- Section: "Data Management"
  - Export Data button - opens modal to select data types (Profile, URL Checks, AI Analyses, Reports) and format (JSON, CSV)
  - Triggers download when ready
- Section: "Danger Zone"
  - Delete Account button (red/destructive variant)
  - Opens confirmation dialog requiring typing "DELETE" to confirm
  - Shows warning about data deletion and subscription cancellation requirement
  - Calls `DELETE /api/v1/user/account` on confirmation

**Data Loading:**
- Use `useProfile` hook to load current user settings
- Show loading skeletons while data is fetching
- Handle error states with retry option

**Form Handling:**
- Track unsaved changes and show confirmation dialog if user navigates away
- Debounce form inputs (300ms) before enabling save button
- Use React Hook Form for form validation if needed

Style with Card components for each section, maintain consistency with existing dashboard pages like the profile page.

### \src\app\docs(NEW)

Create a directory for the documentation page.

### \src\app\docs\page.tsx(NEW)

References: 

- src\components\ui\card.tsx
- src\components\ui\button.tsx
- docs\API_REFERENCE.md
- docs\USER_GUIDE.md

Create a documentation page with:

**Page Structure:**
- Hero section with title "Documentation" and subtitle
- Grid layout with documentation categories

**Documentation Categories (as cards):**
1. **Getting Started**
   - Quick start guide
   - Installation
   - First URL scan
   - Link to `/docs/getting-started` (future)

2. **API Reference**
   - API endpoints
   - Authentication
   - Rate limits
   - Link to existing `docs/API_REFERENCE.md` content or `/docs/api` (future)

3. **Features**
   - URL scanning
   - Social protection
   - Dashboard features
   - Link to `/docs/features` (future)

4. **Guides**
   - Integration guides
   - Best practices
   - Troubleshooting
   - Link to `/docs/guides` (future)

**Styling:**
- Use Card components for each category
- Include icons from lucide-react (Book, Code, Shield, FileText)
- Responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)
- Add hover effects for interactivity

**Content:**
- For now, create a landing page with placeholders
- Link to existing documentation in the `/docs` folder where applicable
- Add a note that detailed documentation is coming soon

This provides a foundation for future documentation expansion while giving users a clear entry point.

### \src\app\pricing(NEW)

Create a directory for the pricing page.

### \src\app\pricing\page.tsx(NEW)

References: 

- src\stores\authStore.ts
- src\components\ui\card.tsx
- src\components\ui\button.tsx
- src\components\ui\badge.tsx
- src\components\ui\switch.tsx
- src\app\dashboard\profile\page.tsx

Create a pricing page with subscription tiers:

**Page Structure:**
- Hero section with title "Choose Your Plan" and subtitle about protecting your digital presence
- Pricing toggle for Monthly/Annual billing (with "Save 20%" badge for annual)
- Grid of pricing cards (3 tiers)

**Pricing Tiers:**

1. **Free Tier**
   - Price: $0/month
   - Features:
     - 10 URL checks per day
     - Basic threat detection
     - Email support
     - Community access
   - CTA: "Get Started" (links to `/register`)

2. **Pro Tier** (Popular badge)
   - Price: $29/month or $279/year
   - Features:
     - 500 URL checks per day
     - Advanced threat detection
     - Social media monitoring
     - API access (1000 calls/day)
     - Priority email support
     - Browser extension
   - CTA: "Start Free Trial" or "Upgrade" (if authenticated)

3. **Enterprise Tier**
   - Price: Custom pricing
   - Features:
     - Unlimited URL checks
     - Advanced AI analysis
     - Social media bots
     - Dedicated API access
     - 24/7 phone support
     - Custom integrations
     - SLA guarantee
   - CTA: "Contact Sales"

**Additional Sections:**
- FAQ section with common pricing questions
- Feature comparison table
- Trust badges (money-back guarantee, secure payment, etc.)

**Styling:**
- Use Card components for pricing tiers
- Highlight the "Pro" tier with border accent or shadow
- Use Check icons from lucide-react for feature lists
- Responsive grid (1 column mobile, 3 columns desktop)
- Add smooth hover effects

**Interactivity:**
- Check authentication state with `useAuthStore`
- Show different CTAs for authenticated vs anonymous users
- For authenticated users on Free plan, show "Upgrade" button
- For authenticated users on paid plans, show "Manage Subscription"

This provides a clear pricing structure aligned with the subscription system mentioned in the profile page.

### \src\app\features(NEW)

Create a directory for the features page.

### \src\app\features\page.tsx(NEW)

References: 

- src\stores\authStore.ts
- src\components\ui\card.tsx
- src\components\ui\button.tsx
- src\components\ui\badge.tsx
- src\app\page.tsx

Create a comprehensive features showcase page:

**Page Structure:**
- Hero section with title "Powerful Features for Complete Protection" and subtitle
- Feature sections with alternating layouts (image left/right)

**Feature Sections:**

1. **URL Security Analysis**
   - Icon: Shield from lucide-react
   - Description: Multi-provider threat detection with real-time analysis
   - Key points:
     - Scan any URL instantly
     - Multiple security providers (VirusTotal, Google Safe Browsing, etc.)
     - Risk scoring and detailed reports
     - Historical tracking

2. **Social Media Protection**
   - Icon: Users from lucide-react
   - Description: Monitor and protect your social media presence
   - Key points:
     - Platform monitoring (Twitter, Facebook, Instagram, LinkedIn)
     - Content analysis
     - Algorithm health tracking
     - Crisis detection and alerts

3. **AI-Powered Analysis**
   - Icon: Brain from lucide-react
   - Description: Advanced AI algorithms for content and threat analysis
   - Key points:
     - Content verification
     - Misinformation detection
     - Sentiment analysis
     - Automated recommendations

4. **Browser Extension**
   - Icon: Chrome from lucide-react
   - Description: Real-time protection while you browse
   - Key points:
     - Automatic URL scanning
     - Threat blocking
     - Privacy protection
     - Seamless integration

5. **API Integration**
   - Icon: Code from lucide-react
   - Description: Integrate LinkShield into your applications
   - Key points:
     - RESTful API
     - Comprehensive documentation
     - Webhooks support
     - Rate limiting and quotas

6. **Dashboard & Analytics**
   - Icon: BarChart from lucide-react
   - Description: Comprehensive insights and reporting
   - Key points:
     - Real-time monitoring
     - Custom reports
     - Team collaboration
     - Export capabilities

**Additional Sections:**
- "Why Choose LinkShield?" with key differentiators
- Integration showcase (logos of supported platforms)
- CTA section: "Ready to get started?" with sign-up button

**Styling:**
- Use Card components for feature highlights
- Alternating layout for visual interest
- Icons with gradient backgrounds
- Responsive design (stack on mobile, side-by-side on desktop)
- Add animations on scroll (optional, using Intersection Observer)

**Interactivity:**
- Link feature sections to relevant documentation
- CTA buttons link to `/register` for anonymous users or `/dashboard` for authenticated users
- Include demo videos or screenshots (placeholders for now)

This page serves as a comprehensive overview of LinkShield's capabilities, helping users understand the value proposition.

### \src\app\page.tsx(NEW)

References: 

- src\stores\authStore.ts
- src\app\layout.tsx
- src\components\homepage\HeroSection.tsx

Update the homepage to work with the new top navigation:

1. Remove any duplicate navigation elements if present
2. Adjust the top padding/margin of the first section (Hero) to account for the fixed top nav
3. Update the authentication check to use `useAuthStore` instead of the hardcoded `isAuthenticated = false`
4. Ensure the page flows naturally below the top navigation bar
5. The main content structure should remain the same (Hero, URL Checker, Results, Features, etc.)

The homepage should now benefit from the global navigation without needing its own nav implementation.

### \src\components\ui\sheet.tsx(NEW)

References: 

- src\components\ui\dialog.tsx
- src\components\ui\button.tsx
- src\lib\utils.ts

Create a Sheet component (mobile drawer/modal) using Radix UI primitives:

1. Install or verify `@radix-ui/react-dialog` is available (it should be based on package.json)
2. Create a Sheet component that uses Dialog primitives but styled as a slide-in panel
3. Export the following components:
   - `Sheet` (root)
   - `SheetTrigger`
   - `SheetContent` (with variants for side: left, right, top, bottom)
   - `SheetHeader`
   - `SheetTitle`
   - `SheetDescription`
   - `SheetFooter`
   - `SheetClose`

4. Style with Tailwind classes:
   - Overlay with backdrop blur
   - Content slides in from specified side
   - Animations using tailwindcss-animate
   - Responsive width (full width on mobile, fixed width on desktop)

5. Follow the same pattern as other shadcn/ui components in the project

This component is needed for the mobile navigation menu in the TopNav component. If the component already exists in the UI folder, skip this step.

### \src\hooks\settings\use-settings.ts(NEW)

References: 

- src\hooks\auth\use-auth-mutations.ts
- src\hooks\auth\use-profile.ts
- src\services\auth.service.ts
- src\stores\authStore.ts

Create custom hooks for settings management:

**Hook: `useNotificationPreferences`**
- Fetches user notification preferences from profile
- Returns preferences object with toggles for each notification type
- Provides loading and error states

**Hook: `useUpdateNotificationPreferences`**
- Mutation hook to update notification preferences
- Calls `PUT /api/v1/user/profile` with updated preferences
- Shows success/error toasts
- Invalidates profile query on success

**Hook: `useExportData`**
- Mutation hook to export user data
- Calls `POST /api/v1/user/export-data` with selected data types and format
- Triggers file download when ready
- Shows progress indicator
- Handles errors with retry option

**Hook: `useDeleteAccount`**
- Mutation hook to delete user account
- Calls `DELETE /api/v1/user/account`
- Clears auth state on success
- Redirects to homepage
- Shows confirmation and warning messages

These hooks encapsulate the settings-related API calls and state management, following the same pattern as existing auth hooks in `src/hooks/auth/use-auth-mutations.ts`.

### \src\hooks\settings\index.ts(NEW)

Create a barrel export file for settings hooks:

```typescript
export { useNotificationPreferences, useUpdateNotificationPreferences } from './use-settings';
export { useExportData, useDeleteAccount } from './use-settings';
```

This provides clean import paths for settings hooks used in the settings page.

### \src\types\settings.types.ts(NEW)

References: 

- src\types\auth.types.ts
- src\types\user.types.ts

Create TypeScript types for settings-related data:

**NotificationPreferences interface:**
- `security_alerts: boolean`
- `url_check_results: boolean`
- `team_invitations: boolean`
- `product_updates: boolean`
- `marketing_emails: boolean`

**ExportDataRequest interface:**
- `data_types: string[]` (e.g., ['profile', 'url_checks', 'ai_analyses', 'reports'])
- `format: 'json' | 'csv'`

**ExportDataResponse interface:**
- `download_url: string`
- `expires_at: string`
- `file_size: number`

**DeleteAccountRequest interface:**
- `confirmation: string` (must be "DELETE")
- `reason?: string` (optional feedback)

These types ensure type safety for settings-related API calls and component props.