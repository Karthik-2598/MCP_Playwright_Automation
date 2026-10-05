// @ts-check
const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  static URL_PATTERN = /\/products\//;

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.title = page.getByRole('heading').first();
  }
}

module.exports = { ProductPage };
