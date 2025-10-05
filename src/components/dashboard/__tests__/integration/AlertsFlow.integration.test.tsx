import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAlert, useResolveAlert } from '@/hooks/dashboard/use-alerts';
import { __setAlertStatus } from '@/tests/msw/handlers/dashboardHandlers';

function TestAlertsFlow() {
  const { data: alert, isLoading } = useAlert('project-123', 'alert-456');
  const resolveAlert = useResolveAlert();

  if (isLoading) return <div>Loading...</div>;
  if (!alert) return <div>No alert</div>;

  return (
    <div>
      <div data-testid="alert-status">{alert.status}</div>
      <button
        onClick={() =>
          resolveAlert.mutate({ projectId: 'project-123', alertId: 'alert-456', data: { resolution_notes: 'Fixed' } })
        }
      >
        Resolve
      </button>
    </div>
  );
}

describe('Alerts data flow integration', () => {
  beforeEach(() => {
    __setAlertStatus('active');
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  it('resolves an alert and updates detail + invalidates overview', async () => {
    render(
      <Wrapper>
        <TestAlertsFlow />
      </Wrapper>
    );

    // Initial status
    expect(await screen.findByTestId('alert-status')).toHaveTextContent('active');

    // Resolve
    await userEvent.click(screen.getByRole('button', { name: /resolve/i }));

    // Optimistic update should show resolved
    expect(screen.getByTestId('alert-status')).toHaveTextContent('resolved');

    // After invalidation and refetch, ensure handler reflects resolved state
    await waitFor(() => {
      expect(screen.getByTestId('alert-status')).toHaveTextContent('resolved');
    });
  });
});