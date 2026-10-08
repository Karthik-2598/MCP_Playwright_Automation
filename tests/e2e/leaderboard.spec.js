// @ts-check
const { test, expect } = require('../../fixtures');
const { LeaderboardPage } = require('../../pages/LeaderboardPage');

/**
 * "October 8, 2026", the format the leaderboard heading uses at desktop width.
 * Built in UTC so the runner's own time zone can't shift the day.
 * @param {{ year: number, month: number, day: number }} date
 */
const headingDate = ({ year, month, day }) =>
  new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

test.describe('Daily leaderboard', () => {
  test('Launches menu opens the daily leaderboard for the date in the URL', { tag: ['@smoke'] }, async ({ page, homePage, leaderboardPage }) => {
    await homePage.open();

    // Guard against passing for the wrong reason: the leaderboard heading must not
    // already be on the homepage before we use the menu.
    await expect(leaderboardPage.title).toBeHidden();

    await homePage.header.openLaunchArchive();

    await expect(page).toHaveURL(LeaderboardPage.DAILY_PATH);

    // Expected date comes from the URL, not from "today": PH runs on Pacific time,
    // so its "today" can differ from the runner's.
    const date = leaderboardPage.dateFromUrl();
    expect(date, 'URL should contain /leaderboard/daily/YYYY/M/D').not.toBeNull();
    if (!date) return; // narrows the type for // @ts-check

    await expect(leaderboardPage.title).toContainText('Best of Product Hunt');
    await expect(leaderboardPage.title).toContainText(headingDate(date));

    // Structure only: the period tabs and filters are there and the list has products.
    for (const tab of /** @type {const} */ (['Daily', 'Weekly', 'Monthly', 'Yearly'])) {
      await expect(leaderboardPage.periodTab(tab)).toBeVisible();
    }
    await expect(leaderboardPage.featuredFilter).toBeVisible();
    await expect(leaderboardPage.allFilter).toBeVisible();
    await expect(leaderboardPage.productLinks.first()).toBeVisible();
  });
});
