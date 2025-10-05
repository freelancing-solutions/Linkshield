/**
 * ExtensionStatusCard Component Tests
 * 
 * Tests for the extension status card component including:
 * - Extension status display and monitoring
 * - Connection health indicators
 * - Extension management actions
 * - Real-time status updates
 * - Error handling and recovery
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExtensionStatusCard } from '../ExtensionStatusCard';
import * as extensionHooks from '@/hooks/dashboard/use-extension-status';

// Mock the extension status hooks
jest.mock('@/hooks/dashboard/use-extension-status');
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

const mockUseExtensionStatus = extensionHooks.useExtensionStatus as jest.MockedFunction<
  typeof extensionHooks.useExtensionStatus
>;

const mockUseRestartExtension = extensionHooks.useRestartExtension as jest.MockedFunction<
  typeof extensionHooks.useRestartExtension
>;

const mockUseUpdateExtension = extensionHooks.useUpdateExtension as jest.MockedFunction<
  typeof extensionHooks.useUpdateExtension
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

// Mock extension status data
const mockExtensionStatus = {
  id: 'ext-1',
  name: 'LinkShield Browser Extension',
  version: '2.1.4',
  status: 'active' as const,
  health: 'healthy' as const,
  lastSeen: '2024-01-15T10:30:00Z',
  connectedUsers: 1250,
  activeScans: 45,
  totalScans: 15420,
  errorRate: 0.02,
  averageResponseTime: 120,
  uptime: 0.9987,
  features: {
    realTimeScanning: true,
    phishingDetection: true,
    malwareProtection: true,
    socialMediaMonitoring: true,
    dataLeakPrevention: true,
  },
  performance: {
    cpuUsage: 15.2,
    memoryUsage: 45.8,
    networkLatency: 85,
    scanThroughput: 1200,
  },
  issues: [],
  updateAvailable: false,
  autoUpdateEnabled: true,
  lastUpdated: '2024-01-10T14:20:00Z',
};

const mockExtensionStatusWithIssues = {
  ...mockExtensionStatus,
  status: 'degraded' as const,
  health: 'warning' as const,
  errorRate: 0.15,
  issues: [
    {
      id: 'issue-1',
      type: 'performance',
      severity: 'medium',
      message: 'High memory usage detected',
      timestamp: '2024-01-15T10:25:00Z',
    },
    {
      id: 'issue-2',
      type: 'connectivity',
      severity: 'low',
      message: 'Intermittent connection timeouts',
      timestamp: '2024-01-15T10:20:00Z',
    },
  ],
  updateAvailable: true,
};

describe('ExtensionStatusCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseRestartExtension.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseUpdateExtension.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      expect(screen.getByTestId('extension-status-skeleton')).toBeInTheDocument();
    });
  });

  describe('Extension Status Display', () => {
    it('should display extension information correctly', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check extension name and version
      expect(screen.getByText('LinkShield Browser Extension')).toBeInTheDocument();
      expect(screen.getByText('v2.1.4')).toBeInTheDocument();

      // Check status indicators
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Healthy')).toBeInTheDocument();

      // Check connected users
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('Connected Users')).toBeInTheDocument();

      // Check active scans
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('Active Scans')).toBeInTheDocument();
    });

    it('should show correct health status colors', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check for healthy status color (green)
      const healthyBadge = screen.getByText('Healthy');
      expect(healthyBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should display performance metrics', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check performance metrics
      expect(screen.getByText('15.2%')).toBeInTheDocument(); // CPU usage
      expect(screen.getByText('45.8%')).toBeInTheDocument(); // Memory usage
      expect(screen.getByText('85ms')).toBeInTheDocument(); // Network latency
      expect(screen.getByText('99.87%')).toBeInTheDocument(); // Uptime
    });

    it('should show feature status', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check enabled features
      expect(screen.getByText('Real-time Scanning')).toBeInTheDocument();
      expect(screen.getByText('Phishing Detection')).toBeInTheDocument();
      expect(screen.getByText('Malware Protection')).toBeInTheDocument();
      expect(screen.getByText('Social Media Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Data Leak Prevention')).toBeInTheDocument();

      // All features should show as enabled
      const enabledIcons = screen.getAllByTestId('feature-enabled');
      expect(enabledIcons).toHaveLength(5);
    });
  });

  describe('Extension Issues and Warnings', () => {
    it('should display extension issues when present', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatusWithIssues,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check degraded status
      expect(screen.getByText('Degraded')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();

      // Check issue messages
      expect(screen.getByText('High memory usage detected')).toBeInTheDocument();
      expect(screen.getByText('Intermittent connection timeouts')).toBeInTheDocument();

      // Check issue count
      expect(screen.getByText('2 Issues')).toBeInTheDocument();
    });

    it('should show warning colors for degraded status', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatusWithIssues,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check for warning status color (yellow/orange)
      const warningBadge = screen.getByText('Warning');
      expect(warningBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should display high error rate warning', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatusWithIssues,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check error rate
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('Error Rate')).toBeInTheDocument();

      // Should show warning indicator for high error rate
      expect(screen.getByTestId('high-error-rate-warning')).toBeInTheDocument();
    });
  });

  describe('Extension Management Actions', () => {
    it('should restart extension when restart button is clicked', async () => {
      const mockRestart = jest.fn();
      mockUseRestartExtension.mockReturnValue({
        mutate: mockRestart,
        isPending: false,
        error: null,
      });

      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Click restart button
      const restartButton = screen.getByRole('button', { name: /restart/i });
      await userEvent.click(restartButton);

      expect(mockRestart).toHaveBeenCalledWith('ext-1');
    });

    it('should update extension when update is available', async () => {
      const mockUpdate = jest.fn();
      mockUseUpdateExtension.mockReturnValue({
        mutate: mockUpdate,
        isPending: false,
        error: null,
      });

      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatusWithIssues, // Has update available
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Should show update available indicator
      expect(screen.getByText('Update Available')).toBeInTheDocument();

      // Click update button
      const updateButton = screen.getByRole('button', { name: /update/i });
      await userEvent.click(updateButton);

      expect(mockUpdate).toHaveBeenCalledWith('ext-1');
    });

    it('should show loading state during restart', () => {
      mockUseRestartExtension.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Should show loading spinner
      expect(screen.getByTestId('restart-loading')).toBeInTheDocument();
      
      // Restart button should be disabled
      const restartButton = screen.getByRole('button', { name: /restarting/i });
      expect(restartButton).toBeDisabled();
    });

    it('should navigate to extension settings', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Click settings button
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await userEvent.click(settingsButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/extensions/ext-1/settings');
    });
  });

  describe('Real-time Updates', () => {
    it('should update status in real-time', async () => {
      const { rerender } = render(
        <QueryClientProvider client={new QueryClient()}>
          <ExtensionStatusCard />
        </QueryClientProvider>
      );

      // Initially healthy
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ExtensionStatusCard />
        </QueryClientProvider>
      );

      expect(screen.getByText('Healthy')).toBeInTheDocument();

      // Status changes to warning
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatusWithIssues,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ExtensionStatusCard />
        </QueryClientProvider>
      );

      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('should show last seen timestamp', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Should show relative time
      expect(screen.getByText(/last seen/i)).toBeInTheDocument();
      expect(screen.getByText(/ago/)).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch extension status');
      mockUseExtensionStatus.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load extension status/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', async () => {
      const mockRefetch = jest.fn();
      const mockError = new Error('Network error');
      
      mockUseExtensionStatus.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show offline status when extension is disconnected', () => {
      const offlineExtension = {
        ...mockExtensionStatus,
        status: 'offline' as const,
        health: 'critical' as const,
        lastSeen: '2024-01-14T10:30:00Z', // 24+ hours ago
      };

      mockUseExtensionStatus.mockReturnValue({
        data: offlineExtension,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      expect(screen.getByText('Offline')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText(/extension not responding/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check for card structure
      expect(screen.getByRole('region', { name: /extension status/i })).toBeInTheDocument();

      // Check for proper headings
      expect(screen.getByRole('heading', { name: /linkshield browser extension/i })).toBeInTheDocument();

      // Check for status indicators
      expect(screen.getByLabelText(/extension health status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/extension operational status/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /restart/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /settings/i })).toHaveFocus();
    });

    it('should announce status changes to screen readers', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatusWithIssues,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check for live region
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check for responsive classes
      const card = container.querySelector('[data-testid="extension-status-card"]');
      expect(card).toHaveClass('w-full');
      
      // Check for mobile-specific layout
      const mobileLayout = container.querySelector('.sm\\:grid-cols-2');
      expect(mobileLayout).toBeInTheDocument();
    });

    it('should stack metrics vertically on small screens', () => {
      mockUseExtensionStatus.mockReturnValue({
        data: mockExtensionStatus,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <ExtensionStatusCard />
        </Wrapper>
      );

      // Check for stacked layout on mobile
      const metricsGrid = container.querySelector('.grid-cols-1');
      expect(metricsGrid).toBeInTheDocument();
    });
  });
});