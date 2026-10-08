// @ts-check
const { BasePage } = require('./BasePage');

// /leaderboard/daily/2026/10/8, optionally followed by /all, ?ref=... or #...
// Month and day have no leading zero in PH's URLs.
const DAILY_PATH = /\/leaderboard\/daily\/(\d{4})\/(\d{1,2})\/(\d{1,2})(?:[/?#]|$)/;

class LeaderboardPage extends BasePage {
  static DAILY_PATH = DAILY_PATH;

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // h1 "Best of Product Hunt | October 8, 2026" (data-test="leaderboard-title").
    // At 1280px the date part is plain text; on narrower screens it is a date textbox.
    this.title = page.getByTestId('leaderboard-title');

    // Product rows link their name as "1. Name", "2. Name", ...
    // The day-picker links are bare numbers ("1", "2") and the year links are "2025",
    // so the "<number>. " prefix keeps them out.
    this.productLinks = this.main.getByRole('link', { name: /^\d+\. / });

    this.featuredFilter = this.main.getByRole('link', { name: 'Featured', exact: true });
    this.allFilter = this.main.getByRole('link', { name: 'All', exact: true });
  }

  /**
   * Daily / Weekly / Monthly / Yearly tab.
   * exact: true matters: a product called "DailyHelm" would match "Daily" otherwise.
   * @param {'Daily' | 'Weekly' | 'Monthly' | 'Yearly'} name
   */
  periodTab(name) {
    return this.main.getByRole('link', { name, exact: true });
  }

  /**
   * Open a specific day's daily leaderboard.
   * @param {number} year @param {number} month 1-12 @param {number} day
   */
  async openDaily(year, month, day) {
    return this.goto(`/leaderboard/daily/${year}/${month}/${day}`);
  }

  /**
   * The date this daily leaderboard is showing, read from the current URL.
   * Returns null when the page is not a daily leaderboard.
   */
  dateFromUrl() {
    const match = DAILY_PATH.exec(new URL(this.page.url()).pathname);
    if (!match) return null;
    const [, year, month, day] = match.map(Number);
    return { year, month, day };
  }
}

module.exports = { LeaderboardPage };
