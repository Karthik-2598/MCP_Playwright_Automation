// @ts-check
// Network mocking: replace the search API's answer, then check the UI renders
// exactly what it was given. This tests the frontend in isolation from live data,
// so results are deterministic and edge cases (empty, error) are easy to force.
const { test, expect } = require('../../fixtures');
const { respondWith } = require('../../fixtures/network');
const oneProduct = require('../../test-data/mocks/spotlight-one-product.json');
const empty = require('../../test-data/mocks/spotlight-empty.json');

const SEARCH_OP = 'SpotlightSearchQuery';
// Minified React hydration errors: server HTML didn't match the client render.
const KNOWN_SITE_ERRORS = /Minified React error #(418|423|425)/;

test.describe('Search UI with a mocked API', { tag: ['@regression', '@mock'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.header.spotlight.open();
  });

  test('renders exactly the results the API returns', async ({ homePage, mockGraphQL }) => {
    const calls = await mockGraphQL(SEARCH_OP, respondWith(oneProduct));
    const { spotlight } = homePage.header;

    await spotlight.type('notion'); // a real term, but the answer is ours

    await expect(spotlight.productResult('999001')).toContainText('Mocked QA Product');
    await expect(spotlight.productResults).toHaveCount(1);
    expect(calls(), 'the search request should have been intercepted').toBeGreaterThan(0);
  });

  test('shows the empty state when the API returns no results', async ({ homePage, mockGraphQL }) => {
    await mockGraphQL(SEARCH_OP, respondWith(empty));
    const { spotlight } = homePage.header;

    // "notion" always has live results, so an empty state here can only come from our mock.
    await spotlight.type('notion');

    await expect(spotlight.noResultsMessage).toBeVisible();
    await expect(spotlight.results).toHaveCount(0);
  });

  test('survives a failing search API without crashing', { tag: ['@negative'] }, async ({ homePage, mockGraphQL, page }, testInfo) => {
    await mockGraphQL(SEARCH_OP, respondWith({ errors: [{ message: 'Internal server error' }] }, 500));
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    const { spotlight } = homePage.header;

    const failedSearch = page.waitForResponse((r) => r.url().includes(SEARCH_OP) && r.status() === 500);
    await spotlight.type('notion');
    await failedSearch; // our fake failure has definitely reached the page
    await page.waitForTimeout(1_000); // give a crash time to surface; no event exists for "nothing happened"

    await expect(spotlight.input, 'search box should still be usable').toBeEditable();
    await expect(spotlight.productResults).toHaveCount(0);

    // React #418 (hydration mismatch) is a pre-existing Product Hunt bug: the trace showed
    // it firing BEFORE our mocked 500 arrived. Record it as a finding, don't blame search.
    const known = pageErrors.filter((m) => KNOWN_SITE_ERRORS.test(m));
    const unexpected = pageErrors.filter((m) => !KNOWN_SITE_ERRORS.test(m));
    if (known.length) {
      testInfo.annotations.push({ type: 'site finding', description: `React hydration error seen ${known.length}x (pre-existing, not caused by search)` });
    }
    expect(unexpected, 'uncaught JavaScript errors caused by the failing search').toEqual([]);
  });
});
