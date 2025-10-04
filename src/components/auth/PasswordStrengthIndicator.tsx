import { useMemo } from 'react';
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/lib/validations/auth';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showCriteria?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showCriteria = true,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const label = useMemo(() => getPasswordStrengthLabel(strength), [strength]);
  const colorClass = useMemo(() => getPasswordStrengthColor(strength), [strength]);

  const criteria = useMemo(
    () => [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains number', met: /[0-9]/.test(password) },
      { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  );

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength:</span>
          <span className={`font-medium ${colorClass}`}>{label}</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength < 40
                ? 'bg-red-500'
                : strength < 60
                  ? 'bg-orange-500'
                  : strength < 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
            }`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Criteria checklist */}
      {showCriteria && (
        <div className="space-y-1">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {criterion.met ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              <span className={criterion.met ? 'text-green-600' : 'text-muted-foreground'}>
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
