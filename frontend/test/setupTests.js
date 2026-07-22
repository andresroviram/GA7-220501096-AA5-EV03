import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

global.__APP_VERSION__ = '1.0.0';
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
