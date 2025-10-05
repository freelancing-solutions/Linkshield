/**
 * AlgorithmHealthPanel Component Tests
 * 
 * Tests for the algorithm health monitoring panel including:
 * - Algorithm status display and metrics
 * - Performance indicators and trends
 * - Health alerts and warnings
 * - Real-time monitoring updates
 * - Algorithm management actions
 * - Accessibility and responsive design
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlgorithmHealthPanel } from '../AlgorithmHealthPanel';
import * as algorithmHooks from '@/hooks/dashboard/use-algorithm-health';
import * as authHooks from '@/hooks/use-auth';

// Mock the hooks
jest.mock('@/hooks/dashboard/use-algorithm-health');
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

// Mock chart components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

const mockUseAlgorithmHealth = algorithmHooks.useAlgorithmHealth as jest.MockedFunction<
  typeof algorithmHooks.useAlgorithmHealth
>;

const mockUseRestartAlgorithm = algorithmHooks.useRestartAlgorithm as jest.MockedFunction<
  typeof algorithmHooks.useRestartAlgorithm
>;

const mockUseUpdateAlgorithmConfig = algorithmHooks.useUpdateAlgorithmConfig as jest.MockedFunction<
  typeof algorithmHooks.useUpdateAlgorithmConfig
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
  permissions: ['view_algorithms', 'manage_algorithms'],
};

// Mock algorithm health data
const mockAlgorithmHealth = {
  algorithms: [
    {
      id: 'threat-detection',
      name: 'Threat Detection Engine',
      version: '2.1.4',
      status: 'healthy' as const,
      uptime: 99.97,
      lastUpdate: '2024-01-15T10:30:00Z',
      performance: {
        accuracy: 98.5,
        precision: 97.2,
        recall: 99.1,
        f1Score: 98.1,
        falsePositiveRate: 0.8,
        processingTime: 45, // milliseconds
        throughput: 1250, // requests per minute
      },
      metrics: {
        totalScans: 125000,
        threatsDetected: 3420,
        falsePositives: 27,
        averageResponseTime: 42,
        errorRate: 0.03,
      },
      resources: {
        cpuUsage: 34.2,
        memoryUsage: 67.8,
        diskUsage: 23.1,
        networkLatency: 12,
      },
      health: {
        score: 95,
        status: 'excellent' as const,
        issues: [],
        warnings: [],
      },
    },
    {
      id: 'behavioral-analysis',
      name: 'Behavioral Analysis',
      version: '1.8.2',
      status: 'warning' as const,
      uptime: 97.3,
      lastUpdate: '2024-01-15T09:45:00Z',
      performance: {
        accuracy: 94.2,
        precision: 93.8,
        recall: 95.6,
        f1Score: 94.7,
        falsePositiveRate: 2.1,
        processingTime: 78,
        throughput: 890,
      },
      metrics: {
        totalScans: 89000,
        threatsDetected: 1890,
        falsePositives: 156,
        averageResponseTime: 75,
        errorRate: 1.2,
      },
      resources: {
        cpuUsage: 78.9,
        memoryUsage: 89.4,
        diskUsage: 45.7,
        networkLatency: 28,
      },
      health: {
        score: 78,
        status: 'warning' as const,
        issues: [],
        warnings: [
          {
            id: 'high-memory',
            type: 'resource',
            severity: 'medium',
            message: 'Memory usage is approaching threshold',
            timestamp: '2024-01-15T10:15:00Z',
          },
          {
            id: 'increased-latency',
            type: 'performance',
            severity: 'low',
            message: 'Response time has increased by 15%',
            timestamp: '2024-01-15T10:20:00Z',
          },
        ],
      },
    },
    {
      id: 'content-filter',
      name: 'Content Filtering',
      version: '3.0.1',
      status: 'critical' as const,
      uptime: 89.2,
      lastUpdate: '2024-01-15T08:30:00Z',
      performance: {
        accuracy: 87.3,
        precision: 85.9,
        recall: 91.2,
        f1Score: 88.5,
        falsePositiveRate: 4.7,
        processingTime: 156,
        throughput: 450,
      },
      metrics: {
        totalScans: 67000,
        threatsDetected: 2340,
        falsePositives: 287,
        averageResponseTime: 142,
        errorRate: 3.8,
      },
      resources: {
        cpuUsage: 92.1,
        memoryUsage: 94.7,
        diskUsage: 78.3,
        networkLatency: 67,
      },
      health: {
        score: 45,
        status: 'critical' as const,
        issues: [
          {
            id: 'high-error-rate',
            type: 'performance',
            severity: 'high',
            message: 'Error rate exceeds acceptable threshold',
            timestamp: '2024-01-15T09:30:00Z',
          },
          {
            id: 'resource-exhaustion',
            type: 'resource',
            severity: 'critical',
            message: 'CPU and memory usage critically high',
            timestamp: '2024-01-15T10:00:00Z',
          },
        ],
        warnings: [],
      },
    },
  ],
  overall: {
    status: 'warning' as const,
    healthScore: 73,
    activeAlgorithms: 3,
    healthyAlgorithms: 1,
    warningAlgorithms: 1,
    criticalAlgorithms: 1,
    totalUptime: 95.5,
    averagePerformance: 93.3,
  },
  trends: {
    healthScore: [
      { timestamp: '2024-01-15T06:00:00Z', value: 85 },
      { timestamp: '2024-01-15T07:00:00Z', value: 82 },
      { timestamp: '2024-01-15T08:00:00Z', value: 78 },
      { timestamp: '2024-01-15T09:00:00Z', value: 75 },
      { timestamp: '2024-01-15T10:00:00Z', value: 73 },
    ],
    performance: [
      { timestamp: '2024-01-15T06:00:00Z', accuracy: 96.2, responseTime: 52 },
      { timestamp: '2024-01-15T07:00:00Z', accuracy: 95.8, responseTime: 58 },
      { timestamp: '2024-01-15T08:00:00Z', accuracy: 94.9, responseTime: 65 },
      { timestamp: '2024-01-15T09:00:00Z', accuracy: 94.1, responseTime: 72 },
      { timestamp: '2024-01-15T10:00:00Z', accuracy: 93.3, responseTime: 78 },
    ],
  },
};

describe('AlgorithmHealthPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    mockUseRestartAlgorithm.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseUpdateAlgorithmConfig.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      expect(screen.getByTestId('algorithm-health-skeleton')).toBeInTheDocument();
    });
  });

  describe('Algorithm Health Display', () => {
    it('should display overall health status', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check overall status
      expect(screen.getByText('Algorithm Health')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('73')).toBeInTheDocument(); // Health score
      expect(screen.getByText('95.5%')).toBeInTheDocument(); // Overall uptime
    });

    it('should display algorithm summary statistics', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check summary stats
      expect(screen.getByText('3')).toBeInTheDocument(); // Active algorithms
      expect(screen.getByText('1')).toBeInTheDocument(); // Healthy
      expect(screen.getByText('1')).toBeInTheDocument(); // Warning
      expect(screen.getByText('1')).toBeInTheDocument(); // Critical
    });

    it('should display individual algorithm cards', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check algorithm names
      expect(screen.getByText('Threat Detection Engine')).toBeInTheDocument();
      expect(screen.getByText('Behavioral Analysis')).toBeInTheDocument();
      expect(screen.getByText('Content Filtering')).toBeInTheDocument();

      // Check versions
      expect(screen.getByText('v2.1.4')).toBeInTheDocument();
      expect(screen.getByText('v1.8.2')).toBeInTheDocument();
      expect(screen.getByText('v3.0.1')).toBeInTheDocument();
    });

    it('should display algorithm status indicators', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check status indicators
      expect(screen.getByTestId('status-healthy-threat-detection')).toBeInTheDocument();
      expect(screen.getByTestId('status-warning-behavioral-analysis')).toBeInTheDocument();
      expect(screen.getByTestId('status-critical-content-filter')).toBeInTheDocument();
    });

    it('should display performance metrics', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check performance metrics
      expect(screen.getByText('98.5%')).toBeInTheDocument(); // Accuracy
      expect(screen.getByText('45ms')).toBeInTheDocument(); // Processing time
      expect(screen.getByText('1,250')).toBeInTheDocument(); // Throughput
      expect(screen.getByText('99.97%')).toBeInTheDocument(); // Uptime
    });

    it('should display resource usage', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check resource usage
      expect(screen.getByText('34.2%')).toBeInTheDocument(); // CPU
      expect(screen.getByText('67.8%')).toBeInTheDocument(); // Memory
      expect(screen.getByText('23.1%')).toBeInTheDocument(); // Disk
      expect(screen.getByText('12ms')).toBeInTheDocument(); // Network latency
    });
  });

  describe('Health Issues and Warnings', () => {
    it('should display warnings for algorithms with issues', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check warnings
      expect(screen.getByText('Memory usage is approaching threshold')).toBeInTheDocument();
      expect(screen.getByText('Response time has increased by 15%')).toBeInTheDocument();
    });

    it('should display critical issues', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check critical issues
      expect(screen.getByText('Error rate exceeds acceptable threshold')).toBeInTheDocument();
      expect(screen.getByText('CPU and memory usage critically high')).toBeInTheDocument();
    });

    it('should show issue severity indicators', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check severity indicators
      expect(screen.getByTestId('severity-medium-high-memory')).toBeInTheDocument();
      expect(screen.getByTestId('severity-low-increased-latency')).toBeInTheDocument();
      expect(screen.getByTestId('severity-high-high-error-rate')).toBeInTheDocument();
      expect(screen.getByTestId('severity-critical-resource-exhaustion')).toBeInTheDocument();
    });

    it('should group issues by algorithm', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check issue grouping
      const behavioralCard = screen.getByTestId('algorithm-card-behavioral-analysis');
      expect(behavioralCard).toHaveTextContent('2 warnings');

      const contentFilterCard = screen.getByTestId('algorithm-card-content-filter');
      expect(contentFilterCard).toHaveTextContent('2 issues');
    });
  });

  describe('Performance Trends', () => {
    it('should display health score trend chart', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check for chart components
      expect(screen.getByTestId('health-score-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should display performance metrics chart', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check for performance chart
      expect(screen.getByTestId('performance-chart')).toBeInTheDocument();
    });

    it('should show trend indicators', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check trend indicators
      expect(screen.getByTestId('trend-down-health-score')).toBeInTheDocument();
      expect(screen.getByTestId('trend-down-accuracy')).toBeInTheDocument();
      expect(screen.getByTestId('trend-up-response-time')).toBeInTheDocument();
    });
  });

  describe('Algorithm Management Actions', () => {
    it('should provide restart algorithm action', async () => {
      const mockRestart = jest.fn();
      mockUseRestartAlgorithm.mockReturnValue({
        mutate: mockRestart,
        isPending: false,
        error: null,
      });

      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Click restart button
      const restartButton = screen.getByRole('button', { name: /restart content-filter/i });
      await userEvent.click(restartButton);

      // Should show confirmation dialog
      expect(screen.getByText(/restart algorithm/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

      // Confirm restart
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await userEvent.click(confirmButton);

      expect(mockRestart).toHaveBeenCalledWith('content-filter');
    });

    it('should provide view details action', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Click view details button
      const detailsButton = screen.getByRole('button', { name: /view threat-detection details/i });
      await userEvent.click(detailsButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/algorithms/threat-detection');
    });

    it('should provide configuration update action', async () => {
      const mockUpdateConfig = jest.fn();
      mockUseUpdateAlgorithmConfig.mockReturnValue({
        mutate: mockUpdateConfig,
        isPending: false,
        error: null,
      });

      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Click configure button
      const configButton = screen.getByRole('button', { name: /configure behavioral-analysis/i });
      await userEvent.click(configButton);

      // Should open configuration modal
      expect(screen.getByText(/algorithm configuration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/threshold/i)).toBeInTheDocument();

      // Update configuration
      const thresholdInput = screen.getByLabelText(/threshold/i);
      await userEvent.clear(thresholdInput);
      await userEvent.type(thresholdInput, '0.85');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      expect(mockUpdateConfig).toHaveBeenCalledWith({
        algorithmId: 'behavioral-analysis',
        config: expect.objectContaining({
          threshold: 0.85,
        }),
      });
    });

    it('should disable actions based on permissions', () => {
      // Mock user without manage permissions
      mockUseAuth.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['view_algorithms'], // No manage permission
        },
        isAuthenticated: true,
        isLoading: false,
      });

      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Management actions should be disabled
      const restartButton = screen.getByRole('button', { name: /restart content-filter/i });
      expect(restartButton).toBeDisabled();

      const configButton = screen.getByRole('button', { name: /configure behavioral-analysis/i });
      expect(configButton).toBeDisabled();
    });

    it('should show loading state during actions', () => {
      mockUseRestartAlgorithm.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Should show loading spinner
      expect(screen.getByTestId('restart-loading')).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    it('should refresh data periodically', async () => {
      const mockRefetch = jest.fn();
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Wait for auto-refresh interval
      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      }, { timeout: 16000 }); // 15s interval + buffer
    });

    it('should handle real-time health updates', async () => {
      const { rerender } = render(
        <QueryClientProvider client={new QueryClient()}>
          <AlgorithmHealthPanel />
        </QueryClientProvider>
      );

      // Initially show warning status
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <AlgorithmHealthPanel />
        </QueryClientProvider>
      );

      expect(screen.getByText('Warning')).toBeInTheDocument();

      // Health improves
      const improvedHealth = {
        ...mockAlgorithmHealth,
        overall: {
          ...mockAlgorithmHealth.overall,
          status: 'healthy' as const,
          healthScore: 85,
        },
      };

      mockUseAlgorithmHealth.mockReturnValue({
        data: improvedHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <AlgorithmHealthPanel />
        </QueryClientProvider>
      );

      // Should reflect improved status
      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch algorithm health');
      mockUseAlgorithmHealth.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load algorithm health/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle empty algorithm data', () => {
      const emptyData = {
        ...mockAlgorithmHealth,
        algorithms: [],
        overall: {
          ...mockAlgorithmHealth.overall,
          activeAlgorithms: 0,
        },
      };

      mockUseAlgorithmHealth.mockReturnValue({
        data: emptyData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      expect(screen.getByText(/no algorithms configured/i)).toBeInTheDocument();
      expect(screen.getByText(/configure algorithms/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check for proper headings
      expect(screen.getByRole('heading', { name: /algorithm health/i })).toBeInTheDocument();

      // Check for status announcements
      expect(screen.getByLabelText(/overall health status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/threat detection engine status/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /view threat-detection details/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /restart content-filter/i })).toHaveFocus();
    });

    it('should announce status changes to screen readers', async () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Should have live region for status updates
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check for responsive grid layout
      const algorithmGrid = container.querySelector('.grid');
      expect(algorithmGrid).toBeInTheDocument();
    });

    it('should stack algorithm cards on small screens', () => {
      mockUseAlgorithmHealth.mockReturnValue({
        data: mockAlgorithmHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <AlgorithmHealthPanel />
        </Wrapper>
      );

      // Check for mobile-friendly layout
      const mobileLayout = container.querySelector('.sm\\:grid-cols-1');
      expect(mobileLayout).toBeInTheDocument();
    });
  });
});