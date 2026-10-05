// @ts-check
// Data-driven: one test definition, run once per row in test-data/categories.js.
// Adding a category is a one-line data change, no new test code.
const { test, expect } = require('../../fixtures');
const categories = require('../../test-data/categories');

test.describe('Category pages', () => {
  for (const { slug, heading } of categories) {
    test(`"${slug}" shows its heading and lists products`, { tag: ['@regression', '@data-driven'] }, async ({ topicPage }) => {
      const response = await topicPage.open(slug);
      expect(response?.status()).toBe(200);
      await expect(topicPage.heading(heading)).toBeVisible();
      await expect(topicPage.mainLinks.first()).toBeVisible();
    });
  }

  test('an unknown category returns a real 404, not an empty 200 page', { tag: ['@regression', '@negative'] }, async ({ topicPage }) => {
    const response = await topicPage.open('this-category-does-not-exist-zzz');

    expect(response?.status()).toBe(404);
  });
});
