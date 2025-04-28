// jest.setup.ts
import "@testing-library/jest-dom";
import "@testing-library/react";

// Suppress React 18 console errors during testing
const originalError = console.error;
console.error = (...args) => {
  // Filter out act() warnings that we can't easily fix
  if (typeof args[0] === 'string' && args[0].includes('inside a test was not wrapped in act')) {
    return;
  }
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Update failed')) {
    return;
  }
  originalError(...args);
};