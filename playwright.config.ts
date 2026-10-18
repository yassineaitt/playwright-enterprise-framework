import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { env } from './src/utils/env';

/**
 * Playwright configuration.
 *
 * - UI projects (chromium/firefox/webkit) run tests under tests/ui against BASE_URL.
 * - The api project runs tests under tests/api with no browser.
 * - Retries, traces and videos are only kept on failure to keep artifacts small.
 * - Sharding is driven by the CLI (`--shard=1/2`) so the same config works locally and in CI.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  ...(env.CI ? { workers: 4 } : {}),
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results',
  reporter: env.CI
    ? [['blob'], ['github'], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.BASE_URL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    headless: !env.HEADED,
    testIdAttribute: 'data-testid',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.API_BASE_URL,
        extraHTTPHeaders: { Accept: 'application/json' },
        trace: 'off',
        video: 'off',
        screenshot: 'off',
      },
    },
  ],
});
