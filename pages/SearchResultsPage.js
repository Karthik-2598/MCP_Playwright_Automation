// @ts-check
const { BasePage } = require('./BasePage');

/** The full results page at /search?q=<term>. */
class SearchResultsPage extends BasePage {
  static URL_PATTERN = /\/search\?q=/;

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // Same data-test ids as the spotlight modal, but rendered inside <main>.
    this.productResults = this.main.locator('[data-test^="spotlight-result-product-"]');
  }

  /** @param {string} term */
  async open(term) {
    return this.goto(`/search?q=${encodeURIComponent(term)}`);
  }

  /** Product results whose text mentions the term. @param {string} term */
  productResultsMatching(term) {
    return this.productResults.filter({ hasText: new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
  }
}

module.exports = { SearchResultsPage };
