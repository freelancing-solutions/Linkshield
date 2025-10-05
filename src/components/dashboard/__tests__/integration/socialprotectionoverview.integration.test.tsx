/**
 * SocialProtectionOverview Integration Tests
 * 
 * Tests the complete data flow for social protection overview including:
 * - Extension status and settings
 * - Bot health monitoring
 * - Algorithm health analysis
 * - Crisis alerts
 * - Data synchronization
 * - Real-time updates and cache invalidation
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { env } from '@/config/env';
import { SocialProtectionOverview } from '@/components/dashboard/SocialProtectionOverview';
import { socialProtectionHandlers } from '@/tests/msw/handlers/socialProtectionHandlers';
import { dashboardHandlers } from '@/tests/msw/handlers/dashboardHandlers';
import { server } from '@/tests/msw/server';
import { rest } from 'msw';
import { useAuthStore } from '@/stores/authStore';

const API = env.NEXT_PUBLIC_API_BASE_URL;

// Extended handlers with state management for testing
let extensionSettings = {
  real_time_analysis: true,
  advanced_warnings: true,
  auto_sync: true,
  sync_interval: 300,
};

let extensionStatus = {
  installed: true,
  version: '1.2.3',
  last_sync: new Date().toISOString(),
  total_scans: 15420,
  threats_blocked: 287,
  sites_protected: 1250,
  update_available: false,
};

let botHealth = {
  overall_status: 'online' as const,
  services: [
    { service_name: 'crawler', status: 'online' as const, uptime_percentage: 99.9 },
    { service_name: 'analyzer', status: 'online' as const, uptime_percentage: 98.5 },
  ],
  last_check: new Date().toISOString(),
};

let algorithmHealth = {
  visibility_score: 85,
  engagement_score: 92,
  penalty_detected: false,
  overall_health: 'good' as const,
  last_analysis: new Date().toISOString(),
  platforms: [
    { platform: 'facebook', visibility_score: 85, engagement_score: 90, penalty_detected: false, health_status: 'good' as const },
    { platform: 'twitter', visibility_score: 88, engagement_score: 94, penalty_detected: false, health_status: 'good' as const },
  ],
};

const testHandlers = [
  ...socialProtectionHandlers,
  ...dashboardHandlers,
  
  // Overview endpoint
  rest.get(`${API}/dashboard/social-protection/overview`, (req, res, ctx) => {
    return res(ctx.json({
      project_id: 'test-project',
      extension_status: extensionStatus,
      bot_status: {
        active_bots: 2,
        total_analyses: 500,
        threats_detected: 15,
        avg_response_time: 1.2,
        platform_breakdown: {},
      },
      algorithm_health: algorithmHealth,
      crisis_alerts_count: 0,
      recent_analyses: 25,
    }));
  }),
  
  // Extension analytics
  rest.get(`${API}/social-protection/extension/analytics`, (req, res, ctx) => {
    return res(ctx.json({
      total_scans: 15420,
      threats_blocked: 287,
      sites_protected: 1250,
      scan_history: [],
      threat_breakdown: {},
      protection_stats: {},
    }));
  }),

  // Extension settings
  rest.get(`${API}/social-protection/extension/settings`, (req, res, ctx) => {
    return res(ctx.json(extensionSettings));
  }),
  
  rest.put(`${API}/social-protection/extension/settings`, async (req, res, ctx) => {
    const updates = await req.json();
    Object.assign(extensionSettings, updates);
    return res(ctx.json(extensionSettings));
  }),
  
  // Extension status endpoint
  rest.get(`${API}/social-protection/extension/status`, (req, res, ctx) => {
    return res(ctx.json(extensionStatus));
  }),
  
  // Bot health endpoint
  rest.get(`${API}/bots/health`, (req, res, ctx) => {
    return res(ctx.json(botHealth));
  }),
  
  // Extension sync endpoint
  rest.post(`${API}/social-protection/extension/sync`, (req, res, ctx) => {
    extensionStatus.last_sync = new Date().toISOString();
    extensionStatus.total_scans += 50;
    extensionStatus.threats_blocked += 3;
    return res(ctx.json({ success: true }));
  }),
  
  // Bot restart endpoint
  rest.post(`${API}/bots/:serviceName/restart`, (req, res, ctx) => {
    const { serviceName } = req.params as { serviceName: string };
    const service = botHealth.services.find(s => s.service_name === serviceName);
    if (service) {
      service.status = 'online';
      service.uptime_percentage = 99.9;
    }
    return res(ctx.json({ success: true }));
  }),
  
  // Algorithm health analysis endpoints
  rest.post(`${API}/social/algorithm-health/visibility/analyze`, (req, res, ctx) => {
    algorithmHealth.visibility_score = Math.floor(Math.random() * 20) + 80;
    algorithmHealth.last_analysis = new Date().toISOString();
    return res(ctx.json({
      score: algorithmHealth.visibility_score,
      trend: 'up',
      factors: [{ name: 'Content Quality', value: 85, impact: 'positive' }],
      recommendations: ['Improve hashtag usage', 'Post at optimal times'],
    }));
  }),
  
  rest.post(`${API}/social/algorithm-health/engagement/analyze`, (req, res, ctx) => {
    algorithmHealth.engagement_score = Math.floor(Math.random() * 15) + 85;
    algorithmHealth.last_analysis = new Date().toISOString();
    return res(ctx.json({
      score: algorithmHealth.engagement_score,
      trend: 'stable',
      metrics: { likes: 1250, comments: 89, shares: 45, reach: 15000, engagement_rate: 4.2 },
      recommendations: ['Engage with comments', 'Use interactive content'],
    }));
  }),
  
  rest.post(`${API}/social/algorithm-health/penalty/detect`, (req, res, ctx) => {
    algorithmHealth.penalty_detected = false;
    algorithmHealth.last_analysis = new Date().toISOString();
    return res(ctx.json({
      detected: false,
      recommendations: ['Monitor posting frequency', 'Check content guidelines'],
    }));
  }),
];

// Extend existing server with test handlers
server.use(...testHandlers);

// Mock React Query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, cacheTime: 0 },
    mutations: { retry: false },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('SocialProtectionOverview Integration', () => {
  beforeAll(() => {
    // Set up authentication state
    useAuthStore.setState({
      user: {
        id: 'test-user',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'ADMIN' as const,
        is_verified: true,
      },
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });
  
  afterEach(() => {
    server.resetHandlers();
    // Reset state
    extensionSettings = {
      real_time_analysis: true,
      advanced_warnings: true,
      auto_sync: true,
      sync_interval: 300,
    };
    extensionStatus = {
      installed: true,
      version: '1.2.3',
      last_sync: new Date().toISOString(),
      total_scans: 15420,
      threats_blocked: 287,
      sites_protected: 1250,
      update_available: false,
    };
  });
  
  afterAll(() => {
    // Reset auth state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    });
    // Don't close the server as it's managed by jest.setup.js
    server.resetHandlers();
  });

  it('should load and display complete social protection overview', async () => {
    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for all sections to load
    await waitFor(() => {
      expect(screen.getByText('Social Protection Overview')).toBeInTheDocument();
    });



    // Check extension status section
    expect(screen.getByText('Extension Status')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Version 1.2.3')).toBeInTheDocument();
    expect(screen.getByText(/15[,\s]420 scans/)).toBeInTheDocument(); // total scans (handles both comma and space)
    expect(screen.getByText('287 threats blocked')).toBeInTheDocument(); // threats blocked

    // Check bot health section
    expect(screen.getByText('Bot Health')).toBeInTheDocument();
    expect(screen.getAllByText('online')).toHaveLength(3); // Overall status + 2 services
    expect(screen.getByText('2 services')).toBeInTheDocument(); // Service count
    
    expect(screen.getAllByText('crawler')).toHaveLength(2); // Service name appears twice
    expect(screen.getAllByText('analyzer')).toHaveLength(2); // Service name appears twice

    // Check algorithm health section
    expect(screen.getByText('Algorithm Health')).toBeInTheDocument();

    expect(screen.getByText('good')).toBeInTheDocument(); // overall_health (lowercase)
    expect(screen.getByText('85%')).toBeInTheDocument(); // visibility score with %
    expect(screen.getByText('92%')).toBeInTheDocument(); // engagement score with %
  });

  it('should handle extension settings updates', async () => {
    const user = userEvent.setup();
    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Extension Settings')).toBeInTheDocument();
    });

    // Find settings toggle
    const realTimeToggle = screen.getByLabelText('Real-time Analysis');
    expect(realTimeToggle).toBeChecked();

    // Toggle setting
    await user.click(realTimeToggle);

    // Verify setting was updated
    await waitFor(() => {
      expect(realTimeToggle).not.toBeChecked();
    });

    // Verify API call was made
    expect(extensionSettings.real_time_analysis).toBe(false);
  });

  it('should handle extension sync action', async () => {
    const user = userEvent.setup();
    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Extension Status')).toBeInTheDocument();
    });

    // Find sync button
    const syncButton = screen.getByRole('button', { name: /sync/i });
    
    // Get initial scan count
    const initialScans = extensionStatus.total_scans;

    // Click sync
    await user.click(syncButton);

    // Verify sync completed and data updated
    await waitFor(() => {
      expect(screen.getByText(/sync completed/i)).toBeInTheDocument();
    });

    // Verify scan count increased
    expect(extensionStatus.total_scans).toBeGreaterThan(initialScans);
  });

  it('should handle bot restart functionality', async () => {
    const user = userEvent.setup();
    
    // Set bot to degraded state
    botHealth.services[0].status = 'degraded';
    botHealth.overall_status = 'degraded';
    
    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Bot Health')).toBeInTheDocument();
    });

    // Find restart button for crawler service
    const crawlerSection = screen.getByText('crawler').closest('div');
    const restartButton = within(crawlerSection!).getByRole('button', { name: /restart/i });

    // Click restart
    await user.click(restartButton);

    // Verify service was restarted
    await waitFor(() => {
      expect(botHealth.services[0].status).toBe('online');
      expect(botHealth.services[0].uptime_percentage).toBe(99.9);
    });
  });

  it('should perform algorithm health analysis', async () => {
    const user = userEvent.setup();
    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Algorithm Health')).toBeInTheDocument();
    });

    // Get initial scores
    const initialVisibility = algorithmHealth.visibility_score;
    const initialEngagement = algorithmHealth.engagement_score;

    // Find analyze buttons
    const visibilityButton = screen.getByRole('button', { name: /analyze visibility/i });
    const engagementButton = screen.getByRole('button', { name: /analyze engagement/i });

    // Perform analyses
    await user.click(visibilityButton);
    await user.click(engagementButton);

    // Verify scores were updated
    await waitFor(() => {
      expect(algorithmHealth.visibility_score).not.toBe(initialVisibility);
      expect(algorithmHealth.engagement_score).not.toBe(initialEngagement);
    });
  });

  it('should handle crisis alerts integration', async () => {
    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Social Protection Overview')).toBeInTheDocument();
    });

    // Check crisis alerts section
    expect(screen.getByText('Crisis Alerts')).toBeInTheDocument();
    
    // Verify crisis alerts count is displayed
    const crisisSection = screen.getByText('Crisis Alerts').closest('div');
    expect(within(crisisSection!).getByText('0')).toBeInTheDocument(); // Assuming no active crises
  });

  it('should handle loading states correctly', async () => {
    // Add delay to handlers to test loading states
    server.use(
      rest.get(`${API}/dashboard/social-protection/overview`, (req, res, ctx) => {
        return res(ctx.delay(100), ctx.json({
          project_id: 'test-project',
          extension_status: extensionStatus,
          bot_status: {
            active_bots: 2,
            total_analyses: 500,
            threats_detected: 15,
            avg_response_time: 1.2,
            platform_breakdown: {},
          },
          algorithm_health: algorithmHealth,
          crisis_alerts_count: 0,
          recent_analyses: 25,
        }));
      })
    );

    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Check loading states are shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Social Protection Overview')).toBeInTheDocument();
    });

    // Verify loading states are replaced with data
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('should handle error states and recovery', async () => {
    // Make extension status endpoint fail
    server.use(
      rest.get(`${API}/social-protection/extension/status`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
      })
    );

    render(<SocialProtectionOverview />, { wrapper: TestWrapper });

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/error loading extension status/i)).toBeInTheDocument();
    });

    // Verify retry functionality
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    // Fix the endpoint and restore successful response
    server.use(
      rest.get(`${API}/social-protection/extension/status`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(extensionStatus));
      })
    );

    // Click retry
    const user = userEvent.setup();
    await user.click(retryButton);

    // Verify error is resolved
    await waitFor(() => {
      expect(screen.queryByText(/error loading extension status/i)).not.toBeInTheDocument();
      expect(screen.getByText('Extension Status')).toBeInTheDocument();
    });
  });

  it('should cache and invalidate data correctly', async () => {
    const queryClient = createTestQueryClient();
    
    const WrapperWithClient = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { rerender } = render(<SocialProtectionOverview />, { wrapper: WrapperWithClient });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Social Protection Overview')).toBeInTheDocument();
    });

    // Get initial data
    const initialExtensionStatus = extensionStatus;

    // Update extension status
    extensionStatus.total_scans = 20000;
    extensionStatus.threats_blocked = 350;

    // Force refetch by invalidating queries
    queryClient.invalidateQueries({ queryKey: ['social-protection-overview'] });

    // Rerender to trigger refetch
    rerender(<SocialProtectionOverview />);

    // Verify data was updated
    await waitFor(() => {
      expect(screen.getByText('20,000')).toBeInTheDocument();
      expect(screen.getByText('350')).toBeInTheDocument();
    });
  });
});