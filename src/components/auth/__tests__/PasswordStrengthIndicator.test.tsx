import { render, screen } from '@testing-library/react';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('should not render when password is empty', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should show weak strength for weak password', () => {
    render(<PasswordStrengthIndicator password="weak" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('should show strong strength for strong password', () => {
    render(<PasswordStrengthIndicator password="Strong123!@#" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('should display all criteria when showCriteria is true', () => {
    render(<PasswordStrengthIndicator password="Test123!@#" showCriteria={true} />);
    
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('Contains uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains number')).toBeInTheDocument();
    expect(screen.getByText('Contains special character')).toBeInTheDocument();
  });

  it('should not display criteria when showCriteria is false', () => {
    render(<PasswordStrengthIndicator password="Test123!@#" showCriteria={false} />);
    
    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
  });

  it('should show check marks for met criteria', () => {
    const { container } = render(<PasswordStrengthIndicator password="Test123!@#" />);
    
    // All criteria should be met for this password
    const checkIcons = container.querySelectorAll('svg');
    expect(checkIcons.length).toBeGreaterThan(0);
  });
});
