/**
 * SocialProtectionOverview Component Tests
 * 
 * Tests for the social protection overview component including:
 * - Social media protection status display
 * - Platform monitoring and coverage
 * - Threat detection and blocking metrics
 * - Privacy settings and controls
 * - Real-time protection updates
 * - Accessibility and responsive design
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocialProtectionOverview } from '../SocialProtectionOverview';
import * as socialHooks from '@/hooks/dashboard/use-social-protection';
import * as authHooks from '@/hooks/use-auth';

// Mock the hooks
jest.mock('@/hooks/dashboard/use-social-protection');
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
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

const mockUseSocialProtection = socialHooks.useSocialProtection as jest.MockedFunction<
  typeof socialHooks.useSocialProtection
>;

const mockUseUpdateProtectionSettings = socialHooks.useUpdateProtectionSettings as jest.MockedFunction<
  typeof socialHooks.useUpdateProtectionSettings
>;

const mockUseTogglePlatformProtection = socialHooks.useTogglePlatformProtection as jest.MockedFunction<
  typeof socialHooks.useTogglePlatformProtection
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
  permissions: ['view_social_protection', 'manage_social_protection'],
};

// Mock social protection data
const mockSocialProtection = {
  overview: {
    status: 'active' as const,
    protectionLevel: 'high' as const,
    connectedPlatforms: 5,
    activePlatforms: 4,
    totalScans: 15420,
    threatsBlocked: 287,
    privacyScore: 92,
    lastUpdate: '2024-01-15T10:30:00Z',
  },
  platforms: [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'facebook',
      status: 'active' as const,
      connected: true,
      protectionEnabled: true,
      lastScan: '2024-01-15T10:25:00Z',
      metrics: {
        totalScans: 4520,
        threatsDetected: 89,
        threatsBlocked: 87,
        privacyIssues: 12,
        dataExposure: 'medium' as const,
      },
      settings: {
        realTimeMonitoring: true,
        threatBlocking: true,
        privacyAnalysis: true,
        contentFiltering: true,
        notificationLevel: 'medium' as const,
      },
      health: {
        score: 85,
        status: 'good' as const,
        issues: [],
        warnings: [
          {
            id: 'privacy-setting',
            type: 'privacy',
            severity: 'low',
            message: 'Some privacy settings could be improved',
            timestamp: '2024-01-15T09:30:00Z',
          },
        ],
      },
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: 'twitter',
      status: 'active' as const,
      connected: true,
      protectionEnabled: true,
      lastScan: '2024-01-15T10:20:00Z',
      metrics: {
        totalScans: 3890,
        threatsDetected: 67,
        threatsBlocked: 65,
        privacyIssues: 8,
        dataExposure: 'low' as const,
      },
      settings: {
        realTimeMonitoring: true,
        threatBlocking: true,
        privacyAnalysis: true,
        contentFiltering: false,
        notificationLevel: 'high' as const,
      },
      health: {
        score: 94,
        status: 'excellent' as const,
        issues: [],
        warnings: [],
      },
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'instagram',
      status: 'warning' as const,
      connected: true,
      protectionEnabled: true,
      lastScan: '2024-01-15T09:45:00Z',
      metrics: {
        totalScans: 2780,
        threatsDetected: 45,
        threatsBlocked: 42,
        privacyIssues: 18,
        dataExposure: 'high' as const,
      },
      settings: {
        realTimeMonitoring: true,
        threatBlocking: true,
        privacyAnalysis: true,
        contentFiltering: true,
        notificationLevel: 'high' as const,
      },
      health: {
        score: 67,
        status: 'warning' as const,
        issues: [],
        warnings: [
          {
            id: 'high-exposure',
            type: 'privacy',
            severity: 'medium',
            message: 'High data exposure detected',
            timestamp: '2024-01-15T09:45:00Z',
          },
          {
            id: 'outdated-settings',
            type: 'configuration',
            severity: 'low',
            message: 'Privacy settings need review',
            timestamp: '2024-01-15T09:30:00Z',
          },
        ],
      },
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'linkedin',
      status: 'inactive' as const,
      connected: true,
      protectionEnabled: false,
      lastScan: '2024-01-14T15:30:00Z',
      metrics: {
        totalScans: 1890,
        threatsDetected: 23,
        threatsBlocked: 20,
        privacyIssues: 5,
        dataExposure: 'low' as const,
      },
      settings: {
        realTimeMonitoring: false,
        threatBlocking: false,
        privacyAnalysis: false,
        contentFiltering: false,
        notificationLevel: 'low' as const,
      },
      health: {
        score: 45,
        status: 'inactive' as const,
        issues: [
          {
            id: 'protection-disabled',
            type: 'configuration',
            severity: 'medium',
            message: 'Protection is currently disabled',
            timestamp: '2024-01-14T15:30:00Z',
          },
        ],
        warnings: [],
      },
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: 'tiktok',
      status: 'disconnected' as const,
      connected: false,
      protectionEnabled: false,
      lastScan: null,
      metrics: {
        totalScans: 0,
        threatsDetected: 0,
        threatsBlocked: 0,
        privacyIssues: 0,
        dataExposure: 'unknown' as const,
      },
      settings: {
        realTimeMonitoring: false,
        threatBlocking: false,
        privacyAnalysis: false,
        contentFiltering: false,
        notificationLevel: 'low' as const,
      },
      health: {
        score: 0,
        status: 'disconnected' as const,
        issues: [
          {
            id: 'not-connected',
            type: 'connection',
            severity: 'low',
            message: 'Platform not connected',
            timestamp: '2024-01-15T10:30:00Z',
          },
        ],
        warnings: [],
      },
    },
  ],
  threats: {
    recent: [
      {
        id: 'threat-1',
        platform: 'facebook',
        type: 'phishing',
        severity: 'high',
        description: 'Suspicious link detected in message',
        timestamp: '2024-01-15T10:15:00Z',
        status: 'blocked',
        details: {
          source: 'direct_message',
          url: 'https://suspicious-site.com',
          riskScore: 95,
        },
      },
      {
        id: 'threat-2',
        platform: 'twitter',
        type: 'malware',
        severity: 'critical',
        description: 'Malicious attachment in tweet',
        timestamp: '2024-01-15T09:45:00Z',
        status: 'blocked',
        details: {
          source: 'tweet_attachment',
          filename: 'document.exe',
          riskScore: 98,
        },
      },
      {
        id: 'threat-3',
        platform: 'instagram',
        type: 'scam',
        severity: 'medium',
        description: 'Fake giveaway post detected',
        timestamp: '2024-01-15T09:30:00Z',
        status: 'flagged',
        details: {
          source: 'post',
          content: 'Win iPhone 15 - Click here!',
          riskScore: 78,
        },
      },
    ],
    statistics: {
      total: 287,
      blocked: 275,
      flagged: 12,
      byType: {
        phishing: 156,
        malware: 89,
        scam: 42,
      },
      byPlatform: {
        facebook: 89,
        twitter: 67,
        instagram: 45,
        linkedin: 23,
        tiktok: 0,
      },
    },
  },
  privacy: {
    overallScore: 92,
    platformScores: {
      facebook: 85,
      twitter: 94,
      instagram: 67,
      linkedin: 45,
      tiktok: 0,
    },
    issues: [
      {
        platform: 'instagram',
        type: 'data_exposure',
        severity: 'medium',
        description: 'Profile information is publicly visible',
        recommendation: 'Review privacy settings',
      },
      {
        platform: 'linkedin',
        type: 'tracking',
        severity: 'low',
        description: 'Ad tracking is enabled',
        recommendation: 'Disable ad personalization',
      },
    ],
    recommendations: [
      'Enable two-factor authentication on all platforms',
      'Review and update privacy settings monthly',
      'Limit personal information in public profiles',
      'Use strong, unique passwords for each platform',
    ],
  },
};

describe('SocialProtectionOverview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    mockUseUpdateProtectionSettings.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseTogglePlatformProtection.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseSocialProtection.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      expect(screen.getByTestId('social-protection-skeleton')).toBeInTheDocument();
    });
  });

  describe('Protection Overview Display', () => {
    it('should display overall protection status', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check overall status
      expect(screen.getByText('Social Protection')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('High Protection')).toBeInTheDocument();
      expect(screen.getByText('92')).toBeInTheDocument(); // Privacy score
    });

    it('should display platform statistics', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check platform stats
      expect(screen.getByText('5')).toBeInTheDocument(); // Connected platforms
      expect(screen.getByText('4')).toBeInTheDocument(); // Active platforms
      expect(screen.getByText('15,420')).toBeInTheDocument(); // Total scans
      expect(screen.getByText('287')).toBeInTheDocument(); // Threats blocked
    });

    it('should display individual platform cards', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check platform names
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('Twitter/X')).toBeInTheDocument();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('TikTok')).toBeInTheDocument();
    });

    it('should display platform status indicators', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check status indicators
      expect(screen.getByTestId('status-active-facebook')).toBeInTheDocument();
      expect(screen.getByTestId('status-active-twitter')).toBeInTheDocument();
      expect(screen.getByTestId('status-warning-instagram')).toBeInTheDocument();
      expect(screen.getByTestId('status-inactive-linkedin')).toBeInTheDocument();
      expect(screen.getByTestId('status-disconnected-tiktok')).toBeInTheDocument();
    });

    it('should display platform metrics', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check platform metrics
      expect(screen.getByText('4,520')).toBeInTheDocument(); // Facebook scans
      expect(screen.getByText('89')).toBeInTheDocument(); // Facebook threats
      expect(screen.getByText('3,890')).toBeInTheDocument(); // Twitter scans
      expect(screen.getByText('67')).toBeInTheDocument(); // Twitter threats
    });

    it('should display privacy scores', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check privacy scores
      expect(screen.getByText('85')).toBeInTheDocument(); // Facebook
      expect(screen.getByText('94')).toBeInTheDocument(); // Twitter
      expect(screen.getByText('67')).toBeInTheDocument(); // Instagram
      expect(screen.getByText('45')).toBeInTheDocument(); // LinkedIn
    });
  });

  describe('Threat Detection Display', () => {
    it('should display recent threats', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check recent threats
      expect(screen.getByText('Suspicious link detected in message')).toBeInTheDocument();
      expect(screen.getByText('Malicious attachment in tweet')).toBeInTheDocument();
      expect(screen.getByText('Fake giveaway post detected')).toBeInTheDocument();
    });

    it('should display threat severity indicators', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check severity indicators
      expect(screen.getByTestId('severity-high-threat-1')).toBeInTheDocument();
      expect(screen.getByTestId('severity-critical-threat-2')).toBeInTheDocument();
      expect(screen.getByTestId('severity-medium-threat-3')).toBeInTheDocument();
    });

    it('should display threat statistics chart', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check for chart components
      expect(screen.getByTestId('threats-by-type-chart')).toBeInTheDocument();
      expect(screen.getByTestId('threats-by-platform-chart')).toBeInTheDocument();
    });

    it('should show threat action status', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check threat status
      expect(screen.getAllByText('Blocked')).toHaveLength(2);
      expect(screen.getByText('Flagged')).toBeInTheDocument();
    });
  });

  describe('Privacy Analysis Display', () => {
    it('should display privacy issues', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check privacy issues
      expect(screen.getByText('Profile information is publicly visible')).toBeInTheDocument();
      expect(screen.getByText('Ad tracking is enabled')).toBeInTheDocument();
    });

    it('should display privacy recommendations', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check recommendations
      expect(screen.getByText('Enable two-factor authentication on all platforms')).toBeInTheDocument();
      expect(screen.getByText('Review and update privacy settings monthly')).toBeInTheDocument();
      expect(screen.getByText('Limit personal information in public profiles')).toBeInTheDocument();
    });

    it('should display privacy score breakdown', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check privacy score chart
      expect(screen.getByTestId('privacy-scores-chart')).toBeInTheDocument();
    });
  });

  describe('Platform Management Actions', () => {
    it('should provide toggle protection action', async () => {
      const mockToggle = jest.fn();
      mockUseTogglePlatformProtection.mockReturnValue({
        mutate: mockToggle,
        isPending: false,
        error: null,
      });

      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Toggle protection for LinkedIn (currently disabled)
      const toggleButton = screen.getByRole('button', { name: /enable linkedin protection/i });
      await userEvent.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledWith({
        platformId: 'linkedin',
        enabled: true,
      });
    });

    it('should provide platform configuration action', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Click configure button
      const configButton = screen.getByRole('button', { name: /configure facebook/i });
      await userEvent.click(configButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/social-protection/facebook');
    });

    it('should provide connect platform action', async () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Click connect button for TikTok
      const connectButton = screen.getByRole('button', { name: /connect tiktok/i });
      await userEvent.click(connectButton);

      // Should open connection modal
      expect(screen.getByText(/connect tiktok account/i)).toBeInTheDocument();
    });

    it('should update protection settings', async () => {
      const mockUpdateSettings = jest.fn();
      mockUseUpdateProtectionSettings.mockReturnValue({
        mutate: mockUpdateSettings,
        isPending: false,
        error: null,
      });

      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Open settings for Facebook
      const settingsButton = screen.getByRole('button', { name: /facebook settings/i });
      await userEvent.click(settingsButton);

      // Should open settings modal
      expect(screen.getByText(/protection settings/i)).toBeInTheDocument();

      // Toggle a setting
      const contentFilterToggle = screen.getByLabelText(/content filtering/i);
      await userEvent.click(contentFilterToggle);

      // Save settings
      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      expect(mockUpdateSettings).toHaveBeenCalledWith({
        platformId: 'facebook',
        settings: expect.objectContaining({
          contentFiltering: false, // Toggled from true
        }),
      });
    });

    it('should disable actions based on permissions', () => {
      // Mock user without manage permissions
      mockUseAuth.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['view_social_protection'], // No manage permission
        },
        isAuthenticated: true,
        isLoading: false,
      });

      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Management actions should be disabled
      const toggleButton = screen.getByRole('button', { name: /enable linkedin protection/i });
      expect(toggleButton).toBeDisabled();

      const settingsButton = screen.getByRole('button', { name: /facebook settings/i });
      expect(settingsButton).toBeDisabled();
    });

    it('should show loading state during actions', () => {
      mockUseTogglePlatformProtection.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Should show loading spinner
      expect(screen.getByTestId('toggle-loading')).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    it('should refresh data periodically', async () => {
      const mockRefetch = jest.fn();
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Wait for auto-refresh interval
      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      }, { timeout: 31000 }); // 30s interval + buffer
    });

    it('should handle real-time threat updates', async () => {
      const { rerender } = render(
        <QueryClientProvider client={new QueryClient()}>
          <SocialProtectionOverview />
        </QueryClientProvider>
      );

      // Initially show current threats
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <SocialProtectionOverview />
        </QueryClientProvider>
      );

      expect(screen.getByText('287')).toBeInTheDocument(); // Threats blocked

      // New threat detected
      const updatedData = {
        ...mockSocialProtection,
        overview: {
          ...mockSocialProtection.overview,
          threatsBlocked: 288,
        },
        threats: {
          ...mockSocialProtection.threats,
          statistics: {
            ...mockSocialProtection.threats.statistics,
            total: 288,
            blocked: 276,
          },
        },
      };

      mockUseSocialProtection.mockReturnValue({
        data: updatedData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <SocialProtectionOverview />
        </QueryClientProvider>
      );

      // Should reflect new threat count
      expect(screen.getByText('288')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch social protection data');
      mockUseSocialProtection.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load social protection/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle empty platform data', () => {
      const emptyData = {
        ...mockSocialProtection,
        platforms: [],
        overview: {
          ...mockSocialProtection.overview,
          connectedPlatforms: 0,
          activePlatforms: 0,
        },
      };

      mockUseSocialProtection.mockReturnValue({
        data: emptyData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      expect(screen.getByText(/no platforms connected/i)).toBeInTheDocument();
      expect(screen.getByText(/connect social media accounts/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check for proper headings
      expect(screen.getByRole('heading', { name: /social protection/i })).toBeInTheDocument();

      // Check for status announcements
      expect(screen.getByLabelText(/overall protection status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/facebook protection status/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByRole('button', { name: /configure facebook/i })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /facebook settings/i })).toHaveFocus();
    });

    it('should announce protection changes to screen readers', async () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Should have live region for status updates
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check for responsive grid layout
      const platformGrid = container.querySelector('.grid');
      expect(platformGrid).toBeInTheDocument();
    });

    it('should stack platform cards on small screens', () => {
      mockUseSocialProtection.mockReturnValue({
        data: mockSocialProtection,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <SocialProtectionOverview />
        </Wrapper>
      );

      // Check for mobile-friendly layout
      const mobileLayout = container.querySelector('.sm\\:grid-cols-1');
      expect(mobileLayout).toBeInTheDocument();
    });
  });
});