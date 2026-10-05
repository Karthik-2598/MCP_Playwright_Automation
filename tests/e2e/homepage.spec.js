// @ts-check
const { test, expect } = require('../../fixtures');

test.describe('Homepage', () => {
  test('loads and shows a populated product list', { tag: ['@smoke'] }, async ({ homePage, page }) => {
    await homePage.open();

    await expect(page).toHaveTitle(/Product Hunt/i);
    await expect(homePage.main).toBeVisible();
    await expect(homePage.mainLinks.first()).toBeVisible();
    expect(await homePage.mainLinks.count()).toBeGreaterThan(3);
  });
});
