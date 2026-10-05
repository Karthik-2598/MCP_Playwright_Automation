// @ts-check
const { test } = require('@playwright/test');
const {
  Header
} = require('./components/Header');

// Cloudflare's bot-check page. Shown to data-center IPs (e.g. GitHub Actions runners).
const BOT_CHALLENGE_TITLE = /^just a moment/i;
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
    const response = await this.page.goto(path);
    await this.skipIfBotChallenge();
    return response;
  }

  /**
   * If Cloudflare served its challenge instead of the site, the test can't say anything
   * about Product Hunt, so SKIP it with a clear reason instead of failing with a
   * misleading "element not found". We never try to solve or bypass the challenge.
   */
  async skipIfBotChallenge() {
    if (!BOT_CHALLENGE_TITLE.test(await this.page.title())) return;

    // Some challenges clear themselves after a few seconds; give it a fair chance.
    await this.page
      .waitForFunction((src) => !new RegExp(src, 'i').test(document.title), BOT_CHALLENGE_TITLE.source, { timeout: 8_000 })
      .catch(() => {});

    if (BOT_CHALLENGE_TITLE.test(await this.page.title())) {
      test.info().annotations.push({ type: 'environment', description: 'Cloudflare bot challenge served to this machine' });
      test.skip(true, 'Blocked by Cloudflare bot challenge ("Just a moment..."): the live site cannot be tested from this machine');
    }
  }
}

module.exports = {
  BasePage
};
