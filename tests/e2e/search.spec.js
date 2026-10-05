// @ts-check
const { test, expect } = require('../../fixtures');
const { SearchResultsPage } = require('../../pages/SearchResultsPage');

// The original version typed into `input:not([readonly])`, which matched the
// newsletter email box, then looked for "notion" anywhere on the page. The
// homepage already contains that word, so the test could pass without searching.
// These versions assert on search-specific elements only.
test.describe('Search (live)', () => {
  test('submitting a known term opens a results page with matching products', { tag: ['@smoke'] }, async ({ homePage, searchResultsPage, page }) => {
    await homePage.open();
    await homePage.header.search('notion');

    // Not just /search?q= : the first live run proved an EMPTY query also matches that.
    await expect(page).toHaveURL(/\/search\?q=notion/);
    await expect(searchResultsPage.productResultsMatching('notion').first()).toBeVisible();
  });

  test('typing shows live suggestions without leaving the page', { tag: ['@regression'] }, async ({ homePage, page }) => {
    await homePage.open();
    const { spotlight } = homePage.header;

    await spotlight.open();
    await spotlight.type('notion');

    await expect(spotlight.productResults.first()).toBeVisible();
    await expect(page).not.toHaveURL(SearchResultsPage.URL_PATTERN);
  });
});
