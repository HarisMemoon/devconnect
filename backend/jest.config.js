// jest.config.js
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  transform: {},
  maxWorkers: 1, // Run tests sequentially to avoid database conflicts
};
