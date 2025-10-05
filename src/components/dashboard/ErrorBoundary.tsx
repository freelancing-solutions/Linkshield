/**
 * Dashboard Error Boundary Components
 * 
 * Error boundaries for dashboard components that catch JavaScript errors
 * and display fallback UI instead of crashing the entire dashboard.
 * 
 * Features:
 * - Component-level error isolation
 * - User-friendly error displays
 * - Error reporting and logging
 * - Recovery mechanisms
 * - Integration with dashboard error utilities
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bug, 
  Home,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  createDashboardError, 
  classifyError, 
  formatErrorForDisplay,
  DashboardErrorCode,
  ErrorSeverity 
} from '@/utils/dashboard-errors';

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
  showDetails: boolean;
}

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  component?: string;
  level?: 'page' | 'section' | 'component';
  showReload?: boolean;
}

/**
 * Base Dashboard Error Boundary
 */
export class DashboardErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Create dashboard error for logging
    const dashboardError = createDashboardError(
      error,
      this.props.component || 'Unknown Component',
      {
        errorInfo,
        errorId: this.state.errorId,
        level: this.props.level || 'component',
      }
    );

    // Log error
    console.error('Dashboard Error Boundary caught an error:', {
      error,
      errorInfo,
      dashboardError,
      component: this.props.component,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  /**
   * Report error to monitoring service
   */
  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    // This would integrate with your error reporting service
    // e.g., Sentry, LogRocket, etc.
    try {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  /**
   * Handle retry action
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      showDetails: false,
    });
  };

  /**
   * Handle page reload
   */
  private handleReload = () => {
    window.location.reload();
  };

  /**
   * Toggle error details
   */
  private toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails,
    }));
  };

  /**
   * Render error fallback UI
   */
  private renderErrorFallback() {
    const { error, errorInfo, errorId, showDetails } = this.state;
    const { level = 'component', showReload = true } = this.props;

    if (!error) return null;

    // Create dashboard error for display formatting
    const dashboardError = createDashboardError(
      error,
      this.props.component,
      { errorInfo, errorId, level }
    );

    const { title, message, actions } = formatErrorForDisplay(dashboardError);

    // Different layouts based on error level
    if (level === 'page') {
      return this.renderPageError(title, message, error, errorInfo, showDetails);
    }

    if (level === 'section') {
      return this.renderSectionError(title, message, error, errorInfo, showDetails);
    }

    return this.renderComponentError(title, message, error, errorInfo, showDetails);
  }

  /**
   * Render page-level error
   */
  private renderPageError(
    title: string, 
    message: string, 
    error: Error, 
    errorInfo: React.ErrorInfo | null,
    showDetails: boolean
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-2xl" role="alert" aria-labelledby="error-title">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>
            <CardTitle id="error-title" className="text-2xl font-bold text-gray-900">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600">{message}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleRetry} 
                className="flex items-center gap-2"
                aria-label="Retry the failed operation"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleReload}
                className="flex items-center gap-2"
                aria-label="Reload the entire page"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Reload Page
              </Button>
            </div>

            {/* Error Details */}
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={this.toggleDetails}
                className="flex items-center gap-2 mx-auto"
                aria-expanded={showDetails}
                aria-controls="error-details"
                aria-label={`${showDetails ? 'Hide' : 'Show'} technical error details`}
              >
                <Bug className="h-4 w-4" aria-hidden="true" />
                {showDetails ? 'Hide' : 'Show'} Technical Details
                {showDetails ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
              </Button>
              
              {showDetails && (
                <div id="error-details" className="mt-4 p-4 bg-gray-100 rounded-lg text-sm" role="region" aria-label="Technical error details">
                  <div className="space-y-2">
                    <div>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                    <div>
                      <strong>Component:</strong> {this.props.component || 'Unknown'}
                    </div>
                    <div>
                      <strong>Error:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Render section-level error
   */
  private renderSectionError(
    title: string, 
    message: string, 
    error: Error, 
    errorInfo: React.ErrorInfo | null,
    showDetails: boolean
  ) {
    return (
      <Card 
        className="border-red-200 bg-red-50"
        role="alert"
        aria-labelledby="section-error-title"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <AlertTriangle 
              className="h-5 w-5 text-red-600 flex-shrink-0" 
              aria-hidden="true"
            />
            <div className="flex-1">
              <CardTitle 
                id="section-error-title"
                className="text-lg text-red-900"
              >
                {title}
              </CardTitle>
              <p className="text-sm text-red-700 mt-1">{message}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              onClick={this.handleRetry}
              className="flex items-center gap-2"
              aria-label="Retry loading this section"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Retry
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={this.toggleDetails}
              className="flex items-center gap-2"
              aria-expanded={showDetails}
              aria-controls="section-error-details"
              aria-label={`${showDetails ? 'Hide' : 'Show'} technical error details`}
            >
              <Bug className="h-3 w-3" aria-hidden="true" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          
          {showDetails && (
            <div 
              id="section-error-details"
              className="mt-4 p-3 bg-white rounded border text-xs"
              role="region"
              aria-label="Technical error details"
            >
              <div className="space-y-1">
                <div><strong>Error ID:</strong> {this.state.errorId}</div>
                <div><strong>Component:</strong> {this.props.component || 'Unknown'}</div>
                <div><strong>Message:</strong> {error.message}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  /**
   * Render component-level error
   */
  private renderComponentError(
    title: string, 
    message: string, 
    error: Error, 
    errorInfo: React.ErrorInfo | null,
    showDetails: boolean
  ) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">{message}</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={this.handleRetry}
              className="h-8 text-xs"
              aria-label="Retry loading this component"
            >
              <RefreshCw className="h-3 w-3 mr-1" aria-hidden="true" />
              Retry
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={this.toggleDetails}
              className="h-8 text-xs"
              aria-expanded={showDetails}
              aria-controls="component-error-details"
              aria-label={`${showDetails ? 'Hide' : 'Show'} technical error details`}
            >
              {showDetails ? 'Hide' : 'Details'}
            </Button>
          </div>
          
          {showDetails && (
            <div 
              id="component-error-details"
              className="mt-3 p-2 bg-red-100 rounded text-xs"
              role="region"
              aria-label="Technical error details"
            >
              <div><strong>ID:</strong> {this.state.errorId}</div>
              <div><strong>Error:</strong> {error.message}</div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Render error UI
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <DashboardErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </DashboardErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = 
    `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

/**
 * Specialized error boundaries for different dashboard sections
 */

/**
 * KPI Cards Error Boundary
 */
export const KPICardsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <DashboardErrorBoundary
    component="KPI Cards"
    level="section"
    onError={(error, errorInfo) => {
      console.error('KPI Cards Error:', { error, errorInfo });
    }}
  >
    {children}
  </DashboardErrorBoundary>
);

/**
 * Charts Error Boundary
 */
export const ChartsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <DashboardErrorBoundary
    component="Charts"
    level="section"
    onError={(error, errorInfo) => {
      console.error('Charts Error:', { error, errorInfo });
    }}
  >
    {children}
  </DashboardErrorBoundary>
);

/**
 * Tables Error Boundary
 */
export const TablesErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <DashboardErrorBoundary
    component="Tables"
    level="section"
    onError={(error, errorInfo) => {
      console.error('Tables Error:', { error, errorInfo });
    }}
  >
    {children}
  </DashboardErrorBoundary>
);

/**
 * Alerts Error Boundary
 */
export const AlertsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <DashboardErrorBoundary
    component="Alerts"
    level="section"
    onError={(error, errorInfo) => {
      console.error('Alerts Error:', { error, errorInfo });
    }}
  >
    {children}
  </DashboardErrorBoundary>
);

/**
 * Algorithm Health Error Boundary
 */
export const AlgorithmHealthErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <DashboardErrorBoundary
    component="Algorithm Health"
    level="section"
    onError={(error, errorInfo) => {
      console.error('Algorithm Health Error:', { error, errorInfo });
    }}
  >
    {children}
  </DashboardErrorBoundary>
);

/**
 * Page-level Error Boundary for entire dashboard
 */
export const DashboardPageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <DashboardErrorBoundary
    component="Dashboard Page"
    level="page"
    showReload={true}
    onError={(error, errorInfo) => {
      console.error('Dashboard Page Error:', { error, errorInfo });
      // Could integrate with error reporting service here
    }}
  >
    {children}
  </DashboardErrorBoundary>
);