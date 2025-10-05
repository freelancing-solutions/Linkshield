/**
 * QuickActionsPanel Component Tests
 * 
 * Tests for the quick actions panel component including:
 * - Quick action buttons and functionality
 * - Action execution and feedback
 * - Permission-based action visibility
 * - Loading states and error handling
 * - Keyboard navigation and accessibility
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuickActionsPanel } from '../QuickActionsPanel';
import * as quickActionsHooks from '@/hooks/dashboard/use-quick-actions';
import * as authHooks from '@/hooks/use-auth';

// Mock the hooks
jest.mock('@/hooks/dashboard/use-quick-actions');
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
    promise: jest.fn(),
  },
}));

const mockUseQuickActions = quickActionsHooks.useQuickActions as jest.MockedFunction<
  typeof quickActionsHooks.useQuickActions
>;

const mockUseCreateProject = quickActionsHooks.useCreateProject as jest.MockedFunction<
  typeof quickActionsHooks.useCreateProject
>;

const mockUseStartScan = quickActionsHooks.useStartScan as jest.MockedFunction<
  typeof quickActionsHooks.useStartScan
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
  permissions: [
    'create_project',
    'start_scan',
    'manage_team',
    'view_analytics',
    'export_data',
    'manage_settings',
  ],
};

const mockLimitedUser = {
  ...mockUser,
  role: 'viewer' as const,
  permissions: ['view_analytics'],
};

// Mock quick actions data
const mockQuickActions = [
  {
    id: 'create-project',
    title: 'Create New Project',
    description: 'Start monitoring a new website or domain',
    icon: 'plus',
    category: 'project',
    permission: 'create_project',
    shortcut: 'Ctrl+N',
    featured: true,
  },
  {
    id: 'start-scan',
    title: 'Quick Scan',
    description: 'Run an immediate security scan',
    icon: 'scan',
    category: 'security',
    permission: 'start_scan',
    shortcut: 'Ctrl+S',
    featured: true,
  },
  {
    id: 'invite-member',
    title: 'Invite Team Member',
    description: 'Add a new member to your team',
    icon: 'user-plus',
    category: 'team',
    permission: 'manage_team',
    shortcut: 'Ctrl+I',
    featured: false,
  },
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Open detailed analytics dashboard',
    icon: 'chart',
    category: 'analytics',
    permission: 'view_analytics',
    shortcut: 'Ctrl+A',
    featured: true,
  },
  {
    id: 'export-report',
    title: 'Export Report',
    description: 'Generate and download security report',
    icon: 'download',
    category: 'reporting',
    permission: 'export_data',
    shortcut: 'Ctrl+E',
    featured: false,
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage account and system settings',
    icon: 'settings',
    category: 'system',
    permission: 'manage_settings',
    shortcut: 'Ctrl+,',
    featured: false,
  },
];

describe('QuickActionsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    mockUseCreateProject.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseStartScan.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseQuickActions.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      expect(screen.getByTestId('quick-actions-skeleton')).toBeInTheDocument();
    });
  });

  describe('Quick Actions Display', () => {
    it('should display available quick actions', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check action titles
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
      expect(screen.getByText('Quick Scan')).toBeInTheDocument();
      expect(screen.getByText('Invite Team Member')).toBeInTheDocument();
      expect(screen.getByText('View Analytics')).toBeInTheDocument();

      // Check action descriptions
      expect(screen.getByText('Start monitoring a new website or domain')).toBeInTheDocument();
      expect(screen.getByText('Run an immediate security scan')).toBeInTheDocument();
    });

    it('should show keyboard shortcuts', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check keyboard shortcuts
      expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+I')).toBeInTheDocument();
      expect(screen.getByText('Ctrl+A')).toBeInTheDocument();
    });

    it('should highlight featured actions', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Featured actions should have special styling
      const featuredActions = container.querySelectorAll('[data-featured="true"]');
      expect(featuredActions).toHaveLength(3); // create-project, start-scan, view-analytics
    });

    it('should group actions by category', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check category headers
      expect(screen.getByText('Project Management')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Team Management')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  describe('Permission-based Visibility', () => {
    it('should only show actions user has permission for', () => {
      mockUseAuth.mockReturnValue({
        user: mockLimitedUser, // Only has view_analytics permission
        isAuthenticated: true,
        isLoading: false,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Should only show analytics action
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
      
      // Should not show restricted actions
      expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
      expect(screen.queryByText('Quick Scan')).not.toBeInTheDocument();
      expect(screen.queryByText('Invite Team Member')).not.toBeInTheDocument();
    });

    it('should show all actions for admin users', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Should show all actions
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
      expect(screen.getByText('Quick Scan')).toBeInTheDocument();
      expect(screen.getByText('Invite Team Member')).toBeInTheDocument();
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
      expect(screen.getByText('Export Report')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should disable actions when user lacks permission', () => {
      mockUseAuth.mockReturnValue({
        user: mockLimitedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Analytics action should be enabled
      const analyticsButton = screen.getByRole('button', { name: /view analytics/i });
      expect(analyticsButton).not.toBeDisabled();
    });
  });

  describe('Action Execution', () => {
    it('should execute create project action', async () => {
      const mockCreateProject = jest.fn();
      mockUseCreateProject.mockReturnValue({
        mutate: mockCreateProject,
        isPending: false,
        error: null,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Click create project button
      const createProjectButton = screen.getByRole('button', { name: /create new project/i });
      await userEvent.click(createProjectButton);

      // Should open project creation modal/form
      expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();
    });

    it('should execute quick scan action', async () => {
      const mockStartScan = jest.fn();
      mockUseStartScan.mockReturnValue({
        mutate: mockStartScan,
        isPending: false,
        error: null,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Click quick scan button
      const quickScanButton = screen.getByRole('button', { name: /quick scan/i });
      await userEvent.click(quickScanButton);

      // Should open scan configuration modal
      expect(screen.getByTestId('quick-scan-modal')).toBeInTheDocument();
    });

    it('should navigate to analytics when analytics action is clicked', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Click analytics button
      const analyticsButton = screen.getByRole('button', { name: /view analytics/i });
      await userEvent.click(analyticsButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/analytics');
    });

    it('should show loading state during action execution', () => {
      mockUseCreateProject.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Should show loading spinner on create project button
      expect(screen.getByTestId('create-project-loading')).toBeInTheDocument();
      
      // Button should be disabled
      const createProjectButton = screen.getByRole('button', { name: /creating/i });
      expect(createProjectButton).toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard shortcuts', async () => {
      const mockCreateProject = jest.fn();
      mockUseCreateProject.mockReturnValue({
        mutate: mockCreateProject,
        isPending: false,
        error: null,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Simulate Ctrl+N keyboard shortcut
      fireEvent.keyDown(document, { key: 'n', ctrlKey: true });

      // Should trigger create project action
      await waitFor(() => {
        expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();
      });
    });

    it('should be navigable with tab key', async () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Tab through action buttons
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /create new project/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /quick scan/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /invite team member/i })).toHaveFocus();
    });

    it('should execute action on Enter key', async () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Focus on create project button
      const createProjectButton = screen.getByRole('button', { name: /create new project/i });
      createProjectButton.focus();

      // Press Enter
      fireEvent.keyDown(createProjectButton, { key: 'Enter' });

      // Should trigger action
      await waitFor(() => {
        expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();
      });
    });
  });

  describe('Search and Filtering', () => {
    it('should filter actions by search query', async () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Type in search box
      const searchInput = screen.getByPlaceholderText(/search actions/i);
      await userEvent.type(searchInput, 'scan');

      // Should only show scan-related actions
      expect(screen.getByText('Quick Scan')).toBeInTheDocument();
      expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
      expect(screen.queryByText('Invite Team Member')).not.toBeInTheDocument();
    });

    it('should show no results message when search returns empty', async () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Search for non-existent action
      const searchInput = screen.getByPlaceholderText(/search actions/i);
      await userEvent.type(searchInput, 'nonexistent');

      expect(screen.getByText(/no actions found/i)).toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', async () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Type in search box
      const searchInput = screen.getByPlaceholderText(/search actions/i);
      await userEvent.type(searchInput, 'scan');

      // Click clear button
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      await userEvent.click(clearButton);

      // Should show all actions again
      expect(screen.getByText('Create New Project')).toBeInTheDocument();
      expect(screen.getByText('Quick Scan')).toBeInTheDocument();
      expect(screen.getByText('Invite Team Member')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch quick actions');
      mockUseQuickActions.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load quick actions/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle action execution errors', async () => {
      const mockError = new Error('Failed to create project');
      mockUseCreateProject.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: mockError,
      });

      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Should show error message
      expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check for panel structure
      expect(screen.getByRole('region', { name: /quick actions/i })).toBeInTheDocument();

      // Check for proper headings
      expect(screen.getByRole('heading', { name: /quick actions/i })).toBeInTheDocument();

      // Check for button roles
      expect(screen.getAllByRole('button')).toHaveLength(6); // All action buttons
    });

    it('should provide descriptive button labels', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check for descriptive labels
      expect(screen.getByLabelText(/create new project - start monitoring a new website/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quick scan - run an immediate security scan/i)).toBeInTheDocument();
    });

    it('should announce keyboard shortcuts to screen readers', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check for keyboard shortcut announcements
      expect(screen.getByText(/keyboard shortcut ctrl\+n/i)).toBeInTheDocument();
      expect(screen.getByText(/keyboard shortcut ctrl\+s/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check for responsive grid
      const actionsGrid = container.querySelector('.grid-cols-1');
      expect(actionsGrid).toBeInTheDocument();
      
      // Check for mobile-specific layout
      const mobileLayout = container.querySelector('.sm\\:grid-cols-2');
      expect(mobileLayout).toBeInTheDocument();
    });

    it('should show compact view on small screens', () => {
      mockUseQuickActions.mockReturnValue({
        data: mockQuickActions,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <QuickActionsPanel />
        </Wrapper>
      );

      // Check for compact action cards
      const compactCards = container.querySelectorAll('.p-3');
      expect(compactCards.length).toBeGreaterThan(0);
    });
  });
});