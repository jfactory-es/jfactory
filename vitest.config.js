const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    test: {
      name: "jFactory Test Suite",
      setupFiles: '/scripts/test/test-mock-srv.mjs',
      include: ['**/test/index.js'], // Comment this to test everything as separated tests
      forceRerunTriggers: [
        '**/dev/**',
        '**/src/**',
        '**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**'
      ],
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          resources: "usable" // required to load css from <link>, https://github.com/jsdom/jsdom#basic-options
        }
      }
    }
  }
);