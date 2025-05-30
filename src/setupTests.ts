import '@testing-library/jest-dom/vitest';

// This file is used to extend Vitest's expect with jest-dom matchers
// These matchers allow you to do things like:
// expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom

// You can add more global test setup here if needed
// For example, to mock global objects or set up test environment variables

// Mock window.matchMedia which is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress console errors during tests
beforeAll(() => {
  console.error = vi.fn();
});

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
