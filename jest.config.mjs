const config = {
  // Clear mocks before each test
  clearMocks: true,

  // Use v8 for coverage
  coverageProvider: "v8",

  // File extensions to handle
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "json",
    "node"
  ],

  // Specify where to find test files
  testMatch: [
    "**/server/__tests__/**/*.test.mjs",
    "**/server/__tests__/**/*.spec.mjs"
  ],

  // Node environment for server tests
  testEnvironment: "node",

  // Transform ESM files
  transform: {},

  // Important for ES modules
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;