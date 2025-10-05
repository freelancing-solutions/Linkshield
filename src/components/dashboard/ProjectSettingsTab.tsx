'use client';

import { MonitoringToggle } from './MonitoringToggle';
import type { Project } from '@/types/dashboard';

interface ProjectSettingsTabProps {
  project: Project;
}

/**
 * Project Settings Tab Component
 * 
 * Displays project configuration and settings
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
