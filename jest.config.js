module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  collectCoverageFrom: [
    "src/domain/**/*.{ts,tsx}",
    "src/application/**/*.ts",
    "src/presentation/screens/**/*.{ts,tsx}",
  ],
};
