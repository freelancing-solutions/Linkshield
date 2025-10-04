import {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  passwordResetSchema,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
} from '../auth';

describe('Authentication Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        full_name: 'John Doe',
        company: 'Acme Inc',
        accept_terms: true,
        marketing_consent: false,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        full_name: 'John Doe',
        accept_terms: true,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        full_name: 'John Doe',
        accept_terms: true,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        confirmPassword: 'Different123!@#',
        full_name: 'John Doe',
        accept_terms: true,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject when terms not accepted', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
        full_name: 'John Doe',
        accept_terms: false,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        remember_me: true,
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('passwordChangeSchema', () => {
    it('should validate correct password change data', () => {
      const validData = {
        current_password: 'OldPass123!@#',
        new_password: 'NewPass123!@#',
        confirm_password: 'NewPass123!@#',
      };

      const result = passwordChangeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when new password matches current', () => {
      const invalidData = {
        current_password: 'SamePass123!@#',
        new_password: 'SamePass123!@#',
        confirm_password: 'SamePass123!@#',
      };

      const result = passwordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        current_password: 'OldPass123!@#',
        new_password: 'NewPass123!@#',
        confirm_password: 'Different123!@#',
      };

      const result = passwordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Password Strength Utilities', () => {
  describe('calculatePasswordStrength', () => {
    it('should return 0 for empty password', () => {
      expect(calculatePasswordStrength('')).toBe(0);
    });

    it('should return low strength for weak password', () => {
      const strength = calculatePasswordStrength('weak');
      expect(strength).toBeLessThan(40);
    });

    it('should return medium strength for moderate password', () => {
      const strength = calculatePasswordStrength('Moderate1');
      expect(strength).toBeGreaterThanOrEqual(40);
      expect(strength).toBeLessThan(80);
    });

    it('should return high strength for strong password', () => {
      const strength = calculatePasswordStrength('Strong123!@#');
      expect(strength).toBeGreaterThanOrEqual(80);
    });

    it('should cap strength at 100', () => {
      const strength = calculatePasswordStrength('VeryStrongPassword123!@#$%^&*()');
      expect(strength).toBeLessThanOrEqual(100);
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return "Weak" for strength < 40', () => {
      expect(getPasswordStrengthLabel(30)).toBe('Weak');
    });

    it('should return "Fair" for strength 40-59', () => {
      expect(getPasswordStrengthLabel(50)).toBe('Fair');
    });

    it('should return "Good" for strength 60-79', () => {
      expect(getPasswordStrengthLabel(70)).toBe('Good');
    });

    it('should return "Strong" for strength >= 80', () => {
      expect(getPasswordStrengthLabel(90)).toBe('Strong');
    });
  });
});
