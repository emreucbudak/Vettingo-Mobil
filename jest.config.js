module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  collectCoverageFrom: [
    "src/features/**/domain/**/*.ts",
    "src/features/**/application/**/*.ts",
    "src/features/**/presentation/screens/**/*.tsx",
    "src/core/application/**/*.ts",
    "src/shared/domain/**/*.ts",
  ],
};
