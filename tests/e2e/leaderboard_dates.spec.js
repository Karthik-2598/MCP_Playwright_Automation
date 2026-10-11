// @ts-check
const { test, expect } = require('../../fixtures');

test.describe('Daily leaderboard dates', () => {
  test('a past day shows its own leaderboard', { tag: ['@regression'] }, async ({ page, leaderboardPage }) => {
    await leaderboardPage.openDaily(2026, 10, 8);

    await expect(page).toHaveURL(/\/leaderboard\/daily\/2026\/10\/8$/);
    await expect(leaderboardPage.title).toContainText('October 8, 2026');
    await expect(leaderboardPage.productLinks.first()).toBeVisible();
  });

  test('a future day shows the "come back later" message and no products', { tag: ['@regression', '@negative'] }, async ({ page, leaderboardPage }) => {
    // One year ahead: far enough that PH's Pacific-time "today" can never catch up with it.
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const [year, month, day] = [future.getFullYear(), future.getMonth() + 1, future.getDate()];

    await leaderboardPage.openDaily(year, month, day);

    // No redirect: the URL keeps the future date.
    await expect(page).toHaveURL(new RegExp(`/leaderboard/daily/${year}/${month}/${day}$`));

    // Wait for the message FIRST. Checking "0 products" before the page has rendered
    // would pass for the wrong reason.
    await expect(leaderboardPage.futureDateMessage).toBeVisible();
    await expect(leaderboardPage.futureDateMessage).toContainText(/Come back in \d+ days/);
    await expect(leaderboardPage.productLinks).toHaveCount(0);
  });
});