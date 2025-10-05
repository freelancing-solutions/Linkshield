import { rest } from 'msw';

const API = '/api';

// Mock data for extension status
const extensionStatus = {
  version: '1.2.3',
  last_sync: new Date().toISOString(),
  total_scans: 15420,
  threats_blocked: 287,
  sites_protected: 1250,
};

// Mock data for bot health
const botHealth = {
  services: [
    {
      service_name: 'facebook-bot',
      status: 'online',
      uptime_percentage: 99.9,
      last_check: new Date().toISOString(),
    },
    {
      service_name: 'twitter-bot',
      status: 'online',
      uptime_percentage: 98.5,
      last_check: new Date().toISOString(),
    },
  ],
};

// Mock data for algorithm health
const algorithmHealth = {
  visibility_score: 85,
  engagement_score: 92,
  penalty_detected: false,
  last_analysis: new Date().toISOString(),
};

// Mock data for extension settings
let extensionSettings = {
  auto_scan: true,
  real_time_protection: true,
  threat_notifications: true,
  blocked_sites: [],
  trusted_domains: ['facebook.com', 'twitter.com'],
};

export const socialProtectionHandlers = [
  // Social Protection Overview - Main dashboard endpoint
  rest.get('/api/dashboard/social-protection/overview', (req, res, ctx) => {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id') || 'project-123';
    return res(ctx.json({
      project_id: projectId,
      extension_status: {
        ...extensionStatus,
        installed: true,
      },
      bot_status: {
        active_bots: botHealth.services.filter(s => s.status === 'online').length,
        total_analyses: 15420,
        threats_detected: 287,
        avg_response_time: 1.2,
        platform_breakdown: {
          facebook: { platform: 'facebook', status: 'online', analyses: 8500, threats: 120, last_activity: new Date().toISOString() },
          twitter: { platform: 'twitter', status: 'online', analyses: 6920, threats: 167, last_activity: new Date().toISOString() },
        },
      },
      algorithm_health: algorithmHealth,
      crisis_alerts_count: 0,
      recent_analyses: 25,
    }));
  }),

  // Extension status - Individual component endpoint
  rest.get(`${API}/social-protection/extension/status`, (req, res, ctx) => {
    return res(ctx.json({
      ...extensionStatus,
      installed: true,
      status: 'CONNECTED',
      version: extensionStatus.version,
      last_heartbeat: extensionStatus.last_sync,
    }));
  }),

  // Extension analytics
  rest.get(`${API}/social-protection/extension/analytics`, (req, res, ctx) => {
    const url = new URL(req.url);
    const range = url.searchParams.get('time_range') || '7d';
    return res(ctx.json({
      time_range: range,
      total_scans: extensionStatus.total_scans,
      threats_blocked: extensionStatus.threats_blocked,
      sites_protected: extensionStatus.sites_protected,
      daily_activity: [
        { date: '2024-01-01', scans: 1250, threats: 15 },
        { date: '2024-01-02', scans: 1180, threats: 12 },
      ],
      threat_types_breakdown: [
        { type: 'phishing', count: 156, percentage: 54.4 },
        { type: 'malware', count: 89, percentage: 31.0 },
        { type: 'scam', count: 42, percentage: 14.6 },
      ],
      protected_platforms: [
        { platform: 'facebook', scans: 8500, threats: 120 },
        { platform: 'twitter', scans: 6920, threats: 167 },
      ],
    }));
  }),

  // Extension settings
  rest.get(`${API}/social-protection/extension/settings`, (req, res, ctx) => {
    return res(ctx.json(extensionSettings));
  }),

  rest.put(`${API}/social-protection/extension/settings`, async (req, res, ctx) => {
    const body = await req.json();
    extensionSettings = { ...extensionSettings, ...body };
    return res(ctx.json(extensionSettings));
  }),

  // Extension sync
  rest.post(`${API}/social-protection/extension/sync`, (req, res, ctx) => {
    extensionStatus.last_sync = new Date().toISOString();
    extensionStatus.total_scans += 50;
    extensionStatus.threats_blocked += 3;
    return res(ctx.json({ success: true }));
  }),

  // Bot health endpoint
  rest.get(`${API}/bots/health`, (req, res, ctx) => {
    return res(ctx.json({
      ...botHealth,
      overall_status: 'online',
    }));
  }),

  // Bot restart
  rest.post(`${API}/bots/:serviceName/restart`, (req, res, ctx) => {
    const { serviceName } = req.params;
    const service = botHealth.services.find(s => s.service_name === serviceName);
    if (service) {
      service.status = 'online';
      service.uptime_percentage = 99.9;
    }
    return res(ctx.json({ success: true }));
  }),

  // Algorithm health endpoints
  rest.get(`${API}/social/algorithm-health/health`, (req, res, ctx) => {
    return res(ctx.json({
      ...algorithmHealth,
      overall_health: 'good',
    }));
  }),

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

  // Crisis alerts
  rest.get(`${API}/social-protection/crisis/alerts`, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  rest.get(`${API}/social-protection/crisis/alerts/:alertId`, (req, res, ctx) => {
    const { alertId } = req.params;
    return res(ctx.json({
      id: alertId,
      severity: 'medium',
      type: 'reputation',
      title: 'Test Crisis Alert',
      description: 'Test crisis description',
      status: 'active',
      detected_at: new Date().toISOString(),
      impact_score: 75,
      affected_platforms: ['facebook', 'twitter'],
    }));
  }),

  rest.put(`${API}/social-protection/crisis/alerts/:alertId`, async (req, res, ctx) => {
    const { alertId } = req.params;
    const body = await req.json();
    return res(ctx.json({ success: true }));
  }),

  rest.get(`${API}/social-protection/crisis/alerts/:alertId/recommendations`, (req, res, ctx) => {
    return res(ctx.json([
      {
        id: 'rec-1',
        priority: 'urgent',
        title: 'Respond to negative comments',
        description: 'Address negative feedback promptly',
        action_items: ['Monitor mentions', 'Draft response templates'],
        estimated_impact: 'High - Can reduce negative sentiment by 40%',
      },
    ]));
  }),

  rest.get(`${API}/social-protection/crisis/stats`, (req, res, ctx) => {
    const url = new URL(req.url);
    const timeRange = url.searchParams.get('time_range') || '30d';
    return res(ctx.json({
      time_range: timeRange,
      total_crises: 5,
      active_crises: 0,
      resolved_crises: 5,
      avg_resolution_time: 24,
      severity_breakdown: [
        { severity: 'critical', count: 0, percentage: 0 },
        { severity: 'high', count: 1, percentage: 20 },
        { severity: 'medium', count: 3, percentage: 60 },
        { severity: 'low', count: 1, percentage: 20 },
      ],
      type_breakdown: [
        { type: 'reputation', count: 3, percentage: 60 },
        { type: 'security', count: 1, percentage: 20 },
        { type: 'engagement', count: 1, percentage: 20 },
      ],
      timeline: [
        { date: '2024-01-01', count: 1, severity_distribution: { critical: 0, high: 0, medium: 1, low: 0 } },
      ],
    }));
  }),

  // Batch analysis
  rest.post(`${API}/social/algorithm-health/batch/analyze`, async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({
      job_id: 'batch-123',
      status: 'processing',
      total_accounts: body.accounts.length,
      completed: 0,
      failed: 0,
      results: [],
    }));
  }),

  rest.get(`${API}/social/algorithm-health/batch/:jobId`, (req, res, ctx) => {
    const { jobId } = req.params;
    return res(ctx.json({
      job_id: jobId,
      status: 'completed',
      total_accounts: 5,
      completed: 5,
      failed: 0,
      results: [
        { account: '@test1', platform: 'twitter', visibility: { score: 85, trend: 'up', factors: [], recommendations: [] } },
      ],
    }));
  }),
];