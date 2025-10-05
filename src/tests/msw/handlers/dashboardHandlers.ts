import { rest } from 'msw';
import { env } from '@/config/env';

// Simple in-memory state for testing flows
let alertStatus: 'active' | 'acknowledged' | 'resolved' = 'active';

const API = env.NEXT_PUBLIC_API_BASE_URL;

export const dashboardHandlers = [
  // Dashboard overview
  rest.get(`${API}/dashboard/overview`, (req, res, ctx) => {
    return res(
      ctx.json({
        role: 'ADMIN',
        metrics: {
          active_alerts: alertStatus === 'resolved' ? 0 : 1,
          projects: 3,
        },
        integrations: {
          extension_connected: true,
          bot_health: 'healthy',
        },
      })
    );
  }),

  // Alerts list
  rest.get(`${API}/alerts`, (req, res, ctx) => {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id') || 'project-123';
    return res(
      ctx.json({
        alerts: [
          {
            id: 'alert-456',
            project_id: projectId,
            title: 'Suspicious activity detected',
            severity: 'high',
            status: alertStatus,
            created_at: new Date().toISOString(),
          },
        ],
        page: 1,
        per_page: 20,
        total: 1,
      })
    );
  }),

  // Alert detail
  rest.get(`${API}/projects/:projectId/alerts/:alertId`, (req, res, ctx) => {
    const { projectId, alertId } = req.params as Record<string, string>;
    return res(
      ctx.json({
        id: alertId,
        project_id: projectId,
        title: 'Suspicious activity detected',
        severity: 'high',
        status: alertStatus,
        created_at: new Date().toISOString(),
        resolved_at: alertStatus === 'resolved' ? new Date().toISOString() : null,
      })
    );
  }),

  // Resolve alert
  rest.patch(
    `${API}/projects/:projectId/alerts/:alertId/resolve`,
    (req, res, ctx) => {
      alertStatus = 'resolved';
      return res(ctx.status(200));
    }
  ),

  // Acknowledge alert
  rest.patch(
    `${API}/projects/:projectId/alerts/:alertId/acknowledge`,
    (req, res, ctx) => {
      alertStatus = 'acknowledged';
      return res(ctx.status(200));
    }
  ),

  // Dismiss alert
  rest.patch(
    `${API}/projects/:projectId/alerts/:alertId/dismiss`,
    (req, res, ctx) => {
      alertStatus = 'active';
      return res(ctx.status(200));
    }
  ),
];

export function __setAlertStatus(status: typeof alertStatus) {
  alertStatus = status;
}