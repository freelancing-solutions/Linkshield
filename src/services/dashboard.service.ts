import { apiClient } from './api';
import type {
  DashboardOverview,
  Project,
  ProjectsResponse,
  CreateProjectData,
  UpdateProjectData,
  TeamMember,
  InviteTeamMemberData,
  Alert,
  AlertsResponse,
  AlertFilters,
  ResolveAlertData,
} from '@/types/dashboard';

/**
 * Dashboard API Service
 * 
 * Handles all dashboard-related API calls including:
 * - Dashboard overview
 * - Projects management
 * - Team management
 * - Alerts management
 */
export const dashboardService = {
  // ============================================================================
  // Dashboard Overview
  // ============================================================================

  /**
   * Get unified dashboard overview
   * Returns role-based metrics and integration status
   */
  getOverview: async (): Promise<DashboardOverview> => {
    return apiClient.get('/dashboard/overview');
  },

  // ============================================================================
  // Projects Management
  // ============================================================================

  /**
   * Get projects list with optional filters
   */
  getProjects: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<ProjectsResponse> => {
    return apiClient.get('/projects', { params });
  },

  /**
   * Get single project by ID
   */
  getProject: async (id: string): Promise<Project> => {
    return apiClient.get(`/projects/${id}`);
  },

  /**
   * Create a new project
   */
  createProject: async (data: CreateProjectData): Promise<Project> => {
    return apiClient.post('/projects', data);
  },

  /**
   * Update existing project
   */
  updateProject: async (id: string, data: UpdateProjectData): Promise<Project> => {
    return apiClient.put(`/projects/${id}`, data);
  },

  /**
   * Delete a project
   */
  deleteProject: async (id: string): Promise<void> => {
    return apiClient.delete(`/projects/${id}`);
  },

  /**
   * Toggle project monitoring on/off
   */
  toggleMonitoring: async (projectId: string, enabled: boolean): Promise<void> => {
    return apiClient.patch(`/projects/${projectId}/monitoring`, { enabled });
  },

  // ============================================================================
  // Team Management
  // ============================================================================

  /**
   * Get team members for a project
   */
  getTeamMembers: async (projectId: string): Promise<TeamMember[]> => {
    return apiClient.get(`/projects/${projectId}/team`);
  },

  /**
   * Invite a team member to a project
   */
  inviteTeamMember: async (
    projectId: string,
    data: InviteTeamMemberData
  ): Promise<TeamMember> => {
    return apiClient.post(`/projects/${projectId}/team/invite`, data);
  },

  /**
   * Remove a team member from a project
   */
  removeTeamMember: async (projectId: string, memberId: string): Promise<void> => {
    return apiClient.delete(`/projects/${projectId}/team/${memberId}`);
  },

  /**
   * Update team member role
   */
  updateTeamMemberRole: async (
    projectId: string,
    memberId: string,
    role: string
  ): Promise<TeamMember> => {
    return apiClient.patch(`/projects/${projectId}/team/${memberId}`, { role });
  },

  // ============================================================================
  // Alerts Management
  // ============================================================================

  /**
   * Get alerts with filters
   */
  getAlerts: async (filters?: AlertFilters): Promise<AlertsResponse> => {
    return apiClient.get('/alerts', { params: filters });
  },

  /**
   * Get single alert by ID
   */
  getAlert: async (projectId: string, alertId: string): Promise<Alert> => {
    return apiClient.get(`/projects/${projectId}/alerts/${alertId}`);
  },

  /**
   * Resolve an alert
   */
  resolveAlert: async (
    projectId: string,
    alertId: string,
    data?: ResolveAlertData
  ): Promise<void> => {
    return apiClient.patch(`/projects/${projectId}/alerts/${alertId}/resolve`, data);
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert: async (projectId: string, alertId: string): Promise<void> => {
    return apiClient.patch(`/projects/${projectId}/alerts/${alertId}/acknowledge`);
  },

  /**
   * Dismiss an alert
   */
  dismissAlert: async (projectId: string, alertId: string): Promise<void> => {
    return apiClient.patch(`/projects/${projectId}/alerts/${alertId}/dismiss`);
  },

  /**
   * Bulk resolve alerts
   */
  bulkResolveAlerts: async (
    projectId: string,
    alertIds: string[],
    data?: ResolveAlertData
  ): Promise<void> => {
    return apiClient.post(`/projects/${projectId}/alerts/bulk-resolve`, {
      alert_ids: alertIds,
      ...data,
    });
  },
};
