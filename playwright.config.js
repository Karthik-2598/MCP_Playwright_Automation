// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        // CI: each machine (API job, each E2E shard) writes a "blob", a raw result file.
        // A final job merges all blobs into ONE HTML report. BLOB_NAME keeps file names unique.
        ['blob', { fileName: `report-${process.env.BLOB_NAME ?? 'ci'}.zip` }],
        ['github'], // failures show up as annotations on the commit / PR
        ['list'],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
        // Machine-readable results. The custom MCP server (milestone 7) reads this file.
        ['json', { outputFile: 'results/results.json' }],
      ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://api.producthunt.com',
        extraHTTPHeaders: {
          Authorization: `Bearer ${process.env.PH_DEV_TOKEN ?? ''}`,
        },
      },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      workers: 2,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.producthunt.com',
        // Lets page objects use getByTestId('x') for elements marked data-test="x".
        testIdAttribute: 'data-test',
      },
    },
  ],
});
