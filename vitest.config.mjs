import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'Bulk',
    threads: true,
    setupFiles: '/scripts/test/test-setup.mjs',
    include: ['./test/index.mjs'],
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        // required to load css from <link>,
        // https://github.com/jsdom/jsdom#basic-options
        resources: 'usable'
      }
    }
  }
});