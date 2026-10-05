// @ts-check
const { test, expect } = require('../../fixtures');

test('an anonymous user who tries to upvote hits a sign-in gate', { tag: ['@regression'] }, async ({ homePage }) => {
  await homePage.open();

  // Same locator before and after. The old version used /sign in /i (trailing space)
  // before and /sign in/i after, so the count could "increase" without any gate.
  const signInCountBefore = await homePage.signInPrompts.count();

  await homePage.clickFirstUpvote();

  await expect(async () => {
    const gateVisible = await homePage.authGate.isVisible().catch(() => false);
    const signInCountAfter = await homePage.signInPrompts.count();
    expect(gateVisible || signInCountAfter > signInCountBefore).toBe(true);
  }).toPass({ timeout: 10_000 });
});
