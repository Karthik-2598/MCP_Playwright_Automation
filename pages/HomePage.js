// @ts-check
const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.productCards = page.locator('a[href*="/products/"]');
    this.upvoteButton = page
      .getByRole('button', { name: /^upvote/i })
      .or(page.getByText(/^upvote\(/i))
      .first();

    this.signInPrompts = page.getByText(/sign in/i);
    this.authGate = page
      .getByRole('dialog')
      .or(page.getByRole('heading', { name: /sign in/i }))
      .first();
  }

  async open() {
    await this.goto('/');
  }

  async openFirstProduct() {
    await this.productCards.first().click();
  }

  async clickFirstUpvote() {
    await this.upvoteButton.click();
  }
}

module.exports = { HomePage };
