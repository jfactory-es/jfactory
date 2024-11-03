import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'package',
    threads: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        // required to load css from <link>,
        // https://github.com/jsdom/jsdom#basic-options
        resources: 'usable'
      }
    }
  }
})