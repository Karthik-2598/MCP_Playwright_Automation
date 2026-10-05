// @ts-check
const { SpotlightSearch } = require('./SpotlightSearch');
//this appears in every test file, so we put it as a shared fixture component.
class Header {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.navLinks = page
      .getByRole('banner')
      .getByRole('link')
      .or(page.locator('header').getByRole('link'));

    // A component inside a component: the header owns the search modal.
    // (The old searchInput, `input:not([readonly])`, matched the newsletter email box.)
    this.spotlight = new SpotlightSearch(page);
  }

  /** Open search, type, press Enter. Lands on /search?q=<term>. @param {string} term */
  async search(term) {
    await this.spotlight.open();
    await this.spotlight.submit(term);
  }

  /** Internal (same-site) hrefs from the header, de-duplicated. */
  async internalNavHrefs() {
    const hrefs = await this.navLinks.evaluateAll((els) =>
      els.map((el) => el.getAttribute('href')).filter((href) => href && href.startsWith('/'))
    );
    return [...new Set(hrefs)];
  }
}

module.exports = {
  Header
};
