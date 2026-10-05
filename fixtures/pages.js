// @ts-check
const base = require('@playwright/test');
const { blockThirdParty, registerPopupHandlers } = require('./noise');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { TopicPage } = require('../pages/TopicPage');
const { SearchResultsPage } = require('../pages/SearchResultsPage');
const { mockGraphQLOperation } = require('./network');
const { default: AxeBuilder } = require('@axe-core/playwright');

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const test = base.test.extend({
  // Override the built-in `page`. Every test that uses a page (directly or through
  // a page object) gets noise handling for free, and API tests never launch a browser.
  page: async ({ page }, use, testInfo) => {
    const enabled = process.env.BLOCK_THIRD_PARTY !== 'false';
    const blockedCount = enabled ? await blockThirdParty(page) : () => 0;
    await registerPopupHandlers(page);

    await use(page); // the test runs here

    // Teardown: record how much noise we removed. Shows up in the HTML report.
    testInfo.annotations.push({
      type: 'blocked third-party requests',
      description: String(blockedCount()),
    });
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  topicPage: async ({ page }, use) => {
    await use(new TopicPage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },

  // mockGraphQL('SpotlightSearchQuery', handler): intercept one frontend GraphQL operation.
  mockGraphQL: async ({ page }, use) => {
    await use((operationName, handler) => mockGraphQLOperation(page, operationName, handler));
  },

  // A fresh, pre-configured axe scanner per call (the pattern from the Playwright docs).
  makeAxeBuilder: async ({ page }, use) => {
    await use(() => new AxeBuilder({ page }).withTags(WCAG_TAGS));
  },
});

module.exports = { test };
