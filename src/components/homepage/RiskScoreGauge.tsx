/**
 * RiskScoreGauge Component
 * 
 * Circular progress gauge displaying risk score with color coding.
 */

'use client';

import { useEffect, useState } from 'react';

interface RiskScoreGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  size = 'md',
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counting
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  const getColor = (score: number): { bg: string; text: string; stroke: string } => {
    if (score <= 30) {
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        stroke: '#10b981', // green-500
      };
    } else if (score <= 70) {
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-600 dark:text-yellow-400',
        stroke: '#f59e0b', // yellow-500
      };
    } else {
      return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-600 dark:text-red-400',
        stroke: '#ef4444', // red-500
      };
    }
  };

  const getRiskLabel = (score: number): string => {
    if (score <= 30) return 'Low Risk';
    if (score <= 70) return 'Medium Risk';
    return 'High Risk';
  };

  const colors = getColor(score);
  const riskLabel = getRiskLabel(score);

  // SVG circle properties
  const sizes = {
    sm: { radius: 40, strokeWidth: 6, fontSize: 'text-xl' },
    md: { radius: 60, strokeWidth: 8, fontSize: 'text-3xl' },
    lg: { radius: 80, strokeWidth: 10, fontSize: 'text-4xl' },
  };

  const { radius, strokeWidth, fontSize } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center ${colors.bg}`}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} font-bold ${colors.text}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className={`text-lg font-semibold ${colors.text}`}>
          {riskLabel}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Risk Score
        </p>
      </div>
    </div>
  );
};
