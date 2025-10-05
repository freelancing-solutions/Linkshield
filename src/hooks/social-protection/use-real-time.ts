/**
 * Real-time Updates Hook for Social Protection
 * 
 * Provides comprehensive real-time functionality for social protection features
 * including WebSocket connections for alerts, polling for scans, and auto-refresh
 * for dashboard data.
 * 
 * Features:
 * - WebSocket connection management for real-time alerts
 * - Polling for scan progress and status updates
 * - Auto-refresh for dashboard components
 * - Connection state management
 * - Error handling and reconnection logic
 * - Event-driven updates
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { socialProtectionService } from '@/services/social-protection.service';
import type { CrisisAlert, PlatformScan, SocialProtectionDashboard } from '@/types/social-protection';

/**
 * WebSocket connection states
 */
export enum WebSocketState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RECONNECTING = 'reconnecting',
}

/**
 * Real-time event types
 */
export enum RealTimeEventType {
  ALERT_CREATED = 'alert_created',
  ALERT_UPDATED = 'alert_updated',
  SCAN_PROGRESS = 'scan_progress',
  SCAN_COMPLETED = 'scan_completed',
  PLATFORM_STATUS_CHANGED = 'platform_status_changed',
  ALGORITHM_HEALTH_UPDATED = 'algorithm_health_updated',
  EXTENSION_STATUS_CHANGED = 'extension_status_changed',
}

/**
 * Real-time event data structure
 */
export interface RealTimeEvent {
  type: RealTimeEventType;
  data: any;
  timestamp: string;
  user_id?: string;
}

/**
 * WebSocket configuration options
 */
export interface WebSocketOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  enableHeartbeat?: boolean;
}

/**
 * Polling configuration options
 */
export interface PollingOptions {
  interval?: number;
  maxAttempts?: number;
  backoffMultiplier?: number;
  enabled?: boolean;
}

/**
 * Auto-refresh configuration options
 */
export interface AutoRefreshOptions {
  dashboardInterval?: number;
  alertsInterval?: number;
  healthInterval?: number;
  enabled?: boolean;
}

/**
 * Real-time hook options
 */
export interface UseRealTimeOptions {
  websocket?: WebSocketOptions;
  polling?: PollingOptions;
  autoRefresh?: AutoRefreshOptions;
  onAlert?: (alert: CrisisAlert) => void;
  onScanUpdate?: (scan: PlatformScan) => void;
  onError?: (error: Error) => void;
}

/**
 * Default configuration
 */
const DEFAULT_OPTIONS: Required<UseRealTimeOptions> = {
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
    enableHeartbeat: true,
  },
  polling: {
    interval: 5000,
    maxAttempts: 60, // 5 minutes max
    backoffMultiplier: 1.5,
    enabled: true,
  },
  autoRefresh: {
    dashboardInterval: 30000, // 30 seconds
    alertsInterval: 15000, // 15 seconds
    healthInterval: 300000, // 5 minutes
    enabled: true,
  },
  onAlert: () => {},
  onScanUpdate: () => {},
  onError: () => {},
};

/**
 * Hook for managing real-time updates in social protection features
 * 
 * @param options - Configuration options for real-time functionality
 * @returns Real-time state and control functions
 */
