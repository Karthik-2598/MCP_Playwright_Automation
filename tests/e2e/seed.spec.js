// @ts-check
// Seed for the Playwright Test Agents (planner, generator, healer).
//
// The agents run THIS test first and pause at its end, then take over the browser from
// there. So whatever the seed sets up, every agent session inherits:
//   - the e2e project: Desktop Chrome at 1280x720, data-test as the test id attribute
//   - our fixtures: ad/analytics blocking and the cookie banner auto-decline
//   - BasePage.goto(): skips cleanly if Cloudflare serves its bot challenge
// The generator also copies the seed's imports and style into the tests it writes,
// which is why this uses fixtures/ and a page object instead of page.goto().
//
// It is also a real (tiny) test, so it runs with the rest of the suite.
const { test, expect } = require('../../fixtures');

test.describe('Seed', () => {
  test('seed', { tag: ['@regression', '@seed'] }, async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.header.mainNav).toBeVisible();
  });
});
