const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    test: {
      name: "jFactory Test Suite",
      setupFiles: '/scripts/test/test-mock-srv.mjs',
      // include: ['**/test/index.js'], // bulk mode : use the index.js, modules loaded once
      include: ['./test/*.test.js'], // separated mode : modules loaded for each test
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          resources: "usable" // required to load css from <link>, https://github.com/jsdom/jsdom#basic-options
        }
      }
    }
  }
);