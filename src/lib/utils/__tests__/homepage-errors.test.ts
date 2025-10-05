/**
 * Homepage Error Utilities Tests
 */

import {
  HomepageErrorCode,
  ERROR_MESSAGES,
  mapApiError,
  retryWithBackoff,
  isNetworkError,
  isTimeoutError,
  isRateLimitError,
  requiresAuthentication,
  requiresUpgrade,
  getRetryDelay,
} from '../homepage-errors';

describe('Homepage Error Utilities', () => {
  describe('mapApiError', () => {
    it('should map API error with error_code', () => {
      const apiError = {
        response: {
          data: {
            error_code: HomepageErrorCode.INVALID_URL_FORMAT,
            message: 'Invalid URL provided',
          },
        },
      };

      const result = mapApiError(apiError);

      expect(result.code).toBe(HomepageErrorCode.INVALID_URL_FORMAT);
      expect(result.userMessage).toBe(ERROR_MESSAGES[HomepageErrorCode.INVALID_URL_FORMAT]);
      expect(result.retryable).toBe(false);
    });

    it('should mark timeout errors as retryable', () => {
      const apiError = {
        response: {
          data: {
            error_code: HomepageErrorCode.SCAN_TIMEOUT,
          },
        },
      };

      const result = mapApiError(apiError);

      expect(result.retryable).toBe(true);
    });

    it('should mark auth errors as requiresAuth', () => {
      const apiError = {
        response: {
          data: {
            error_code: HomepageErrorCode.UNAUTHORIZED,
          },
        },
      };

      const result = mapApiError(apiError);

      expect(result.requiresAuth).toBe(true);
    });

    it('should mark subscription errors as requiresUpgrade', () => {
      const apiError = {
        response: {
          data: {
            error_code: HomepageErrorCode.SUBSCRIPTION_REQUIRED,
          },
        },
      };

      const result = mapApiError(apiError);

      expect(result.requiresUpgrade).toBe(true);
    });

    it('should handle unknown errors', () => {
      const apiError = {
        message: 'Something went wrong',
      };

      const result = mapApiError(apiError);

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.userMessage).toBe('Something went wrong');
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce({
          response: {
            data: { error_code: HomepageErrorCode.NETWORK_ERROR },
          },
        })
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxAttempts: 3,
        delayMs: 10,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const fn = jest.fn().mockRejectedValue({
        response: {
          data: { error_code: HomepageErrorCode.INVALID_URL_FORMAT },
        },
      });

      await expect(
        retryWithBackoff(fn, { maxAttempts: 3, delayMs: 10 })
      ).rejects.toThrow();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should respect maxAttempts', async () => {
      const fn = jest.fn().mockRejectedValue({
        response: {
          data: { error_code: HomepageErrorCode.NETWORK_ERROR },
        },
      });

      await expect(
        retryWithBackoff(fn, { maxAttempts: 3, delayMs: 10 })
      ).rejects.toThrow();

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      const fn = jest.fn().mockRejectedValue({
        response: {
          data: { error_code: HomepageErrorCode.NETWORK_ERROR },
        },
      });

      const startTime = Date.now();

      await expect(
        retryWithBackoff(fn, {
          maxAttempts: 3,
          delayMs: 100,
          backoffMultiplier: 2,
        })
      ).rejects.toThrow();

      const duration = Date.now() - startTime;

      // Should wait: 100ms + 200ms = 300ms minimum
      expect(duration).toBeGreaterThanOrEqual(300);
    });
  });

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      const error = {
        code: 'ERR_NETWORK',
        message: 'Network Error',
      };

      expect(isNetworkError(error)).toBe(true);
    });

    it('should detect connection aborted', () => {
      const error = {
        code: 'ECONNABORTED',
      };

      expect(isNetworkError(error)).toBe(true);
    });

    it('should return false for API errors', () => {
      const error = {
        response: {
          status: 400,
          data: { error_code: 'INVALID_URL' },
        },
      };

      expect(isNetworkError(error)).toBe(false);
    });
  });

  describe('isTimeoutError', () => {
    it('should detect timeout errors', () => {
      const error = {
        code: 'ETIMEDOUT',
      };

      expect(isTimeoutError(error)).toBe(true);
    });

    it('should detect connection aborted', () => {
      const error = {
        code: 'ECONNABORTED',
      };

      expect(isTimeoutError(error)).toBe(true);
    });

    it('should detect timeout in message', () => {
      const error = {
        message: 'Request timeout exceeded',
      };

      expect(isTimeoutError(error)).toBe(true);
    });
  });

  describe('isRateLimitError', () => {
    it('should detect 429 status code', () => {
      const error = {
        response: {
          status: 429,
        },
      };

      expect(isRateLimitError(error)).toBe(true);
    });

    it('should detect rate limit error code', () => {
      const error = {
        response: {
          data: {
            error_code: HomepageErrorCode.RATE_LIMIT_EXCEEDED,
          },
        },
      };

      expect(isRateLimitError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = {
        response: {
          status: 400,
        },
      };

      expect(isRateLimitError(error)).toBe(false);
    });
  });

  describe('requiresAuthentication', () => {
    it('should detect 401 status code', () => {
      const error = {
        response: {
          status: 401,
        },
      };

      expect(requiresAuthentication(error)).toBe(true);
    });

    it('should detect unauthorized error code', () => {
      const error = {
        response: {
          data: {
            error_code: HomepageErrorCode.UNAUTHORIZED,
          },
        },
      };

      expect(requiresAuthentication(error)).toBe(true);
    });
  });

  describe('requiresUpgrade', () => {
    it('should detect 402 status code', () => {
      const error = {
        response: {
          status: 402,
        },
      };

      expect(requiresUpgrade(error)).toBe(true);
    });

    it('should detect feature not available error', () => {
      const error = {
        response: {
          data: {
            error_code: HomepageErrorCode.FEATURE_NOT_AVAILABLE,
          },
        },
      };

      expect(requiresUpgrade(error)).toBe(true);
    });

    it('should detect subscription required error', () => {
      const error = {
        response: {
          data: {
            error_code: HomepageErrorCode.SUBSCRIPTION_REQUIRED,
          },
        },
      };

      expect(requiresUpgrade(error)).toBe(true);
    });
  });

  describe('getRetryDelay', () => {
    it('should parse Retry-After header', () => {
      const error = {
        response: {
          headers: {
            'retry-after': '60',
          },
        },
      };

      const delay = getRetryDelay(error);

      expect(delay).toBe(60000); // 60 seconds in milliseconds
    });

    it('should parse X-RateLimit-Reset header', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now

      const error = {
        response: {
          headers: {
            'x-ratelimit-reset': futureTime.toString(),
          },
        },
      };

      const delay = getRetryDelay(error);

      expect(delay).toBeGreaterThan(110000); // At least 110 seconds
      expect(delay).toBeLessThan(130000); // At most 130 seconds
    });

    it('should return null if no headers present', () => {
      const error = {
        response: {
          headers: {},
        },
      };

      const delay = getRetryDelay(error);

      expect(delay).toBeNull();
    });

    it('should return null if reset time is in the past', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

      const error = {
        response: {
          headers: {
            'x-ratelimit-reset': pastTime.toString(),
          },
        },
      };

      const delay = getRetryDelay(error);

      expect(delay).toBeNull();
    });
  });
});
