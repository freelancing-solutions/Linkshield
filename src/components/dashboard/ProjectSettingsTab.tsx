/**
 * ProjectSettingsTab Component
 * 
 * A comprehensive project settings interface that displays and manages project
 * configuration options including monitoring settings, scan frequency, and project
 * information. Provides a clean, organized layout for project administrators to
 * configure security monitoring and view project details.
 * 
 * Features:
 * - Monitoring toggle with real-time updates
 * - Scan frequency display and configuration
 * - Project information display with formatted details
 * - Clean, organized layout with proper spacing
 * - Integration with monitoring toggle component
 * - Responsive design with proper card layouts
 * - Accessibility support with proper semantic markup
 * - Read-only project information display
 * - Visual separation between setting sections
 * - Consistent typography and spacing
 * 
 * @example
 * ```tsx
 * <ProjectSettingsTab project={selectedProject} />
 * ```
 */

'use client';

import { MonitoringToggle } from './MonitoringToggle';
import type { Project } from '@/types/dashboard';

/**
 * Props for the ProjectSettingsTab component
 * 
 * @interface ProjectSettingsTabProps
 * @property {Project} project - The project object containing settings and information
 */
interface ProjectSettingsTabProps {
  /** The project object containing settings and information to display */
  project: Project;
}

/**
 * Project Settings Tab Component
 * 
 * Displays and manages project configuration settings including monitoring options
 * and project information. Provides an organized interface for project administrators.
 * 
 * @param {ProjectSettingsTabProps} props - The component props
 * @returns {JSX.Element} The rendered project settings tab interface
 * 
 * @example
 * ```tsx
 * // Display project settings
 * <ProjectSettingsTab project={selectedProject} />
 * ```
 * 
 * @features
 * - Monitoring settings with toggle control
 * - Scan frequency configuration display
 * - Project information overview
 * - Organized card-based layout
 * - Integration with monitoring components
 */
export function ProjectSettingsTab({ project }: ProjectSettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Monitoring Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automated Monitoring</p>
              <p className="text-sm text-muted-foreground">
                Enable or disable automated scans for this project
              </p>
            </div>
            <MonitoringToggle
              projectId={project.id}
              projectName={project.name}
              enabled={project.monitoring_enabled}
              showLabel={false}
            />
          </div>

          <div className="pt-4 border-t">
            <p className="font-medium mb-2">Scan Frequency</p>
            <p className="text-sm text-muted-foreground">
              Current frequency: <span className="font-medium capitalize">{project.scan_frequency || 'Daily'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Project Information</h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-muted-foreground">Project ID</dt>
            <dd className="text-sm font-mono">{project.id}</dd>
          </div>
          {project.domain && (
            <div>
              <dt className="text-sm text-muted-foreground">Domain</dt>
              <dd className="text-sm">{project.domain}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="text-sm capitalize">{project.status}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
