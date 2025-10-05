/**
 * SessionsTable Component Tests
 * 
 * Tests for the sessions table component including:
 * - Session data display and formatting
 * - Sorting and filtering functionality
 * - Pagination and data loading
 * - Session actions (view details, terminate)
 * - Real-time session updates
 * - Accessibility and responsive design
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionsTable } from '../SessionsTable';
import * as sessionHooks from '@/hooks/dashboard/use-sessions';
import * as authHooks from '@/hooks/use-auth';

// Mock the hooks
jest.mock('@/hooks/dashboard/use-sessions');
jest.mock('@/hooks/use-auth');
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
    loading: jest.fn(),
  },
}));

const mockUseSessions = sessionHooks.useSessions as jest.MockedFunction<
  typeof sessionHooks.useSessions
>;

const mockUseTerminateSession = sessionHooks.useTerminateSession as jest.MockedFunction<
  typeof sessionHooks.useTerminateSession
>;

const mockUseAuth = authHooks.useAuth as jest.MockedFunction<
  typeof authHooks.useAuth
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

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin' as const,
  permissions: ['view_sessions', 'manage_sessions'],
};

// Mock sessions data
const mockSessions = [
  {
    id: 'session-1',
    userId: 'user-123',
    userEmail: 'john.doe@example.com',
    userName: 'John Doe',
    deviceType: 'desktop',
    browser: 'Chrome',
    browserVersion: '120.0.0.0',
    os: 'Windows',
    osVersion: '11',
    ipAddress: '192.168.1.100',
    location: {
      country: 'United States',
      city: 'New York',
      region: 'NY',
    },
    startTime: '2024-01-15T09:00:00Z',
    lastActivity: '2024-01-15T10:30:00Z',
    duration: 5400, // 1.5 hours in seconds
    status: 'active' as const,
    activities: {
      scansPerformed: 12,
      threatsBlocked: 3,
      sitesVisited: 45,
      dataTransferred: 2.5, // MB
    },
    security: {
      riskLevel: 'low' as const,
      vpnUsed: false,
      suspiciousActivity: false,
      authMethod: 'password',
    },
    isCurrent: true,
  },
  {
    id: 'session-2',
    userId: 'user-456',
    userEmail: 'jane.smith@example.com',
    userName: 'Jane Smith',
    deviceType: 'mobile',
    browser: 'Safari',
    browserVersion: '17.2',
    os: 'iOS',
    osVersion: '17.2',
    ipAddress: '10.0.0.50',
    location: {
      country: 'Canada',
      city: 'Toronto',
      region: 'ON',
    },
    startTime: '2024-01-15T08:15:00Z',
    lastActivity: '2024-01-15T10:25:00Z',
    duration: 7800, // 2.17 hours in seconds
    status: 'active' as const,
    activities: {
      scansPerformed: 8,
      threatsBlocked: 1,
      sitesVisited: 23,
      dataTransferred: 1.2,
    },
    security: {
      riskLevel: 'medium' as const,
      vpnUsed: true,
      suspiciousActivity: false,
      authMethod: '2fa',
    },
    isCurrent: false,
  },
  {
    id: 'session-3',
    userId: 'user-789',
    userEmail: 'bob.wilson@example.com',
    userName: 'Bob Wilson',
    deviceType: 'desktop',
    browser: 'Firefox',
    browserVersion: '121.0',
    os: 'Linux',
    osVersion: 'Ubuntu 22.04',
    ipAddress: '203.0.113.45',
    location: {
      country: 'United Kingdom',
      city: 'London',
      region: 'England',
    },
    startTime: '2024-01-15T07:30:00Z',
    lastActivity: '2024-01-15T09:45:00Z',
    duration: 8100, // 2.25 hours in seconds
    status: 'expired' as const,
    activities: {
      scansPerformed: 15,
      threatsBlocked: 5,
      sitesVisited: 67,
      dataTransferred: 4.1,
    },
    security: {
      riskLevel: 'high' as const,
      vpnUsed: false,
      suspiciousActivity: true,
      authMethod: 'password',
    },
    isCurrent: false,
  },
];

const mockPaginatedSessions = {
  data: mockSessions,
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
    hasNext: true,
    hasPrev: false,
  },
};

describe('SessionsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    mockUseTerminateSession.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseSessions.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      expect(screen.getByTestId('sessions-table-skeleton')).toBeInTheDocument();
    });
  });

  describe('Sessions Display', () => {
    it('should display sessions data in table format', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check table headers
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Device')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Risk Level')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Check session data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should display device information correctly', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check device info
      expect(screen.getByText('Chrome 120.0.0.0')).toBeInTheDocument();
      expect(screen.getByText('Windows 11')).toBeInTheDocument();
      expect(screen.getByText('Safari 17.2')).toBeInTheDocument();
      expect(screen.getByText('iOS 17.2')).toBeInTheDocument();
      expect(screen.getByText('Firefox 121.0')).toBeInTheDocument();
      expect(screen.getByText('Ubuntu 22.04')).toBeInTheDocument();
    });

    it('should display location information', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check location info
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Toronto, ON')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('London, England')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });

    it('should display session duration correctly', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check duration formatting
      expect(screen.getByText('1h 30m')).toBeInTheDocument(); // 5400 seconds
      expect(screen.getByText('2h 10m')).toBeInTheDocument(); // 7800 seconds
      expect(screen.getByText('2h 15m')).toBeInTheDocument(); // 8100 seconds
    });

    it('should display session status with appropriate indicators', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check status indicators
      expect(screen.getAllByText('Active')).toHaveLength(2);
      expect(screen.getByText('Expired')).toBeInTheDocument();

      // Check status colors/badges
      expect(screen.getByTestId('status-active-session-1')).toBeInTheDocument();
      expect(screen.getByTestId('status-active-session-2')).toBeInTheDocument();
      expect(screen.getByTestId('status-expired-session-3')).toBeInTheDocument();
    });

    it('should display risk levels with appropriate styling', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check risk level indicators
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();

      // Check risk level styling
      expect(screen.getByTestId('risk-low-session-1')).toBeInTheDocument();
      expect(screen.getByTestId('risk-medium-session-2')).toBeInTheDocument();
      expect(screen.getByTestId('risk-high-session-3')).toBeInTheDocument();
    });

    it('should highlight current session', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check current session indicator
      expect(screen.getByTestId('current-session-session-1')).toBeInTheDocument();
      expect(screen.getByText('Current Session')).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort by user name', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click on User column header
      const userHeader = screen.getByRole('button', { name: /sort by user/i });
      await userEvent.click(userHeader);

      // Should trigger refetch with sort parameters
      expect(mockRefetch).toHaveBeenCalledWith({
        sortBy: 'userName',
        sortOrder: 'asc',
      });
    });

    it('should sort by start time', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click on Duration column header
      const durationHeader = screen.getByRole('button', { name: /sort by duration/i });
      await userEvent.click(durationHeader);

      expect(mockRefetch).toHaveBeenCalledWith({
        sortBy: 'startTime',
        sortOrder: 'asc',
      });
    });

    it('should toggle sort order on repeated clicks', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      const userHeader = screen.getByRole('button', { name: /sort by user/i });
      
      // First click - ascending
      await userEvent.click(userHeader);
      expect(mockRefetch).toHaveBeenCalledWith({
        sortBy: 'userName',
        sortOrder: 'asc',
      });

      // Second click - descending
      await userEvent.click(userHeader);
      expect(mockRefetch).toHaveBeenCalledWith({
        sortBy: 'userName',
        sortOrder: 'desc',
      });
    });

    it('should show sort indicators', async () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click to sort
      const userHeader = screen.getByRole('button', { name: /sort by user/i });
      await userEvent.click(userHeader);

      // Should show sort indicator
      expect(screen.getByTestId('sort-asc-userName')).toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter by status', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Select status filter
      const statusFilter = screen.getByLabelText(/filter by status/i);
      await userEvent.selectOptions(statusFilter, 'active');

      expect(mockRefetch).toHaveBeenCalledWith({
        filters: { status: 'active' },
      });
    });

    it('should filter by risk level', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Select risk level filter
      const riskFilter = screen.getByLabelText(/filter by risk level/i);
      await userEvent.selectOptions(riskFilter, 'high');

      expect(mockRefetch).toHaveBeenCalledWith({
        filters: { riskLevel: 'high' },
      });
    });

    it('should search by user name or email', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Type in search box
      const searchInput = screen.getByPlaceholderText(/search sessions/i);
      await userEvent.type(searchInput, 'john');

      // Should debounce and trigger search
      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledWith({
          search: 'john',
        });
      }, { timeout: 1000 });
    });

    it('should clear filters', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Apply filters first
      const statusFilter = screen.getByLabelText(/filter by status/i);
      await userEvent.selectOptions(statusFilter, 'active');

      // Clear filters
      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      await userEvent.click(clearButton);

      expect(mockRefetch).toHaveBeenCalledWith({
        filters: {},
        search: '',
      });
    });
  });

  describe('Pagination', () => {
    it('should display pagination controls', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check pagination info
      expect(screen.getByText('Showing 1-10 of 25 sessions')).toBeInTheDocument();

      // Check pagination buttons
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('should handle page navigation', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click next page
      const nextButton = screen.getByRole('button', { name: /next page/i });
      await userEvent.click(nextButton);

      expect(mockRefetch).toHaveBeenCalledWith({
        page: 2,
      });
    });

    it('should change page size', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Change page size
      const pageSizeSelect = screen.getByLabelText(/items per page/i);
      await userEvent.selectOptions(pageSizeSelect, '25');

      expect(mockRefetch).toHaveBeenCalledWith({
        limit: 25,
        page: 1,
      });
    });
  });

  describe('Session Actions', () => {
    it('should provide view details action', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click view details button
      const viewButton = screen.getByRole('button', { name: /view session-1 details/i });
      await userEvent.click(viewButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/sessions/session-1');
    });

    it('should provide terminate session action', async () => {
      const mockTerminate = jest.fn();
      mockUseTerminateSession.mockReturnValue({
        mutate: mockTerminate,
        isPending: false,
        error: null,
      });

      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click terminate button (should be available for non-current sessions)
      const terminateButton = screen.getByRole('button', { name: /terminate session-2/i });
      await userEvent.click(terminateButton);

      // Should show confirmation dialog
      expect(screen.getByText(/terminate session/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

      // Confirm termination
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await userEvent.click(confirmButton);

      expect(mockTerminate).toHaveBeenCalledWith('session-2');
    });

    it('should disable terminate for current session', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Current session terminate button should be disabled
      const currentSessionRow = screen.getByTestId('session-row-session-1');
      const terminateButton = currentSessionRow.querySelector('[data-testid="terminate-button"]');
      expect(terminateButton).toBeDisabled();
    });

    it('should show loading state during termination', () => {
      mockUseTerminateSession.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Should show loading spinner
      expect(screen.getByTestId('terminate-loading')).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    it('should refresh data periodically', async () => {
      const mockRefetch = jest.fn();
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Wait for auto-refresh interval
      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      }, { timeout: 31000 }); // 30s interval + buffer
    });

    it('should handle real-time session updates', async () => {
      const { rerender } = render(
        <QueryClientProvider client={new QueryClient()}>
          <SessionsTable />
        </QueryClientProvider>
      );

      // Initially show sessions
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <SessionsTable />
        </QueryClientProvider>
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Session status changes
      const updatedSessions = {
        ...mockPaginatedSessions,
        data: mockPaginatedSessions.data.map(session =>
          session.id === 'session-1'
            ? { ...session, status: 'expired' as const }
            : session
        ),
      };

      mockUseSessions.mockReturnValue({
        data: updatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <SessionsTable />
        </QueryClientProvider>
      );

      // Should reflect status change
      expect(screen.getAllByText('Expired')).toHaveLength(2);
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch sessions');
      mockUseSessions.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load sessions/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle empty sessions list', () => {
      const emptyData = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockUseSessions.mockReturnValue({
        data: emptyData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      expect(screen.getByText(/no sessions found/i)).toBeInTheDocument();
      expect(screen.getByText(/no active sessions/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check for table structure
      expect(screen.getByRole('table', { name: /sessions table/i })).toBeInTheDocument();

      // Check for proper headings
      expect(screen.getByRole('columnheader', { name: /user/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /device/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /location/i })).toBeInTheDocument();

      // Check for row labels
      expect(screen.getByLabelText(/session for john doe/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /sort by user/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByLabelText(/filter by status/i)).toHaveFocus();
    });

    it('should announce sort changes to screen readers', async () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Click sort button
      const sortButton = screen.getByRole('button', { name: /sort by user/i });
      await userEvent.click(sortButton);

      // Should announce sort change
      expect(screen.getByRole('status')).toHaveTextContent(/sorted by user ascending/i);
    });
  });

  describe('Responsive Design', () => {
    it('should adapt table layout for mobile screens', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check for responsive table wrapper
      const tableWrapper = container.querySelector('.overflow-x-auto');
      expect(tableWrapper).toBeInTheDocument();
    });

    it('should show card layout on very small screens', () => {
      mockUseSessions.mockReturnValue({
        data: mockPaginatedSessions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <SessionsTable />
        </Wrapper>
      );

      // Check for mobile card layout
      const mobileCards = container.querySelectorAll('.sm\\:hidden');
      expect(mobileCards.length).toBeGreaterThan(0);
    });
  });
});