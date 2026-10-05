// @ts-check
const {
  Header
} = require('./components/Header');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new Header(page);
    this.main = page.getByRole('main');
    this.mainLinks = this.main.getByRole('link');
  }

  /**
   * @param {string} path relative to baseURL
   * @returns the navigation response, so tests can check status codes (e.g. 404)
   */
  async goto(path) {
    return this.page.goto(path);
  }
}

module.exports = {
  BasePage
};
