// Comprehensive polyfills for MSW v2 compatibility
// Using cross-fetch for web APIs that aren't available in Jest environment

// Core Node.js modules that provide web APIs
const { TextEncoder, TextDecoder } = require('node:util');
const { ReadableStream, TransformStream } = require('node:stream/web');
const { performance, PerformanceObserver } = require('node:perf_hooks');
const { clearImmediate } = require('node:timers');

// Use cross-fetch for web APIs
const { fetch, Response, Request, Headers } = require('cross-fetch');

// Set up global polyfills
Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  performance: { value: performance },
  PerformanceObserver: { value: PerformanceObserver },
  clearImmediate: { value: clearImmediate },
  
  // Web APIs from cross-fetch
  fetch: { value: fetch },
  Response: { value: Response },
  Request: { value: Request },
  Headers: { value: Headers },
});

// BroadcastChannel polyfill (simple mock for testing)
if (typeof globalThis.BroadcastChannel === 'undefined') {
  globalThis.BroadcastChannel = class BroadcastChannel {
    constructor(name) {
      this.name = name;
      this.listeners = new Set();
    }
    
    postMessage(message) {
      // Mock implementation - no actual broadcasting
      this.listeners.forEach(listener => {
        try {
          listener({ data: message, origin: 'mock' });
        } catch (e) {
          // Ignore errors in mock listeners
        }
      });
    }
    
    addEventListener(type, listener) {
      if (type === 'message') {
        this.listeners.add(listener);
      }
    }
    
    removeEventListener(type, listener) {
      if (type === 'message') {
        this.listeners.delete(listener);
      }
    }
    
    close() {
      this.listeners.clear();
    }
  };
}

// FormData polyfill (if needed)
if (typeof globalThis.FormData === 'undefined') {
  // Simple FormData polyfill for testing
  globalThis.FormData = class FormData {
    constructor() {
      this.data = new Map();
    }
    append(key, value) {
      this.data.set(key, value);
    }
    get(key) {
      return this.data.get(key);
    }
    has(key) {
      return this.data.has(key);
    }
    keys() {
      return this.data.keys();
    }
    values() {
      return this.data.values();
    }
    entries() {
      return this.data.entries();
    }
    *[Symbol.iterator]() {
      yield* this.data.entries();
    }
  };
}