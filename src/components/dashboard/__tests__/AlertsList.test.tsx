/**
 * AlertsList Component Tests
 * 
 * Tests for the dashboard alerts list component including:
 * - Rendering with different alert states
 * - Filtering and sorting functionality
 * - Alert actions (resolve, dismiss, view details)
 * - Loading and error states
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertsList } from '../AlertsList';
import * as alertsHooks from '@/hooks/dashboard/use-alerts';

// Mock the alerts hooks
jest.mock('@/hooks/dashboard/use-alerts');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock toast notifications
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUseAlerts = alertsHooks.useAlerts as jest.MockedFunction<
  typeof alertsHooks.useAlerts
>;

const mockUseResolveAlert = alertsHooks.useResolveAlert as jest.MockedFunction<
  typeof alertsHooks.useResolveAlert
>;

// Test wrapper with React Query
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock alert data
const mockAlerts = [
  {
    id: '1',
    title: 'High Risk Domain Detected',
    description: 'Suspicious activity detected on example.com',
    severity: 'high' as const,
    status: 'active' as const,
    createdAt: '2024-01-15T10:30:00Z',
    projectId: 'proj-1',
    projectName: 'Website Monitor',
    type: 'security' as const,
  },
  {
    id: '2',
    title: 'Algorithm Performance Drop',
    description: 'Detection accuracy below threshold',
    severity: 'medium' as const,
    status: 'active' as const,
    createdAt: '2024-01-15T09:15:00Z',
    projectId: 'proj-2',
    projectName: 'Social Media Scan',
    type: 'performance' as const,
  },
  {
    id: '3',
    title: 'Rate Limit Exceeded',
    description: 'API rate limit reached for scanning service',
    severity: 'low' as const,
    status: 'resolved' as const,
    createdAt: '2024-01-14T16:45:00Z',
    projectId: 'proj-1',
    projectName: 'Website Monitor',
    type: 'system' as const,
  },
];

describe('AlertsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseResolveAlert.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseAlerts.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Should show skeleton loaders
      expect(screen.getByTestId('alerts-skeleton')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display alerts correctly', () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Check alert titles
      expect(screen.getByText('High Risk Domain Detected')).toBeInTheDocument();
      expect(screen.getByText('Algorithm Performance Drop')).toBeInTheDocument();
      expect(screen.getByText('Rate Limit Exceeded')).toBeInTheDocument();

      // Check alert descriptions
      expect(screen.getByText('Suspicious activity detected on example.com')).toBeInTheDocument();
      expect(screen.getByText('Detection accuracy below threshold')).toBeInTheDocument();

      // Check project names
      expect(screen.getAllByText('Website Monitor')).toHaveLength(2);
      expect(screen.getByText('Social Media Scan')).toBeInTheDocument();
    });

    it('should show correct severity badges', () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Check severity badges
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should show correct status indicators', () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Check status indicators
      const activeAlerts = screen.getAllByText('Active');
      expect(activeAlerts).toHaveLength(2);
      
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('should format timestamps correctly', () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Should show relative time (e.g., "2 hours ago")
      expect(screen.getByText(/ago/)).toBeInTheDocument();
    });
  });

  describe('Filtering and Sorting', () => {
    it('should filter alerts by severity', async () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Click severity filter
      const severityFilter = screen.getByRole('button', { name: /severity/i });
      await userEvent.click(severityFilter);

      // Select "High" severity
      const highSeverityOption = screen.getByRole('option', { name: /high/i });
      await userEvent.click(highSeverityOption);

      // Should only show high severity alerts
      expect(screen.getByText('High Risk Domain Detected')).toBeInTheDocument();
      expect(screen.queryByText('Algorithm Performance Drop')).not.toBeInTheDocument();
    });

    it('should filter alerts by status', async () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Click status filter
      const statusFilter = screen.getByRole('button', { name: /status/i });
      await userEvent.click(statusFilter);

      // Select "Active" status
      const activeStatusOption = screen.getByRole('option', { name: /active/i });
      await userEvent.click(activeStatusOption);

      // Should only show active alerts
      expect(screen.getByText('High Risk Domain Detected')).toBeInTheDocument();
      expect(screen.getByText('Algorithm Performance Drop')).toBeInTheDocument();
      expect(screen.queryByText('Rate Limit Exceeded')).not.toBeInTheDocument();
    });

    it('should sort alerts by date', async () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Click sort dropdown
      const sortButton = screen.getByRole('button', { name: /sort/i });
      await userEvent.click(sortButton);

      // Select "Oldest First"
      const oldestFirstOption = screen.getByRole('option', { name: /oldest first/i });
      await userEvent.click(oldestFirstOption);

      // Should reorder alerts (oldest first)
      const alertTitles = screen.getAllByTestId('alert-title');
      expect(alertTitles[0]).toHaveTextContent('Rate Limit Exceeded');
    });
  });

  describe('Alert Actions', () => {
    it('should resolve alert when resolve button is clicked', async () => {
      const mockResolve = jest.fn();
      mockUseResolveAlert.mockReturnValue({
        mutate: mockResolve,
        isPending: false,
        error: null,
      });

      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Click resolve button for first alert
      const resolveButtons = screen.getAllByRole('button', { name: /resolve/i });
      await userEvent.click(resolveButtons[0]);

      expect(mockResolve).toHaveBeenCalledWith('1');
    });

    it('should show loading state when resolving alert', () => {
      mockUseResolveAlert.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Should show loading spinner on resolve button
      expect(screen.getByTestId('resolve-loading')).toBeInTheDocument();
    });

    it('should navigate to alert details when alert is clicked', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Click on alert row
      const alertRow = screen.getByTestId('alert-1');
      await userEvent.click(alertRow);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/alerts/1');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no alerts exist', () => {
      mockUseAlerts.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      expect(screen.getByText(/no alerts found/i)).toBeInTheDocument();
      expect(screen.getByText(/create your first project/i)).toBeInTheDocument();
    });

    it('should show empty state when filters return no results', async () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Apply filter that returns no results
      const statusFilter = screen.getByRole('button', { name: /status/i });
      await userEvent.click(statusFilter);

      const dismissedStatusOption = screen.getByRole('option', { name: /dismissed/i });
      await userEvent.click(dismissedStatusOption);

      expect(screen.getByText(/no alerts match your filters/i)).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch alerts');
      mockUseAlerts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load alerts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', async () => {
      const mockRefetch = jest.fn();
      const mockError = new Error('Network error');
      
      mockUseAlerts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Check for table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(4); // Header + 3 alerts

      // Check for column headers
      expect(screen.getByRole('columnheader', { name: /alert/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /severity/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /project/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /created/i })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /severity/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /status/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /sort/i })).toHaveFocus();
    });

    it('should announce filter changes to screen readers', async () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Check for live region
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt table layout for mobile screens', () => {
      mockUseAlerts.mockReturnValue({
        data: mockAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <AlertsList />
        </Wrapper>
      );

      // Check for responsive classes
      const table = container.querySelector('table');
      expect(table).toHaveClass('min-w-full');
      
      // Check for mobile-specific layout
      const mobileCards = container.querySelectorAll('.md\\:hidden');
      expect(mobileCards.length).toBeGreaterThan(0);
    });
  });
});