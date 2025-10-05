/**
 * Homepage E2E Tests
 * 
 * End-to-end tests for the homepage URL checker feature.
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Anonymous User Experience', () => {
    test('should display hero section and URL checker', async ({ page }) => {
      // Check hero section
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Check URL input
      await expect(page.getByPlaceholder(/enter url/i)).toBeVisible();

      // Check scan button
      await expect(page.getByRole('button', { name: /check url/i })).toBeVisible();
    });

    test('should show sign-up CTA for anonymous users', async ({ page }) => {
      await expect(page.getByText(/sign up/i)).toBeVisible();
      await expect(page.getByText(/join linkshield/i)).toBeVisible();
    });

    test('should validate URL input', async ({ page }) => {
      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      // Enter invalid URL
      await urlInput.fill('not-a-url');
      await checkButton.click();

      // Should show validation error
      await expect(page.getByText(/invalid url/i)).toBeVisible();
    });

    test('should perform URL check', async ({ page }) => {
      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      // Enter valid URL
      await urlInput.fill('https://example.com');
      await checkButton.click();

      // Should show loading state
      await expect(page.getByText(/scanning/i)).toBeVisible();

      // Should show results
      await expect(page.getByText(/risk score/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/threat level/i)).toBeVisible();
    });

    test('should display scan type selector', async ({ page }) => {
      await expect(page.getByText(/quick/i)).toBeVisible();
      await expect(page.getByText(/comprehensive/i)).toBeVisible();
      await expect(page.getByText(/deep/i)).toBeVisible();
    });

    test('should disable deep scan for anonymous users', async ({ page }) => {
      const deepScanOption = page.getByRole('radio', { name: /deep/i });
      await expect(deepScanOption).toBeDisabled();
    });

    test('should show rate limit notice after multiple scans', async ({ page }) => {
      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      // Perform multiple scans
      for (let i = 0; i < 11; i++) {
        await urlInput.fill(`https://example${i}.com`);
        await checkButton.click();
        await page.waitForTimeout(1000);
      }

      // Should show rate limit notice
      await expect(page.getByText(/rate limit/i)).toBeVisible();
    });

    test('should navigate to sign-up when clicking CTA', async ({ page }) => {
      const signUpButton = page.getByRole('button', { name: /sign up free/i }).first();
      await signUpButton.click();

      // Should navigate to registration page
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe('Authenticated User Experience', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /log in/i }).click();
      await page.waitForURL('/dashboard');

      // Navigate back to homepage
      await page.goto('/');
    });

    test('should display quick actions panel', async ({ page }) => {
      await expect(page.getByText(/quick actions/i)).toBeVisible();
      await expect(page.getByText(/scan history/i)).toBeVisible();
      await expect(page.getByText(/api keys/i)).toBeVisible();
    });

    test('should display social protection panel', async ({ page }) => {
      await expect(page.getByText(/social protection/i)).toBeVisible();
      await expect(page.getByText(/extension status/i)).toBeVisible();
      await expect(page.getByText(/algorithm health/i)).toBeVisible();
    });

    test('should display social account scan', async ({ page }) => {
      await expect(page.getByText(/social account analysis/i)).toBeVisible();
      await expect(page.getByText(/twitter/i)).toBeVisible();
      await expect(page.getByText(/instagram/i)).toBeVisible();
    });

    test('should display subscription card', async ({ page }) => {
      await expect(page.getByText(/subscription/i)).toBeVisible();
      await expect(page.getByText(/plan/i)).toBeVisible();
    });

    test('should enable deep scan for authenticated users', async ({ page }) => {
      const deepScanOption = page.getByRole('radio', { name: /deep/i });
      await expect(deepScanOption).toBeEnabled();
    });

    test('should save scan to history', async ({ page }) => {
      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      await urlInput.fill('https://example.com');
      await checkButton.click();

      // Wait for results
      await expect(page.getByText(/risk score/i)).toBeVisible({ timeout: 10000 });

      // Should show "View in History" button
      await expect(page.getByRole('button', { name: /view in history/i })).toBeVisible();
    });

    test('should navigate to scan history', async ({ page }) => {
      const historyButton = page.getByRole('button', { name: /scan history/i }).first();
      await historyButton.click();

      await expect(page).toHaveURL(/\/dashboard\/url-analysis/);
    });

    test('should perform social account analysis', async ({ page }) => {
      // Select Twitter platform
      const twitterButton = page.getByRole('button', { name: /twitter/i });
      await twitterButton.click();

      // Enter profile URL
      const profileInput = page.getByPlaceholder(/twitter\.com/i);
      await profileInput.fill('https://twitter.com/testuser');

      // Click analyze visibility
      const analyzeButton = page.getByRole('button', { name: /analyze visibility/i });
      await analyzeButton.click();

      // Should show loading state
      await expect(page.getByText(/analyzing/i)).toBeVisible();

      // Should show results
      await expect(page.getByText(/visibility score/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that elements are visible and properly stacked
      await expect(page.getByPlaceholder(/enter url/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /check url/i })).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.getByPlaceholder(/enter url/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /check url/i })).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await expect(page.getByPlaceholder(/enter url/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /check url/i })).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab to URL input
      await page.keyboard.press('Tab');
      await expect(page.getByPlaceholder(/enter url/i)).toBeFocused();

      // Tab to scan type selector
      await page.keyboard.press('Tab');

      // Tab to check button
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: /check url/i })).toBeFocused();

      // Press Enter to submit
      await page.keyboard.press('Enter');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const urlInput = page.getByPlaceholder(/enter url/i);
      await expect(urlInput).toHaveAttribute('aria-label');

      const checkButton = page.getByRole('button', { name: /check url/i });
      await expect(checkButton).toHaveAttribute('aria-label');
    });

    test('should announce loading states to screen readers', async ({ page }) => {
      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      await urlInput.fill('https://example.com');
      await checkButton.click();

      // Check for aria-live region
      const loadingRegion = page.getByRole('status');
      await expect(loadingRegion).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should display network error', async ({ page }) => {
      // Simulate offline
      await page.context().setOffline(true);

      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      await urlInput.fill('https://example.com');
      await checkButton.click();

      // Should show network error
      await expect(page.getByText(/network error/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();

      // Go back online
      await page.context().setOffline(false);
    });

    test('should allow retry after error', async ({ page }) => {
      // Simulate offline
      await page.context().setOffline(true);

      const urlInput = page.getByPlaceholder(/enter url/i);
      const checkButton = page.getByRole('button', { name: /check url/i });

      await urlInput.fill('https://example.com');
      await checkButton.click();

      // Wait for error
      await expect(page.getByText(/network error/i)).toBeVisible();

      // Go back online
      await page.context().setOffline(false);

      // Click retry
      const retryButton = page.getByRole('button', { name: /try again/i });
      await retryButton.click();

      // Should show results
      await expect(page.getByText(/risk score/i)).toBeVisible({ timeout: 10000 });
    });
  });
});
