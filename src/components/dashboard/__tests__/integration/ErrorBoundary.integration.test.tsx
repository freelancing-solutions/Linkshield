import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useRef } from 'react';
import { DashboardErrorBoundary } from '@/components/dashboard/ErrorBoundary';

function ThrowOnce() {
  const thrownRef = useRef(false);
  if (!thrownRef.current) {
    thrownRef.current = true;
    throw new Error('Test render error');
  }
  return <div data-testid="safe-content">Content renders safely</div>;
}

describe('DashboardErrorBoundary integration', () => {
  it('shows fallback UI on error and recovers on Retry', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <DashboardErrorBoundary component="Test Component" level="component">
        <ThrowOnce />
      </DashboardErrorBoundary>
    );

    // Fallback is shown
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();

    // Toggle details
    await userEvent.click(screen.getByRole('button', { name: /details/i }));
    expect(screen.getByText(/id:/i)).toBeInTheDocument();
    expect(screen.getByText(/error:/i)).toBeInTheDocument();

    // Retry should reset boundary and render safe content
    await userEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(screen.getByTestId('safe-content')).toBeInTheDocument();

    // Logging occurred
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});