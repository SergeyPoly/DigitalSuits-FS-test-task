module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/src/**/*.test.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "node"
  ],
  setupFilesAfterEnv: [],
};
