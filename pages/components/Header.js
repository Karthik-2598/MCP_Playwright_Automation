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

    // Desktop main nav (seen at 1280x720). On narrower screens these links move to a
    // left sidebar ("Homepage navigation") and this nav is not rendered.
    this.mainNav = page.getByRole('navigation', { name: 'Main Navigation' });

    // "Launches" is a link that also opens a hover menu.
    // exact: true so it never matches a menu item such as "Launch archive ...".
    this.launchesLink = this.mainNav.getByRole('link', { name: 'Launches', exact: true });

    // Items in the Launches hover menu. Their accessible names include the subtitle
    // ("Launch archive Most-loved launches by the community"), hence the prefix match.
    this.launchArchiveLink = this.mainNav.getByRole('link', { name: 'Launch archive Most-loved' });
    this.launchGuideLink = this.mainNav.getByRole('link', { name: 'Launch Guide Checklists and' });

    // A component inside a component: the header owns the search modal.
    // (The old searchInput, `input:not([readonly])`, matched the newsletter email box.)
    this.spotlight = new SpotlightSearch(page);
  }

  /** Open search, type, press Enter. Lands on /search?q=<term>. @param {string} term */
  async search(term) {
    await this.spotlight.open();
    await this.spotlight.submit(term);
  }

  /** Hover "Launches" so its menu (Launch archive, Launch Guide) opens. */
  async openLaunchesMenu() {
    await this.launchesLink.hover();
  }

  /** Launches menu -> "Launch archive". Lands on today's daily leaderboard. */
  async openLaunchArchive() {
    await this.openLaunchesMenu();
    await this.launchArchiveLink.click();
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
