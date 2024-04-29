/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  maxWorkers: "20%",
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/src/setVarsJest.js'],
};

export default config;
