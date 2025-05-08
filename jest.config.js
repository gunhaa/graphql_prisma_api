module.exports = {
  preset: "ts-jest", 
  rootDir: ".",
  testEnvironment: "node", 
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globalSetup: "<rootDir>/tests/setup.ts", 
  globalTeardown: "<rootDir>/tests/teardown.ts",
  testMatch: [
    "**/tests/**/*.ts",
  ],
};
