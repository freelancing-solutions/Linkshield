Here's a structured prompt for an agentic environment to systematically debug and fix the dashboard integration issues:

---

# Dashboard Integration Debug & Fix Task

## Objective
Fix the LinkShield dashboard panel integration where some panels are not displaying data and others are missing entirely. Ensure all dashboard APIs properly integrate with the frontend dashboard component.

## Current System Architecture

### Dashboard APIs (Backend)
- `/api/dashboard/[id]` - Deletes the report
- `/api/dashboard/stats` - Returns user statistics and plan info
- `/api/dashboard/history` - Returns user's URL check history with pagination
- `/api/dashboard/shareable-reports` - Returns user's shareable reports
- `/api/dashboard/reports/[id]` - DELETE endpoint for report manipulation
- `/api/dashboard/recent-reports` - Returns recently created reports (status unknown)

### Frontend Dashboard
- Location: `src/app/dashboard/page.tsx`
- Uses `fetchDashboardData()` method to fetch all dashboard APIs
- Should display: Stats cards, History table, Shareable reports table, Analytics placeholders

## Known Issues
1. History panel not displaying data despite API working
2. Some panels completely missing from UI
3. Inconsistent API response formats causing data extraction failures
4. Unknown status of recent-reports API

## Investigation Steps

### Step 1: API Response Format Audit
- Verify each API endpoint's response structure
- Ensure consistency across all dashboard APIs
- Document expected vs actual response formats

### Step 2: Frontend Data Flow Analysis
- Examine `fetchDashboardData()` method in dashboard component
- Identify where data extraction is failing
- Check state management and error handling

### Step 3: Panel Visibility Debug
- Audit dashboard JSX to identify missing panels
- Verify conditional rendering logic
- Check for JavaScript errors preventing panel display

### Step 4: Integration Testing
- Test each API endpoint individually
- Verify data flows from API to frontend state
- Confirm UI renders correctly with mock data

## Success Criteria
- [ ] All dashboard panels visible and functional
- [ ] History table displays user's check history
- [ ] Stats cards show accurate usage information
- [ ] Shareable reports table allows privacy toggle and deletion
- [ ] No console errors during dashboard load
- [ ] Consistent API response format across all endpoints

## Deliverables
1. Fixed dashboard component with proper data handling
2. Standardized API response format documentation
3. Integration test verification for each panel
4. Error handling implementation for failed API calls

## Technical Context
- Next.js 15.3.5 application
- Prisma ORM with PostgreSQL
- NextAuth for authentication
- TypeScript with strict type checking
- API routes return either direct data or `{ success: boolean, data: any }` format

Execute this task systematically, fixing one panel at a time and ensuring each works before moving to the next.