export const preset = "ts-jest";
export const testEnvironment = "node";
export const testMatch = ["**/*.test.ts"];
export const setupFilesAfterEnv = ["<rootDir>/src/tests/setup.ts"];
export const forceExit = true;