/**
 * CrisisAlertsPanel Component Tests
 * 
 * Tests for the crisis alerts panel component including:
 * - Crisis alert detection and display
 * - Real-time updates and notifications
 * - Alert severity and priority handling
 * - Emergency response actions
 * - Loading and error states
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CrisisAlertsPanel } from '../CrisisAlertsPanel';
import * as crisisHooks from '@/hooks/dashboard/use-crisis-alerts';

// Mock the crisis alerts hooks
jest.mock('@/hooks/dashboard/use-crisis-alerts');
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
    custom: jest.fn(),
  },
}));

// Mock audio notifications
const mockAudio = {
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
};
global.Audio = jest.fn(() => mockAudio) as any;

const mockUseCrisisAlerts = crisisHooks.useCrisisAlerts as jest.MockedFunction<
  typeof crisisHooks.useCrisisAlerts
>;

const mockUseAcknowledgeCrisis = crisisHooks.useAcknowledgeCrisis as jest.MockedFunction<
  typeof crisisHooks.useAcknowledgeCrisis
>;

const mockUseEscalateCrisis = crisisHooks.useEscalateCrisis as jest.MockedFunction<
  typeof crisisHooks.useEscalateCrisis
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

// Mock crisis alert data
const mockCrisisAlerts = [
  {
    id: 'crisis-1',
    title: 'Mass Phishing Campaign Detected',
    description: 'Large-scale phishing attack targeting multiple clients',
    severity: 'critical' as const,
    priority: 'urgent' as const,
    status: 'active' as const,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
    affectedProjects: ['proj-1', 'proj-2', 'proj-3'],
    affectedUsers: 1250,
    threatLevel: 'high' as const,
    category: 'phishing' as const,
    source: 'automated_detection',
    confidence: 0.95,
    estimatedImpact: 'high',
    responseRequired: true,
    escalated: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    id: 'crisis-2',
    title: 'Data Breach Attempt',
    description: 'Unauthorized access attempt on client database',
    severity: 'high' as const,
    priority: 'high' as const,
    status: 'investigating' as const,
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T10:20:00Z',
    affectedProjects: ['proj-4'],
    affectedUsers: 500,
    threatLevel: 'medium' as const,
    category: 'data_breach' as const,
    source: 'security_team',
    confidence: 0.87,
    estimatedImpact: 'medium',
    responseRequired: true,
    escalated: true,
    acknowledgedBy: 'user-123',
    acknowledgedAt: '2024-01-15T09:20:00Z',
  },
  {
    id: 'crisis-3',
    title: 'System Performance Degradation',
    description: 'Significant performance issues across scanning infrastructure',
    severity: 'medium' as const,
    priority: 'medium' as const,
    status: 'resolved' as const,
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T18:30:00Z',
    affectedProjects: ['proj-1', 'proj-5'],
    affectedUsers: 200,
    threatLevel: 'low' as const,
    category: 'system' as const,
    source: 'monitoring',
    confidence: 0.92,
    estimatedImpact: 'low',
    responseRequired: false,
    escalated: false,
    acknowledgedBy: 'user-456',
    acknowledgedAt: '2024-01-14T17:00:00Z',
  },
];

describe('CrisisAlertsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAcknowledgeCrisis.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseEscalateCrisis.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      expect(screen.getByTestId('crisis-alerts-skeleton')).toBeInTheDocument();
    });
  });

  describe('Crisis Alert Display', () => {
    it('should display crisis alerts correctly', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check alert titles
      expect(screen.getByText('Mass Phishing Campaign Detected')).toBeInTheDocument();
      expect(screen.getByText('Data Breach Attempt')).toBeInTheDocument();
      expect(screen.getByText('System Performance Degradation')).toBeInTheDocument();

      // Check alert descriptions
      expect(screen.getByText('Large-scale phishing attack targeting multiple clients')).toBeInTheDocument();
      expect(screen.getByText('Unauthorized access attempt on client database')).toBeInTheDocument();
    });

    it('should show correct severity indicators', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check severity badges
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should show priority indicators', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check priority indicators
      expect(screen.getByText('Urgent')).toBeInTheDocument();
      expect(screen.getAllByText('High')).toHaveLength(2); // One for severity, one for priority
    });

    it('should display affected metrics', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check affected users count
      expect(screen.getByText('1,250 users affected')).toBeInTheDocument();
      expect(screen.getByText('500 users affected')).toBeInTheDocument();
      expect(screen.getByText('200 users affected')).toBeInTheDocument();

      // Check affected projects count
      expect(screen.getByText('3 projects')).toBeInTheDocument();
      expect(screen.getByText('1 project')).toBeInTheDocument();
      expect(screen.getByText('2 projects')).toBeInTheDocument();
    });

    it('should show confidence scores', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check confidence percentages
      expect(screen.getByText('95% confidence')).toBeInTheDocument();
      expect(screen.getByText('87% confidence')).toBeInTheDocument();
      expect(screen.getByText('92% confidence')).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    it('should show notification for new critical alerts', async () => {
      const { rerender } = render(
        <QueryClientProvider client={new QueryClient()}>
          <CrisisAlertsPanel />
        </QueryClientProvider>
      );

      // Initially no alerts
      mockUseCrisisAlerts.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <CrisisAlertsPanel />
        </QueryClientProvider>
      );

      // New critical alert appears
      mockUseCrisisAlerts.mockReturnValue({
        data: [mockCrisisAlerts[0]], // Critical alert
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <CrisisAlertsPanel />
        </QueryClientProvider>
      );

      // Should trigger audio notification for critical alert
      await waitFor(() => {
        expect(mockAudio.play).toHaveBeenCalled();
      });
    });

    it('should update alert counts in real-time', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check total count
      expect(screen.getByText('3 Active Crisis Alerts')).toBeInTheDocument();

      // Check critical count
      expect(screen.getByText('1 Critical')).toBeInTheDocument();
    });
  });

  describe('Alert Actions', () => {
    it('should acknowledge crisis alert', async () => {
      const mockAcknowledge = jest.fn();
      mockUseAcknowledgeCrisis.mockReturnValue({
        mutate: mockAcknowledge,
        isPending: false,
        error: null,
      });

      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Click acknowledge button for first alert
      const acknowledgeButton = screen.getByRole('button', { name: /acknowledge/i });
      await userEvent.click(acknowledgeButton);

      expect(mockAcknowledge).toHaveBeenCalledWith('crisis-1');
    });

    it('should escalate crisis alert', async () => {
      const mockEscalate = jest.fn();
      mockUseEscalateCrisis.mockReturnValue({
        mutate: mockEscalate,
        isPending: false,
        error: null,
      });

      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Click escalate button
      const escalateButton = screen.getByRole('button', { name: /escalate/i });
      await userEvent.click(escalateButton);

      expect(mockEscalate).toHaveBeenCalledWith('crisis-1');
    });

    it('should show loading state during actions', () => {
      mockUseAcknowledgeCrisis.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Should show loading spinner
      expect(screen.getByTestId('acknowledge-loading')).toBeInTheDocument();
    });

    it('should navigate to crisis details', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Click view details button
      const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
      await userEvent.click(viewDetailsButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/crisis/crisis-1');
    });
  });

  describe('Filtering and Sorting', () => {
    it('should filter by severity', async () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Click severity filter
      const severityFilter = screen.getByRole('button', { name: /filter by severity/i });
      await userEvent.click(severityFilter);

      // Select critical only
      const criticalOption = screen.getByRole('option', { name: /critical/i });
      await userEvent.click(criticalOption);

      // Should only show critical alerts
      expect(screen.getByText('Mass Phishing Campaign Detected')).toBeInTheDocument();
      expect(screen.queryByText('Data Breach Attempt')).not.toBeInTheDocument();
    });

    it('should sort by priority', async () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Click sort dropdown
      const sortButton = screen.getByRole('button', { name: /sort by/i });
      await userEvent.click(sortButton);

      // Select priority
      const priorityOption = screen.getByRole('option', { name: /priority/i });
      await userEvent.click(priorityOption);

      // Should reorder by priority (urgent first)
      const alertTitles = screen.getAllByTestId('crisis-alert-title');
      expect(alertTitles[0]).toHaveTextContent('Mass Phishing Campaign Detected');
    });
  });

  describe('Emergency Response', () => {
    it('should show emergency contact information for critical alerts', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts.filter(alert => alert.severity === 'critical'),
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Should show emergency contact info
      expect(screen.getByText(/emergency response team/i)).toBeInTheDocument();
      expect(screen.getByText(/24\/7 hotline/i)).toBeInTheDocument();
    });

    it('should provide quick action buttons for urgent alerts', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts.filter(alert => alert.priority === 'urgent'),
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Should show quick action buttons
      expect(screen.getByRole('button', { name: /immediate response/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /notify team/i })).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no crisis alerts exist', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      expect(screen.getByText(/no active crisis alerts/i)).toBeInTheDocument();
      expect(screen.getByText(/all systems operating normally/i)).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch crisis alerts');
      mockUseCrisisAlerts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load crisis alerts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', async () => {
      const mockRefetch = jest.fn();
      const mockError = new Error('Network error');
      
      mockUseCrisisAlerts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check for alert region
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Check for proper headings
      expect(screen.getByRole('heading', { name: /crisis alerts/i })).toBeInTheDocument();

      // Check for list structure
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should announce new critical alerts to screen readers', async () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Check for live region
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
    });

    it('should be keyboard navigable', async () => {
      mockUseCrisisAlerts.mockReturnValue({
        data: mockCrisisAlerts,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /acknowledge/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /escalate/i })).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('should handle large numbers of crisis alerts efficiently', () => {
      const largeCrisisAlertsList = Array.from({ length: 100 }, (_, i) => ({
        ...mockCrisisAlerts[0],
        id: `crisis-${i}`,
        title: `Crisis Alert ${i}`,
      }));

      mockUseCrisisAlerts.mockReturnValue({
        data: largeCrisisAlertsList,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <CrisisAlertsPanel />
        </Wrapper>
      );

      // Should render without performance issues
      expect(container.firstChild).toBeInTheDocument();
      
      // Should show pagination or virtualization
      expect(screen.getByText(/showing \d+ of \d+/i)).toBeInTheDocument();
    });
  });
});