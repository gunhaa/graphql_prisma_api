module.exports = {
  preset: "ts-jest", 
  rootDir: ".",
  testEnvironment: "node", 
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: [
    "**/__tests__/**/*.ts",
  ],
  setupFilesAfterEnv: ['<rootDir>/prisma/mocks/prismaMock.ts'],
};