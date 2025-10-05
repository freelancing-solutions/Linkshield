/**
 * SocialAccountScan Component Tests
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocialAccountScan } from '../SocialAccountScan';
import * as socialProtectionHooks from '@/hooks/homepage/use-social-protection';

// Mock the hooks
jest.mock('@/hooks/homepage/use-social-protection');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SocialAccountScan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Platform Selection', () => {
    it('should render all platform buttons', () => {
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      expect(screen.getByText(/Twitter\/X/i)).toBeInTheDocument();
      expect(screen.getByText(/Instagram/i)).toBeInTheDocument();
      expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
    });

    it('should select Twitter by default', () => {
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const twitterButton = screen.getByRole('button', { name: /Twitter\/X/i });
      expect(twitterButton).toHaveClass('bg-primary'); // or whatever your selected class is
    });

    it('should change platform when clicked', async () => {
      const user = userEvent.setup();
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const instagramButton = screen.getByRole('button', { name: /Instagram/i });
      await user.click(instagramButton);

      const urlInput = screen.getByPlaceholderText(/instagram\.com/i);
      expect(urlInput).toBeInTheDocument();
    });

    it('should clear URL when platform changes', async () => {
      const user = userEvent.setup();
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const instagramButton = screen.getByRole('button', { name: /Instagram/i });
      await user.click(instagramButton);

      expect(urlInput).toHaveValue('');
    });
  });

  describe('URL Validation', () => {
    it('should show error for invalid URL format', async () => {
      const user = userEvent.setup();
      const mockAnalyze = jest.fn();
      (socialProtectionHooks.useAnalyzeVisibility as jest.Mock).mockReturnValue({
        mutateAsync: mockAnalyze,
        isPending: false,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'invalid-url');

      const analyzeButton = screen.getByRole('button', { name: /Analyze Visibility/i });
      await user.click(analyzeButton);

      expect(await screen.findByText(/Invalid.*profile URL/i)).toBeInTheDocument();
      expect(mockAnalyze).not.toHaveBeenCalled();
    });

    it('should accept valid Twitter URL', async () => {
      const user = userEvent.setup();
      const mockAnalyze = jest.fn().mockResolvedValue({
        analysis_id: '123',
        score: 85,
        reach_metrics: {
          impressions: 10000,
          reach: 8000,
          visibility_rate: 0.8,
        },
        recommendations: ['Post more consistently'],
        analyzed_at: new Date().toISOString(),
      });

      (socialProtectionHooks.useAnalyzeVisibility as jest.Mock).mockReturnValue({
        mutateAsync: mockAnalyze,
        isPending: false,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const analyzeButton = screen.getByRole('button', { name: /Analyze Visibility/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(mockAnalyze).toHaveBeenCalled();
      });
    });

    it('should accept valid Instagram URL', async () => {
      const user = userEvent.setup();
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      // Switch to Instagram
      const instagramButton = screen.getByRole('button', { name: /Instagram/i });
      await user.click(instagramButton);

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://instagram.com/testuser');

      // Should not show error
      expect(screen.queryByText(/Invalid.*profile URL/i)).not.toBeInTheDocument();
    });
  });

  describe('Analysis Actions', () => {
    it('should disable analysis buttons when no URL is entered', () => {
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const visibilityButton = screen.getByRole('button', { name: /Analyze Visibility/i });
      const engagementButton = screen.getByRole('button', { name: /Analyze Engagement/i });
      const penaltiesButton = screen.getByRole('button', { name: /Detect Penalties/i });

      expect(visibilityButton).toBeDisabled();
      expect(engagementButton).toBeDisabled();
      expect(penaltiesButton).toBeDisabled();
    });

    it('should enable analysis buttons when valid URL is entered', async () => {
      const user = userEvent.setup();
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const visibilityButton = screen.getByRole('button', { name: /Analyze Visibility/i });
      expect(visibilityButton).not.toBeDisabled();
    });

    it('should show loading state during analysis', async () => {
      const user = userEvent.setup();
      const mockAnalyze = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      (socialProtectionHooks.useAnalyzeVisibility as jest.Mock).mockReturnValue({
        mutateAsync: mockAnalyze,
        isPending: true,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      expect(screen.getByText(/Analyzing your.*account/i)).toBeInTheDocument();
    });
  });

  describe('Results Display', () => {
    it('should display visibility results', async () => {
      const user = userEvent.setup();
      const mockResult = {
        analysis_id: '123',
        score: 85,
        reach_metrics: {
          impressions: 10000,
          reach: 8000,
          visibility_rate: 0.8,
        },
        recommendations: ['Post more consistently', 'Use hashtags'],
        analyzed_at: new Date().toISOString(),
      };

      const mockAnalyze = jest.fn().mockResolvedValue(mockResult);
      (socialProtectionHooks.useAnalyzeVisibility as jest.Mock).mockReturnValue({
        mutateAsync: mockAnalyze,
        isPending: false,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const analyzeButton = screen.getByRole('button', { name: /Analyze Visibility/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText('85')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toBeInTheDocument();
        expect(screen.getByText('8,000')).toBeInTheDocument();
      });
    });

    it('should display engagement results', async () => {
      const user = userEvent.setup();
      const mockResult = {
        analysis_id: '456',
        score: 75,
        engagement_metrics: {
          likes: 500,
          comments: 100,
          shares: 50,
          engagement_rate: 0.05,
        },
        recommendations: ['Respond to comments'],
        analyzed_at: new Date().toISOString(),
      };

      const mockAnalyze = jest.fn().mockResolvedValue(mockResult);
      (socialProtectionHooks.useAnalyzeEngagement as jest.Mock).mockReturnValue({
        mutateAsync: mockAnalyze,
        isPending: false,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const analyzeButton = screen.getByRole('button', { name: /Analyze Engagement/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
      });
    });

    it('should display penalty detection results', async () => {
      const user = userEvent.setup();
      const mockResult = {
        detection_id: '789',
        penalties_found: true,
        penalties: [
          {
            type: 'Shadow Ban',
            severity: 'HIGH' as const,
            description: 'Your content is not appearing in search results',
            detected_at: new Date().toISOString(),
          },
        ],
        recommendations: ['Review community guidelines'],
        analyzed_at: new Date().toISOString(),
      };

      const mockDetect = jest.fn().mockResolvedValue(mockResult);
      (socialProtectionHooks.useDetectPenalties as jest.Mock).mockReturnValue({
        mutateAsync: mockDetect,
        isPending: false,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const detectButton = screen.getByRole('button', { name: /Detect Penalties/i });
      await user.click(detectButton);

      await waitFor(() => {
        expect(screen.getByText(/Shadow Ban/i)).toBeInTheDocument();
        expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
      });
    });

    it('should show no penalties message when none detected', async () => {
      const user = userEvent.setup();
      const mockResult = {
        detection_id: '789',
        penalties_found: false,
        penalties: [],
        recommendations: [],
        analyzed_at: new Date().toISOString(),
      };

      const mockDetect = jest.fn().mockResolvedValue(mockResult);
      (socialProtectionHooks.useDetectPenalties as jest.Mock).mockReturnValue({
        mutateAsync: mockDetect,
        isPending: false,
      });

      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'https://twitter.com/testuser');

      const detectButton = screen.getByRole('button', { name: /Detect Penalties/i });
      await user.click(detectButton);

      await waitFor(() => {
        expect(screen.getByText(/No penalties detected/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      expect(urlInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('should show ARIA invalid when error occurs', async () => {
      const user = userEvent.setup();
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      const urlInput = screen.getByRole('textbox', { name: /profile url/i });
      await user.type(urlInput, 'invalid-url');

      const analyzeButton = screen.getByRole('button', { name: /Analyze Visibility/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(urlInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<SocialAccountScan />, { wrapper: createWrapper() });

      // Tab through platform buttons
      await user.tab();
      expect(screen.getByRole('button', { name: /Twitter\/X/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /Instagram/i })).toHaveFocus();
    });
  });
});
