module.exports = {
  preset: "ts-jest", 
  rootDir: ".",
  testEnvironment: "node", 
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ['**/__tests__/unitTests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/prisma/mocks/prismaMock.ts'],
  moduleFileExtensions: ["ts", "tsx", "js", "json"]
};