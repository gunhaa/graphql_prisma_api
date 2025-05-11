module.exports = {
  preset: "ts-jest", 
  rootDir: ".",
  testEnvironment: "node", 
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ['**/__tests__/integrationTests/**/*.test.ts'],
  moduleFileExtensions: ["ts", "tsx", "js", "json"]
};