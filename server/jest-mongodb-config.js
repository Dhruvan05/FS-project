// This file configures the in-memory MongoDB server for Jest
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.0', // Use the same version as your docker-compose.yml
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
  },
};