export function useRealTime(options: UseRealTimeOptions = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // WebSocket state
  const [wsState, setWsState] = useState<WebSocketState>(WebSocketState.DISCONNECTED);
  const [lastEvent, setLastEvent] = useState<RealTimeEvent | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Refs for managing connections and intervals
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshIntervalsRef = useRef<NodeJS.Timeout[]>([]);
  const reconnectAttemptsRef = useRef(0);
  
  // Polling state
  const [activePolls, setActivePolls] = useState<Set<string>>(new Set());
  const pollTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Initialize WebSocket connection
   */
  const connectWebSocket = useCallback(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setWsState(WebSocketState.CONNECTING);
    setConnectionError(null);

    try {
      const wsUrl = `${mergedOptions.websocket.url}?token=${user.token}&user_id=${user.id}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsState(WebSocketState.CONNECTED);
        reconnectAttemptsRef.current = 0;
        
        // Start heartbeat if enabled
        if (mergedOptions.websocket.enableHeartbeat) {
          startHeartbeat();
        }
        
        console.log('WebSocket connected for social protection');
      };

      ws.onmessage = (event) => {
        try {
          const realTimeEvent: RealTimeEvent = JSON.parse(event.data);
          setLastEvent(realTimeEvent);
          handleRealTimeEvent(realTimeEvent);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        setWsState(WebSocketState.DISCONNECTED);
        stopHeartbeat();
        
        if (!event.wasClean && reconnectAttemptsRef.current < mergedOptions.websocket.maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        setWsState(WebSocketState.ERROR);
        setConnectionError('WebSocket connection error');
        mergedOptions.onError(new Error('WebSocket connection failed'));
      };

    } catch (error) {
      setWsState(WebSocketState.ERROR);
      setConnectionError('Failed to create WebSocket connection');
      mergedOptions.onError(error as Error);
    }
  }, [isAuthenticated, user, mergedOptions]);

  /**
   * Disconnect WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    stopHeartbeat();
    clearReconnectTimeout();
    setWsState(WebSocketState.DISCONNECTED);
  }, []);

  /**
   * Schedule WebSocket reconnection
   */
  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= mergedOptions.websocket.maxReconnectAttempts) {
      setWsState(WebSocketState.ERROR);
      setConnectionError('Max reconnection attempts reached');
      return;
    }

    setWsState(WebSocketState.RECONNECTING);
    reconnectAttemptsRef.current++;
    
    const delay = mergedOptions.websocket.reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current - 1);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
    }, delay);
  }, [connectWebSocket, mergedOptions.websocket]);

  /**
   * Clear reconnection timeout
   */
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  /**
   * Start heartbeat to keep connection alive
   */
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, mergedOptions.websocket.heartbeatInterval);
  }, [mergedOptions.websocket.heartbeatInterval]);

  /**
   * Stop heartbeat
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  /**
   * Handle incoming real-time events
   */
  const handleRealTimeEvent = useCallback((event: RealTimeEvent) => {
    switch (event.type) {
      case RealTimeEventType.ALERT_CREATED:
      case RealTimeEventType.ALERT_UPDATED:
        const alert = event.data as CrisisAlert;
        
        // Update alerts cache
        queryClient.setQueryData(['social-protection', 'alerts'], (oldData: any) => {
          if (!oldData) return oldData;
          
          if (event.type === RealTimeEventType.ALERT_CREATED) {
            return {
              ...oldData,
              data: [alert, ...oldData.data],
              total: oldData.total + 1,
            };
          } else {
            return {
              ...oldData,
              data: oldData.data.map((a: CrisisAlert) => a.id === alert.id ? alert : a),
            };
          }
        });
        
        // Show toast notification for new critical alerts
        if (event.type === RealTimeEventType.ALERT_CREATED && alert.severity === 'critical') {
          toast.error(`Critical Alert: ${alert.title}`, {
            duration: 10000,
            position: 'top-right',
          });
        }
        
        mergedOptions.onAlert(alert);
        break;

      case RealTimeEventType.SCAN_PROGRESS:
      case RealTimeEventType.SCAN_COMPLETED:
        const scan = event.data as PlatformScan;
        
        // Update scan cache
        queryClient.setQueryData(['social-protection', 'scan', scan.id], scan);
        
        // Update scans list
        queryClient.setQueryData(['social-protection', 'scans'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            data: oldData.data.map((s: PlatformScan) => s.id === scan.id ? scan : s),
          };
        });
        
        // Show completion notification
        if (event.type === RealTimeEventType.SCAN_COMPLETED) {
          toast.success(`Scan completed for ${scan.platform}`, {
            duration: 5000,
          });
        }
        
        mergedOptions.onScanUpdate(scan);
        break;

      case RealTimeEventType.PLATFORM_STATUS_CHANGED:
      case RealTimeEventType.ALGORITHM_HEALTH_UPDATED:
      case RealTimeEventType.EXTENSION_STATUS_CHANGED:
        // Invalidate relevant queries to trigger refetch
        queryClient.invalidateQueries(['social-protection', 'dashboard']);
        queryClient.invalidateQueries(['social-protection', 'algorithm-health']);
        queryClient.invalidateQueries(['social-protection', 'extension']);
        break;

      default:
        console.log('Unknown real-time event type:', event.type);
    }
  }, [queryClient, mergedOptions]);

  /**
   * Start polling for a specific scan
   */
  const startScanPolling = useCallback((scanId: string) => {
    if (activePolls.has(scanId) || !mergedOptions.polling.enabled) {
      return;
    }

    setActivePolls(prev => new Set(prev).add(scanId));
    
    let attempts = 0;
    let interval = mergedOptions.polling.interval;

    const poll = async () => {
      try {
        const scan = await socialProtectionService.getScanStatus(scanId);
        
        // Update cache
        queryClient.setQueryData(['social-protection', 'scan', scanId], scan);
        
        // Stop polling if scan is complete or failed
        if (scan.status === 'completed' || scan.status === 'failed' || scan.status === 'cancelled') {
          stopScanPolling(scanId);
          return;
        }
        
        // Continue polling if not at max attempts
        if (attempts < mergedOptions.polling.maxAttempts) {
          attempts++;
          interval *= mergedOptions.polling.backoffMultiplier;
          
          const timeoutId = setTimeout(poll, interval);
          pollTimeoutsRef.current.set(scanId, timeoutId);
        } else {
          stopScanPolling(scanId);
        }
        
      } catch (error) {
        console.error('Scan polling error:', error);
        stopScanPolling(scanId);
      }
    };

    // Start initial poll
    const timeoutId = setTimeout(poll, mergedOptions.polling.interval);
    pollTimeoutsRef.current.set(scanId, timeoutId);
  }, [activePolls, mergedOptions.polling, queryClient]);

  /**
   * Stop polling for a specific scan
   */
  const stopScanPolling = useCallback((scanId: string) => {
    const timeoutId = pollTimeoutsRef.current.get(scanId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      pollTimeoutsRef.current.delete(scanId);
    }
    
    setActivePolls(prev => {
      const newSet = new Set(prev);
      newSet.delete(scanId);
      return newSet;
    });
  }, []);

  /**
   * Setup auto-refresh intervals
   */
  const setupAutoRefresh = useCallback(() => {
    if (!mergedOptions.autoRefresh.enabled || !isAuthenticated) {
      return;
    }

    // Clear existing intervals
    autoRefreshIntervalsRef.current.forEach(clearInterval);
    autoRefreshIntervalsRef.current = [];

    // Dashboard auto-refresh
    const dashboardInterval = setInterval(() => {
      queryClient.invalidateQueries(['social-protection', 'dashboard']);
    }, mergedOptions.autoRefresh.dashboardInterval);
    autoRefreshIntervalsRef.current.push(dashboardInterval);

    // Alerts auto-refresh
    const alertsInterval = setInterval(() => {
      queryClient.invalidateQueries(['social-protection', 'alerts']);
    }, mergedOptions.autoRefresh.alertsInterval);
    autoRefreshIntervalsRef.current.push(alertsInterval);

    // Health auto-refresh
    const healthInterval = setInterval(() => {
      queryClient.invalidateQueries(['social-protection', 'algorithm-health']);
    }, mergedOptions.autoRefresh.healthInterval);
    autoRefreshIntervalsRef.current.push(healthInterval);

  }, [isAuthenticated, mergedOptions.autoRefresh, queryClient]);

  /**
   * Clear all auto-refresh intervals
   */
  const clearAutoRefresh = useCallback(() => {
    autoRefreshIntervalsRef.current.forEach(clearInterval);
    autoRefreshIntervalsRef.current = [];
  }, []);

  /**
   * Manual refresh function
   */
  const refresh = useCallback((scope?: 'dashboard' | 'alerts' | 'health' | 'all') => {
    switch (scope) {
      case 'dashboard':
        queryClient.invalidateQueries(['social-protection', 'dashboard']);
        break;
      case 'alerts':
        queryClient.invalidateQueries(['social-protection', 'alerts']);
        break;
      case 'health':
        queryClient.invalidateQueries(['social-protection', 'algorithm-health']);
        break;
      case 'all':
      default:
        queryClient.invalidateQueries(['social-protection']);
        break;
    }
  }, [queryClient]);

  // Initialize WebSocket connection when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
      setupAutoRefresh();
    } else {
      disconnectWebSocket();
      clearAutoRefresh();
    }

    return () => {
      disconnectWebSocket();
      clearAutoRefresh();
    };
  }, [isAuthenticated, connectWebSocket, disconnectWebSocket, setupAutoRefresh, clearAutoRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
      clearAutoRefresh();
      
      // Clear all polling timeouts
      pollTimeoutsRef.current.forEach(clearTimeout);
      pollTimeoutsRef.current.clear();
    };
  }, [disconnectWebSocket, clearAutoRefresh]);

  return {
    // WebSocket state
    wsState,
    isConnected: wsState === WebSocketState.CONNECTED,
    connectionError,
    lastEvent,
    
    // Control functions
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    refresh,
    
    // Polling functions
    startScanPolling,
    stopScanPolling,
    activePolls: Array.from(activePolls),
    
    // Configuration
    options: mergedOptions,
  };
}

/**
 * Hook for simplified real-time alerts
 * 
 * @returns Real-time alerts state and functions
 */
export function useRealTimeAlerts() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  
  const { isConnected, lastEvent } = useRealTime({
    onAlert: (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    },
  });

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    isConnected,
    clearAlerts,
    hasNewAlerts: alerts.length > 0,
  };
}

/**
 * Hook for scan progress tracking
 * 
 * @param scanId - Scan ID to track
 * @returns Scan progress state
 */
export function useScanProgress(scanId: string) {
  const [progress, setProgress] = useState<PlatformScan | null>(null);
  
  const { startScanPolling, stopScanPolling, activePolls } = useRealTime({
    onScanUpdate: (scan) => {
      if (scan.id === scanId) {
        setProgress(scan);
      }
    },
  });

  useEffect(() => {
    if (scanId) {
      startScanPolling(scanId);
    }
    
    return () => {
      if (scanId) {
        stopScanPolling(scanId);
      }
    };
  }, [scanId, startScanPolling, stopScanPolling]);

  return {
    progress,
    isPolling: activePolls.includes(scanId),
    isComplete: progress?.status === 'completed',
    isFailed: progress?.status === 'failed',
  };
}