// Suppress node deprecation warnings
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, code, ...args) => {
  // Skip punycode deprecation warnings
  if (code === 'DEP0040') {
    return;
  }

  // Let other warnings through
  return originalEmitWarning(warning, type, code, ...args);
};
