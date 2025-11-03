module.exports = {
  // Use the @shelf/jest-mongodb preset
  preset: '@shelf/jest-mongodb',
  // Specify the test environment
  testEnvironment: 'node',
  // Stop running tests after the first failure
  bail: 1,
  // A map from regular expressions to paths to transformers
  transform: {},
  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

