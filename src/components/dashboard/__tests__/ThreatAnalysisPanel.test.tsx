/**
 * ThreatAnalysisPanel Component Tests
 * 
 * Tests for the threat analysis panel component including:
 * - Threat detection and analysis display
 * - Risk assessment and scoring
 * - Threat categorization and filtering
 * - Real-time threat monitoring
 * - Threat response actions
 * - Accessibility and responsive design
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThreatAnalysisPanel } from '../ThreatAnalysisPanel';
import * as threatHooks from '@/hooks/dashboard/use-threat-analysis';
import * as authHooks from '@/hooks/use-auth';

// Mock the hooks
jest.mock('@/hooks/dashboard/use-threat-analysis');
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
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

const mockUseThreatAnalysis = threatHooks.useThreatAnalysis as jest.MockedFunction<
  typeof threatHooks.useThreatAnalysis
>;

const mockUseResolveThreat = threatHooks.useResolveThreat as jest.MockedFunction<
  typeof threatHooks.useResolveThreat
>;

const mockUseBlockThreat = threatHooks.useBlockThreat as jest.MockedFunction<
  typeof threatHooks.useBlockThreat
>;

const mockUseUpdateThreatStatus = threatHooks.useUpdateThreatStatus as jest.MockedFunction<
  typeof threatHooks.useUpdateThreatStatus
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
  permissions: ['view_threats', 'manage_threats', 'respond_to_threats'],
};

// Mock threat analysis data
const mockThreatAnalysis = {
  overview: {
    totalThreats: 1247,
    activeThreats: 89,
    resolvedThreats: 1158,
    criticalThreats: 12,
    highThreats: 34,
    mediumThreats: 43,
    lowThreats: 0,
    riskScore: 78,
    trendDirection: 'increasing' as const,
    lastUpdate: '2024-01-15T10:30:00Z',
  },
  threats: [
    {
      id: 'threat-001',
      type: 'malware',
      severity: 'critical',
      status: 'active',
      title: 'Advanced Persistent Threat Detected',
      description: 'Sophisticated malware attempting to establish persistence',
      source: 'endpoint_detection',
      targetAssets: ['workstation-045', 'server-web-01'],
      riskScore: 95,
      confidence: 0.92,
      firstDetected: '2024-01-15T09:15:00Z',
      lastSeen: '2024-01-15T10:25:00Z',
      indicators: [
        {
          type: 'file_hash',
          value: 'a1b2c3d4e5f6789012345678901234567890abcd',
          description: 'Malicious executable hash',
        },
        {
          type: 'ip_address',
          value: '192.168.1.100',
          description: 'Command and control server',
        },
        {
          type: 'domain',
          value: 'malicious-domain.com',
          description: 'C2 communication domain',
        },
      ],
      mitreTactics: ['initial-access', 'persistence', 'command-and-control'],
      mitreId: 'T1055',
      affectedUsers: ['user-456', 'user-789'],
      timeline: [
        {
          timestamp: '2024-01-15T09:15:00Z',
          event: 'Initial detection',
          details: 'Suspicious process execution detected',
        },
        {
          timestamp: '2024-01-15T09:30:00Z',
          event: 'Persistence established',
          details: 'Registry modification detected',
        },
        {
          timestamp: '2024-01-15T10:25:00Z',
          event: 'C2 communication',
          details: 'Outbound connection to suspicious domain',
        },
      ],
      recommendations: [
        'Isolate affected systems immediately',
        'Run full system scan with updated signatures',
        'Review network logs for lateral movement',
        'Update endpoint protection rules',
      ],
      metadata: {
        analyst: 'system',
        tags: ['apt', 'persistence', 'c2'],
        priority: 'urgent',
        assignedTo: 'security-team',
      },
    },
    {
      id: 'threat-002',
      type: 'phishing',
      severity: 'high',
      status: 'investigating',
      title: 'Credential Harvesting Campaign',
      description: 'Targeted phishing emails attempting to steal user credentials',
      source: 'email_security',
      targetAssets: ['email-server-01'],
      riskScore: 87,
      confidence: 0.89,
      firstDetected: '2024-01-15T08:45:00Z',
      lastSeen: '2024-01-15T10:15:00Z',
      indicators: [
        {
          type: 'email_sender',
          value: 'noreply@fake-bank.com',
          description: 'Spoofed sender address',
        },
        {
          type: 'url',
          value: 'https://fake-login-page.com/login',
          description: 'Credential harvesting page',
        },
      ],
      mitreTactics: ['initial-access', 'credential-access'],
      mitreId: 'T1566.001',
      affectedUsers: ['user-123', 'user-456', 'user-789'],
      timeline: [
        {
          timestamp: '2024-01-15T08:45:00Z',
          event: 'Email campaign detected',
          details: 'Multiple suspicious emails identified',
        },
        {
          timestamp: '2024-01-15T09:00:00Z',
          event: 'URL analysis completed',
          details: 'Malicious landing page confirmed',
        },
        {
          timestamp: '2024-01-15T10:15:00Z',
          event: 'User interaction detected',
          details: 'One user clicked suspicious link',
        },
      ],
      recommendations: [
        'Block sender domain immediately',
        'Remove emails from all inboxes',
        'Notify affected users about phishing attempt',
        'Implement additional email filtering rules',
      ],
      metadata: {
        analyst: 'analyst-001',
        tags: ['phishing', 'credentials', 'email'],
        priority: 'high',
        assignedTo: 'incident-response',
      },
    },
    {
      id: 'threat-003',
      type: 'vulnerability',
      severity: 'medium',
      status: 'resolved',
      title: 'Outdated Software Vulnerability',
      description: 'Critical security patch missing on multiple systems',
      source: 'vulnerability_scanner',
      targetAssets: ['workstation-012', 'workstation-034', 'workstation-067'],
      riskScore: 65,
      confidence: 0.95,
      firstDetected: '2024-01-14T14:30:00Z',
      lastSeen: '2024-01-15T08:00:00Z',
      indicators: [
        {
          type: 'cve',
          value: 'CVE-2024-0001',
          description: 'Remote code execution vulnerability',
        },
        {
          type: 'software_version',
          value: 'Adobe Reader 2023.001.20093',
          description: 'Vulnerable software version',
        },
      ],
      mitreTactics: ['initial-access', 'execution'],
      mitreId: 'T1203',
      affectedUsers: ['user-012', 'user-034', 'user-067'],
      timeline: [
        {
          timestamp: '2024-01-14T14:30:00Z',
          event: 'Vulnerability discovered',
          details: 'Automated scan identified missing patch',
        },
        {
          timestamp: '2024-01-15T06:00:00Z',
          event: 'Patch deployment started',
          details: 'Automated patching initiated',
        },
        {
          timestamp: '2024-01-15T08:00:00Z',
          event: 'Vulnerability resolved',
          details: 'All systems successfully patched',
        },
      ],
      recommendations: [
        'Verify patch installation on all systems',
        'Update vulnerability scanner signatures',
        'Review patch management process',
        'Schedule regular vulnerability assessments',
      ],
      metadata: {
        analyst: 'system',
        tags: ['vulnerability', 'patch', 'software'],
        priority: 'medium',
        assignedTo: 'it-operations',
      },
    },
  ],
  analytics: {
    threatTrends: {
      daily: [
        { date: '2024-01-09', threats: 45, resolved: 42 },
        { date: '2024-01-10', threats: 52, resolved: 48 },
        { date: '2024-01-11', threats: 38, resolved: 41 },
        { date: '2024-01-12', threats: 67, resolved: 59 },
        { date: '2024-01-13', threats: 73, resolved: 68 },
        { date: '2024-01-14', threats: 89, resolved: 82 },
        { date: '2024-01-15', threats: 94, resolved: 76 },
      ],
      weekly: [
        { week: '2024-W01', threats: 234, resolved: 221 },
        { week: '2024-W02', threats: 289, resolved: 267 },
        { week: '2024-W03', threats: 312, resolved: 298 },
      ],
    },
    threatTypes: [
      { type: 'malware', count: 456, percentage: 36.6 },
      { type: 'phishing', count: 342, percentage: 27.4 },
      { type: 'vulnerability', count: 289, percentage: 23.2 },
      { type: 'suspicious_activity', count: 160, percentage: 12.8 },
    ],
    severityDistribution: [
      { severity: 'critical', count: 12, percentage: 13.5 },
      { severity: 'high', count: 34, percentage: 38.2 },
      { severity: 'medium', count: 43, percentage: 48.3 },
      { severity: 'low', count: 0, percentage: 0 },
    ],
    topTargets: [
      { asset: 'workstation-045', threats: 23 },
      { asset: 'server-web-01', threats: 18 },
      { asset: 'email-server-01', threats: 15 },
      { asset: 'workstation-012', threats: 12 },
      { asset: 'database-server', threats: 9 },
    ],
    responseMetrics: {
      averageDetectionTime: 180, // seconds
      averageResponseTime: 900, // seconds
      averageResolutionTime: 3600, // seconds
      falsePositiveRate: 0.05,
      threatContainmentRate: 0.94,
    },
  },
  filters: {
    severity: ['critical', 'high', 'medium', 'low'],
    status: ['active', 'investigating', 'resolved', 'false_positive'],
    type: ['malware', 'phishing', 'vulnerability', 'suspicious_activity'],
    source: ['endpoint_detection', 'email_security', 'network_monitoring', 'vulnerability_scanner'],
    timeRange: '7d',
  },
};

describe('ThreatAnalysisPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    mockUseResolveThreat.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseBlockThreat.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });

    mockUseUpdateThreatStatus.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when data is loading', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      expect(screen.getByTestId('threat-analysis-skeleton')).toBeInTheDocument();
    });
  });

  describe('Threat Overview Display', () => {
    it('should display threat statistics', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check threat counts
      expect(screen.getByText('1,247')).toBeInTheDocument(); // Total threats
      expect(screen.getByText('89')).toBeInTheDocument(); // Active threats
      expect(screen.getByText('1,158')).toBeInTheDocument(); // Resolved threats
      expect(screen.getByText('12')).toBeInTheDocument(); // Critical threats
    });

    it('should display risk score and trend', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check risk score
      expect(screen.getByText('78')).toBeInTheDocument();
      expect(screen.getByText('Risk Score')).toBeInTheDocument();

      // Check trend indicator
      expect(screen.getByTestId('trend-increasing')).toBeInTheDocument();
    });

    it('should display severity distribution', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check severity counts
      expect(screen.getByText('Critical: 12')).toBeInTheDocument();
      expect(screen.getByText('High: 34')).toBeInTheDocument();
      expect(screen.getByText('Medium: 43')).toBeInTheDocument();
      expect(screen.getByText('Low: 0')).toBeInTheDocument();
    });

    it('should display threat type breakdown', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check threat type chart
      expect(screen.getByTestId('threat-types-chart')).toBeInTheDocument();
      expect(screen.getByText('Malware: 456 (36.6%)')).toBeInTheDocument();
      expect(screen.getByText('Phishing: 342 (27.4%)')).toBeInTheDocument();
    });
  });

  describe('Threat List Display', () => {
    it('should display individual threats', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check threat titles
      expect(screen.getByText('Advanced Persistent Threat Detected')).toBeInTheDocument();
      expect(screen.getByText('Credential Harvesting Campaign')).toBeInTheDocument();
      expect(screen.getByText('Outdated Software Vulnerability')).toBeInTheDocument();
    });

    it('should display threat severity indicators', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check severity badges
      expect(screen.getByTestId('severity-critical-threat-001')).toBeInTheDocument();
      expect(screen.getByTestId('severity-high-threat-002')).toBeInTheDocument();
      expect(screen.getByTestId('severity-medium-threat-003')).toBeInTheDocument();
    });

    it('should display threat status indicators', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check status badges
      expect(screen.getByTestId('status-active-threat-001')).toBeInTheDocument();
      expect(screen.getByTestId('status-investigating-threat-002')).toBeInTheDocument();
      expect(screen.getByTestId('status-resolved-threat-003')).toBeInTheDocument();
    });

    it('should display threat risk scores', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check risk scores
      expect(screen.getByText('95')).toBeInTheDocument(); // Critical threat
      expect(screen.getByText('87')).toBeInTheDocument(); // High threat
      expect(screen.getByText('65')).toBeInTheDocument(); // Medium threat
    });

    it('should display affected assets', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check affected assets
      expect(screen.getByText('workstation-045')).toBeInTheDocument();
      expect(screen.getByText('server-web-01')).toBeInTheDocument();
      expect(screen.getByText('email-server-01')).toBeInTheDocument();
    });
  });

  describe('Threat Filtering and Sorting', () => {
    it('should filter threats by severity', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Filter by critical severity
      const severityFilter = screen.getByLabelText(/filter by severity/i);
      await userEvent.selectOptions(severityFilter, 'critical');

      // Should show only critical threats
      expect(screen.getByText('Advanced Persistent Threat Detected')).toBeInTheDocument();
      expect(screen.queryByText('Credential Harvesting Campaign')).not.toBeInTheDocument();
    });

    it('should filter threats by status', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Filter by active status
      const statusFilter = screen.getByLabelText(/filter by status/i);
      await userEvent.selectOptions(statusFilter, 'active');

      // Should show only active threats
      expect(screen.getByText('Advanced Persistent Threat Detected')).toBeInTheDocument();
      expect(screen.queryByText('Outdated Software Vulnerability')).not.toBeInTheDocument();
    });

    it('should filter threats by type', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Filter by malware type
      const typeFilter = screen.getByLabelText(/filter by type/i);
      await userEvent.selectOptions(typeFilter, 'malware');

      // Should show only malware threats
      expect(screen.getByText('Advanced Persistent Threat Detected')).toBeInTheDocument();
      expect(screen.queryByText('Credential Harvesting Campaign')).not.toBeInTheDocument();
    });

    it('should sort threats by risk score', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Sort by risk score descending
      const sortSelect = screen.getByLabelText(/sort threats/i);
      await userEvent.selectOptions(sortSelect, 'risk_score_desc');

      // Should show highest risk threats first
      const threatItems = screen.getAllByTestId(/threat-item-/);
      expect(threatItems[0]).toHaveTextContent('Advanced Persistent Threat Detected');
    });

    it('should search threats by title or description', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Search for specific threat
      const searchInput = screen.getByPlaceholderText(/search threats/i);
      await userEvent.type(searchInput, 'phishing');

      // Should show only matching threats
      expect(screen.getByText('Credential Harvesting Campaign')).toBeInTheDocument();
      expect(screen.queryByText('Advanced Persistent Threat Detected')).not.toBeInTheDocument();
    });
  });

  describe('Threat Actions', () => {
    it('should resolve a threat', async () => {
      const mockResolve = jest.fn();
      mockUseResolveThreat.mockReturnValue({
        mutate: mockResolve,
        isPending: false,
        error: null,
      });

      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Click resolve button
      const resolveButton = screen.getByRole('button', { name: /resolve threat-001/i });
      await userEvent.click(resolveButton);

      // Should show confirmation dialog
      expect(screen.getByText(/confirm threat resolution/i)).toBeInTheDocument();

      // Confirm resolution
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await userEvent.click(confirmButton);

      expect(mockResolve).toHaveBeenCalledWith({
        threatId: 'threat-001',
        resolution: expect.any(String),
      });
    });

    it('should block a threat', async () => {
      const mockBlock = jest.fn();
      mockUseBlockThreat.mockReturnValue({
        mutate: mockBlock,
        isPending: false,
        error: null,
      });

      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Click block button
      const blockButton = screen.getByRole('button', { name: /block threat-001/i });
      await userEvent.click(blockButton);

      expect(mockBlock).toHaveBeenCalledWith({
        threatId: 'threat-001',
        blockType: 'automatic',
      });
    });

    it('should update threat status', async () => {
      const mockUpdateStatus = jest.fn();
      mockUseUpdateThreatStatus.mockReturnValue({
        mutate: mockUpdateStatus,
        isPending: false,
        error: null,
      });

      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Change threat status
      const statusSelect = screen.getByLabelText(/change status for threat-002/i);
      await userEvent.selectOptions(statusSelect, 'resolved');

      expect(mockUpdateStatus).toHaveBeenCalledWith({
        threatId: 'threat-002',
        status: 'resolved',
      });
    });

    it('should view threat details', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }));

      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Click view details button
      const detailsButton = screen.getByRole('button', { name: /view details threat-001/i });
      await userEvent.click(detailsButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard/threats/threat-001');
    });

    it('should disable actions based on permissions', () => {
      // Mock user without manage permissions
      mockUseAuth.mockReturnValue({
        user: {
          ...mockUser,
          permissions: ['view_threats'], // No manage permission
        },
        isAuthenticated: true,
        isLoading: false,
      });

      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Action buttons should be disabled
      const resolveButton = screen.getByRole('button', { name: /resolve threat-001/i });
      expect(resolveButton).toBeDisabled();

      const blockButton = screen.getByRole('button', { name: /block threat-001/i });
      expect(blockButton).toBeDisabled();
    });

    it('should show loading state during actions', () => {
      mockUseResolveThreat.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Should show loading spinner
      expect(screen.getByTestId('resolve-loading')).toBeInTheDocument();
    });
  });

  describe('Threat Analytics Display', () => {
    it('should display threat trends chart', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check for trend chart
      expect(screen.getByTestId('threat-trends-chart')).toBeInTheDocument();
    });

    it('should display top targeted assets', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check top targets
      expect(screen.getByText('workstation-045: 23 threats')).toBeInTheDocument();
      expect(screen.getByText('server-web-01: 18 threats')).toBeInTheDocument();
    });

    it('should display response metrics', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check response metrics
      expect(screen.getByText('3m')).toBeInTheDocument(); // Detection time
      expect(screen.getByText('15m')).toBeInTheDocument(); // Response time
      expect(screen.getByText('1h')).toBeInTheDocument(); // Resolution time
      expect(screen.getByText('94%')).toBeInTheDocument(); // Containment rate
    });
  });

  describe('Real-time Updates', () => {
    it('should refresh data periodically', async () => {
      const mockRefetch = jest.fn();
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Wait for auto-refresh interval
      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      }, { timeout: 31000 }); // 30s interval + buffer
    });

    it('should handle new threat notifications', async () => {
      const { rerender } = render(
        <QueryClientProvider client={new QueryClient()}>
          <ThreatAnalysisPanel />
        </QueryClientProvider>
      );

      // Initially show current threats
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ThreatAnalysisPanel />
        </QueryClientProvider>
      );

      expect(screen.getByText('89')).toBeInTheDocument(); // Active threats

      // New threat detected
      const updatedData = {
        ...mockThreatAnalysis,
        overview: {
          ...mockThreatAnalysis.overview,
          activeThreats: 90,
          totalThreats: 1248,
        },
      };

      mockUseThreatAnalysis.mockReturnValue({
        data: updatedData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      rerender(
        <QueryClientProvider client={new QueryClient()}>
          <ThreatAnalysisPanel />
        </QueryClientProvider>
      );

      // Should reflect new threat count
      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should show error message when data fetch fails', () => {
      const mockError = new Error('Failed to fetch threat analysis data');
      mockUseThreatAnalysis.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      expect(screen.getByText(/failed to load threat analysis/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle empty threat data', () => {
      const emptyData = {
        ...mockThreatAnalysis,
        threats: [],
        overview: {
          ...mockThreatAnalysis.overview,
          totalThreats: 0,
          activeThreats: 0,
        },
      };

      mockUseThreatAnalysis.mockReturnValue({
        data: emptyData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      expect(screen.getByText(/no threats detected/i)).toBeInTheDocument();
      expect(screen.getByText(/your systems are secure/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check for proper headings
      expect(screen.getByRole('heading', { name: /threat analysis/i })).toBeInTheDocument();

      // Check for threat list
      expect(screen.getByRole('list', { name: /threats/i })).toBeInTheDocument();

      // Check for status announcements
      expect(screen.getByLabelText(/threat overview/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Tab through interactive elements
      await userEvent.tab();
      expect(screen.getByLabelText(/filter by severity/i)).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByLabelText(/filter by status/i)).toHaveFocus();
    });

    it('should announce threat updates to screen readers', async () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Should have live region for updates
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check for responsive grid layout
      const threatGrid = container.querySelector('.grid');
      expect(threatGrid).toBeInTheDocument();
    });

    it('should stack threat cards on small screens', () => {
      mockUseThreatAnalysis.mockReturnValue({
        data: mockThreatAnalysis,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      });

      const Wrapper = createTestWrapper();
      const { container } = render(
        <Wrapper>
          <ThreatAnalysisPanel />
        </Wrapper>
      );

      // Check for mobile-friendly layout
      const mobileLayout = container.querySelector('.sm\\:grid-cols-1');
      expect(mobileLayout).toBeInTheDocument();
    });
  });
});