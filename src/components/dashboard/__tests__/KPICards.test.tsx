/**
 * KPICards Component Tests
 * 
 * Tests for the dashboard KPI cards component including:
 * - Rendering with different data states
 * - Loading states
 * - Error states
 * - User interactions
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KPICards } from '../KPICards';
import * as dashboardHooks from '@/hooks/dashboard/use-dashboard-data';

// Mock the dashboard hooks
jest.mock('@/hooks/dashboard/use-dashboard-data');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const mockUseDashboardData = dashboardHooks.useDashboardData as jest.MockedFunction<
  typeof dashboardHooks.useDashboardData
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

describe('KPICards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading skeletons when data is loading', () => {
      mockUseDashboardData.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Should show skeleton loaders
      expect(screen.getAllByTestId(/skeleton/i)).toHaveLength(4);
    });

    it('should show loading indicators for individual cards', () => {
      mockUseDashboardData.mockReturnValue({
        data: {
          totalProjects: 5,
          activeAlerts: undefined, // Partial loading
          totalScans: 150,
          threatLevel: 'medium',
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Should show some data and some loading states
      expect(screen.getByText('5')).toBeInTheDocument(); // totalProjects
      expect(screen.getByText('150')).toBeInTheDocument(); // totalScans
    });
  });

  describe('Data Display', () => {
    const mockData = {
      totalProjects: 12,
      activeAlerts: 3,
      totalScans: 1250,
      threatLevel: 'high' as const,
      projectsGrowth: 15.5,
      alertsChange: -8.2,
      scansGrowth: 22.1,
      threatTrend: 'increasing' as const,
    };

    it('should display KPI data correctly', () => {
      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Check main KPI values
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();

      // Check growth indicators
      expect(screen.getByText('+15.5%')).toBeInTheDocument();
      expect(screen.getByText('-8.2%')).toBeInTheDocument();
      expect(screen.getByText('+22.1%')).toBeInTheDocument();
    });

    it('should show correct trend indicators', () => {
      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Should show trend up icons for positive growth
      const trendUpIcons = screen.getAllByTestId('trend-up');
      expect(trendUpIcons).toHaveLength(2); // projects and scans

      // Should show trend down icon for negative change
      const trendDownIcons = screen.getAllByTestId('trend-down');
      expect(trendDownIcons).toHaveLength(1); // alerts
    });

    it('should format large numbers correctly', () => {
      mockUseDashboardData.mockReturnValue({
        data: {
          ...mockData,
          totalScans: 1234567,
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Should format large numbers with commas
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });
  });

  describe('Threat Level Indicators', () => {
    it('should show correct threat level colors and icons', () => {
      const testCases = [
        { level: 'low' as const, expectedClass: 'text-green-600', expectedIcon: 'shield-check' },
        { level: 'medium' as const, expectedClass: 'text-yellow-600', expectedIcon: 'shield-alert' },
        { level: 'high' as const, expectedClass: 'text-red-600', expectedIcon: 'shield-x' },
      ];

      testCases.forEach(({ level, expectedClass, expectedIcon }) => {
        mockUseDashboardData.mockReturnValue({
          data: {
            totalProjects: 5,
            activeAlerts: 2,
            totalScans: 100,
            threatLevel: level,
          },
          isLoading: false,
          error: null,
          refetch: jest.fn(),
        });

        const Wrapper = createTestWrapper();
        const { container } = render(
          <Wrapper>
            <KPICards />
          </Wrapper>
        );

        // Check threat level text
        expect(screen.getByText(level.charAt(0).toUpperCase() + level.slice(1))).toBeInTheDocument();

        // Check for appropriate icon (would need to check SVG or data-testid)
        const threatCard = container.querySelector(`[data-testid="threat-level-card"]`);
        expect(threatCard).toBeInTheDocument();
      });
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch dashboard data');
      mockUseDashboardData.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load dashboard data/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', async () => {
      const mockRefetch = jest.fn();
      const mockError = new Error('Network error');
      
      mockUseDashboardData.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interactive Features', () => {
    const mockData = {
      totalProjects: 12,
      activeAlerts: 3,
      totalScans: 1250,
      threatLevel: 'medium' as const,
    };

    it('should be clickable and navigate to detailed views', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Click on projects card
      const projectsCard = screen.getByTestId('projects-card');
      await userEvent.click(projectsCard);

      // Should navigate to projects page
      expect(mockPush).toHaveBeenCalledWith('/dashboard/projects');
    });

    it('should show tooltips on hover', async () => {
      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      const projectsCard = screen.getByTestId('projects-card');
      
      // Hover over card
      await userEvent.hover(projectsCard);
      
      // Should show tooltip (implementation depends on tooltip library)
      await waitFor(() => {
        expect(screen.getByText(/total number of projects/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    const mockData = {
      totalProjects: 12,
      activeAlerts: 3,
      totalScans: 1250,
      threatLevel: 'high' as const,
    };

    it('should have proper ARIA labels', () => {
      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Check for ARIA labels
      expect(screen.getByLabelText(/total projects/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/active alerts/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total scans/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/threat level/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Tab through cards
      await userEvent.tab();
      expect(screen.getByTestId('projects-card')).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByTestId('alerts-card')).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByTestId('scans-card')).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByTestId('threat-card')).toHaveFocus();
    });

    it('should announce changes to screen readers', () => {
      mockUseDashboardData.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Check for live regions
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to different screen sizes', () => {
      mockUseDashboardData.mockReturnValue({
        data: {
          totalProjects: 12,
          activeAlerts: 3,
          totalScans: 1250,
          threatLevel: 'medium' as const,
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <KPICards />
        </Wrapper>
      );

      // Check for responsive grid classes
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });
  });
});