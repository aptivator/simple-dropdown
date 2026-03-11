import {defineConfig} from 'vitest/config'
import {webdriverio}  from '@vitest/browser-webdriverio'

export default defineConfig({
  test: {
    browser: {
      screenshotFailures: false,
      provider: webdriverio(),
      enabled: true,
      headless: true,
      instances: [{
        browser: 'chrome',
      }]
    },
    coverage: {
      provider: 'istanbul',
      exclude: [
        '**/test/_lib/**'
      ]
    },
    reporters: ['tree']
  }
});
