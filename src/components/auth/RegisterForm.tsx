'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/auth';
import { useRegister } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { z } from 'zod';

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      company: '',
      accept_terms: false,
      marketing_consent: false,
    },
  });

  const password = watch('password');

  const onSubmit = (data: RegisterFormData) => {
    register.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...registerField('email')}
            disabled={register.isPending}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="full_name"
            type="text"
            placeholder="John Doe"
            {...registerField('full_name')}
            disabled={register.isPending}
          />
          {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
        </div>

        {/* Company (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            type="text"
            placeholder="Acme Inc."
            {...registerField('company')}
            disabled={register.isPending}
          />
          {errors.company && <p className="text-sm text-red-600">{errors.company.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...registerField('password')}
              disabled={register.isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          {password && <PasswordStrengthIndicator password={password} />}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...registerField('confirmPassword')}
              disabled={register.isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Accept Terms */}
        <div className="flex items-start space-x-2">
          <input
            id="accept_terms"
            type="checkbox"
            {...registerField('accept_terms')}
            disabled={register.isPending}
            className="mt-1"
          />
          <Label htmlFor="accept_terms" className="text-sm font-normal cursor-pointer">
            I accept the{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{' '}
            <span className="text-red-500">*</span>
          </Label>
        </div>
        {errors.accept_terms && (
          <p className="text-sm text-red-600">{errors.accept_terms.message}</p>
        )}

        {/* Marketing Consent */}
        <div className="flex items-start space-x-2">
          <input
            id="marketing_consent"
            type="checkbox"
            {...registerField('marketing_consent')}
            disabled={register.isPending}
            className="mt-1"
          />
          <Label htmlFor="marketing_consent" className="text-sm font-normal cursor-pointer">
            I would like to receive product updates and marketing communications
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={register.isPending}>
        {register.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Log in
        </Link>
      </p>
    </form>
  );
}
