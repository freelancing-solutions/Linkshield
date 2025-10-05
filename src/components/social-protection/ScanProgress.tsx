/**
 * @fileoverview Scan Progress Component
 * 
 * Displays real-time scanning progress with visual indicators, stage information,
 * and estimated completion times. Provides engaging user feedback during content
 * analysis with smooth animations and detailed progress tracking.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Search,
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  Brain,
  Globe,
  Clock,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanProgressProps {
  /** Current progress percentage (0-100) */
  progress: number;
  /** Current scanning stage */
  stage: string;
  /** Estimated time remaining in seconds */
  estimatedTime?: number;
  /** Whether scan is complete */
  isComplete?: boolean;
  /** Whether scan failed */
  hasFailed?: boolean;
  /** Additional details about current operation */
  details?: string;
  /** Show detailed progress breakdown */
  showDetails?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Scanning stages with icons and descriptions
 */
const SCAN_STAGES = [
  {
    key: 'validating',
    label: 'Validating URL',
    description: 'Checking URL format and accessibility',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    key: 'fetching',
    label: 'Fetching Content',
    description: 'Retrieving social media content',
    icon: Search,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    key: 'analyzing',
    label: 'Analyzing Content',
    description: 'Processing content for risks and patterns',
    icon: Brain,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    key: 'checking',
    label: 'Checking for Risks',
    description: 'Identifying potential threats and issues',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    key: 'finalizing',
    label: 'Finalizing Results',
    description: 'Compiling analysis and recommendations',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
];

/**
 * Get current stage based on progress and stage text
 */
const getCurrentStage = (progress: number, stageText: string) => {
  // Try to match by stage text first
  const matchedStage = SCAN_STAGES.find(stage => 
    stageText.toLowerCase().includes(stage.key) || 
    stageText.toLowerCase().includes(stage.label.toLowerCase())
  );
  
  if (matchedStage) return matchedStage;
  
  // Fallback to progress-based matching
  if (progress < 20) return SCAN_STAGES[0]; // validating
  if (progress < 40) return SCAN_STAGES[1]; // fetching
  if (progress < 70) return SCAN_STAGES[2]; // analyzing
  if (progress < 90) return SCAN_STAGES[3]; // checking
  return SCAN_STAGES[4]; // finalizing
};

/**
 * Format time remaining
 */
const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.ceil(seconds)}s remaining`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${Math.ceil(remainingSeconds)}s remaining`;
};

/**
 * Progress animation component
 */
const ProgressAnimation: React.FC<{ progress: number; isComplete: boolean; hasFailed: boolean }> = ({
  progress,
  isComplete,
  hasFailed
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-2">
      <Progress 
        value={animatedProgress} 
        className={cn(
          'h-2 transition-all duration-500',
          isComplete && 'bg-green-100',
          hasFailed && 'bg-red-100'
        )}
      />
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{Math.round(animatedProgress)}% complete</span>
        {isComplete && (
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )}
        {hasFailed && (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )}
      </div>
    </div>
  );
};

/**
 * Stage indicator component
 */
const StageIndicator: React.FC<{ 
  stage: typeof SCAN_STAGES[0]; 
  isActive: boolean; 
  isComplete: boolean;
  progress: number;
}> = ({ stage, isActive, isComplete, progress }) => {
  const Icon = stage.icon;
  
  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
      isActive && stage.bgColor,
      isComplete && 'bg-green-50'
    )}>
      <div className={cn(
        'p-2 rounded-full transition-colors',
        isActive ? stage.color : 'text-gray-400',
        isActive ? stage.bgColor.replace('100', '200') : 'bg-gray-100',
        isComplete && 'bg-green-200 text-green-700'
      )}>
        {isComplete ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Icon className={cn('h-4 w-4', isActive && 'animate-pulse')} />
        )}
      </div>
      <div className="flex-1">
        <div className={cn(
          'font-medium text-sm',
          isActive ? stage.color : 'text-gray-600',
          isComplete && 'text-green-700'
        )}>
          {stage.label}
        </div>
        <div className="text-xs text-gray-500">
          {stage.description}
        </div>
      </div>
      {isActive && (
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-gray-400 animate-pulse" />
          <span className="text-xs text-gray-500">Active</span>
        </div>
      )}
    </div>
  );
};

/**
 * ScanProgress Component
 * 
 * Real-time scanning progress display with visual indicators, stage tracking,
 * and estimated completion times. Provides engaging user feedback during
 * content analysis with smooth animations and detailed progress information.
 * 
 * Features:
 * - Animated progress bar with smooth transitions
 * - Stage-based progress tracking with icons
 * - Estimated time remaining calculations
 * - Detailed progress breakdown (optional)
 * - Success and error state handling
 * - Responsive design with mobile optimization
 * - Accessibility features and screen reader support
 * - Customizable styling and theming
 * - Real-time updates and smooth animations
 * 
 * @param props - Component props
 * @returns JSX element representing the scan progress
 * 
 * Requirements: 7.5 - Progress indicator during scanning
 */
export const ScanProgress: React.FC<ScanProgressProps> = ({
  progress,
  stage,
  estimatedTime,
  isComplete = false,
  hasFailed = false,
  details,
  showDetails = false,
  className
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const currentStage = getCurrentStage(progress, stage);
  const currentStageIndex = SCAN_STAGES.findIndex(s => s.key === currentStage.key);

  // Track elapsed time
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Progress Display */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-2 rounded-full', currentStage.bgColor)}>
              <currentStage.icon className={cn('h-4 w-4', currentStage.color)} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{currentStage.label}</h4>
              <p className="text-sm text-gray-500">{currentStage.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {elapsedTime}s elapsed
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressAnimation 
          progress={progress} 
          isComplete={isComplete} 
          hasFailed={hasFailed} 
        />

        {/* Stage Text and Details */}
        <div className="space-y-2">
          <div className="text-sm text-gray-700">{stage}</div>
          {details && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              {details}
            </div>
          )}
          {estimatedTime && !isComplete && !hasFailed && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeRemaining(estimatedTime)}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stage Breakdown */}
      {showDetails && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <h5 className="font-medium text-gray-900 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Scanning Progress
          </h5>
          <div className="space-y-2">
            {SCAN_STAGES.map((stageItem, index) => (
              <StageIndicator
                key={stageItem.key}
                stage={stageItem}
                isActive={index === currentStageIndex}
                isComplete={index < currentStageIndex || (isComplete && index === currentStageIndex)}
                progress={progress}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">{Math.round(progress)}%</div>
          <div className="text-xs text-blue-600">Progress</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-600">{elapsedTime}s</div>
          <div className="text-xs text-purple-600">Elapsed</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {estimatedTime ? Math.max(0, estimatedTime - elapsedTime) : 0}s
          </div>
          <div className="text-xs text-green-600">Remaining</div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>
            Your data is processed securely and not stored permanently. 
            Analysis is performed in real-time for your privacy.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScanProgress;