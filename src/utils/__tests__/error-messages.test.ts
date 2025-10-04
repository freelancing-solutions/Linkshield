import { getErrorMessage, getErrorFromResponse, isNetworkError, isTimeoutError } from '../error-messages';

describe('Error Message Utilities', () => {
  describe('getErrorMessage', () => {
    it('should return correct message for known error code', () => {
      expect(getErrorMessage('EMAIL_ALREADY_EXISTS')).toContain('already registered');
      expect(getErrorMessage('INVALID_CREDENTIALS')).toContain('Invalid email or password');
      expect(getErrorMessage('RATE_LIMIT_EXCEEDED')).toContain('Too many requests');
    });

    it('should return default message for unknown error code', () => {
      const message = getErrorMessage('UNKNOWN_ERROR_CODE');
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('getErrorFromResponse', () => {
    it('should extract error_code from response', () => {
      const error = {
        response: {
          data: {
            error_code: 'EMAIL_ALREADY_EXISTS',
          },
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toContain('already registered');
    });

    it('should extract message from response', () => {
      const error = {
        response: {
          data: {
            message: 'Custom error message',
          },
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toBe('Custom error message');
    });

    it('should handle 401 status code', () => {
      const error = {
        response: {
          status: 401,
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toContain('Authentication required');
    });

    it('should handle 403 status code', () => {
      const error = {
        response: {
          status: 403,
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toContain('permission');
    });

    it('should handle 404 status code', () => {
      const error = {
        response: {
          status: 404,
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toContain('not found');
    });

    it('should handle 429 status code', () => {
      const error = {
        response: {
          status: 429,
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toContain('Too many requests');
    });

    it('should handle 500 status code', () => {
      const error = {
        response: {
          status: 500,
        },
      };

      const message = getErrorFromResponse(error);
      expect(message).toContain('Server error');
    });

    it('should return default message for unknown error', () => {
      const error = {};
      const message = getErrorFromResponse(error);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('isNetworkError', () => {
    it('should return true for network error', () => {
      const error = {
        request: {},
      };

      expect(isNetworkError(error)).toBe(true);
    });

    it('should return false for response error', () => {
      const error = {
        response: {},
        request: {},
      };

      expect(isNetworkError(error)).toBe(false);
    });
  });

  describe('isTimeoutError', () => {
    it('should return true for timeout error with code', () => {
      const error = {
        code: 'ECONNABORTED',
      };

      expect(isTimeoutError(error)).toBe(true);
    });

    it('should return true for timeout error with message', () => {
      const error = {
        message: 'Request timeout',
      };

      expect(isTimeoutError(error)).toBe(true);
    });

    it('should return false for non-timeout error', () => {
      const error = {
        code: 'OTHER_ERROR',
        message: 'Some other error',
      };

      expect(isTimeoutError(error)).toBe(false);
    });
  });
});
