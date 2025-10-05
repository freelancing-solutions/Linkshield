// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { server } from './src/tests/msw/server';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());
