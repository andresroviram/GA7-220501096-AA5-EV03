module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { plugins: ['./test/transformers/importMetaEnv.cjs'] }],
  },
};
