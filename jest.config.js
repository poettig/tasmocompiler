const path = require('path');

module.exports = {
  verbose: true,
  collectCoverage: true,
  setupFiles: [path.resolve(__dirname, 'jestSetup.js')],
  coverageReporters: ['text', 'text-summary'], // html reporter can be added to generate webpage with summary
  testEnvironment: "jsdom"
};
