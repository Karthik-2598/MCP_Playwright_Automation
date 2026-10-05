// @ts-check
const { test, expect } = require('../../fixtures');

test('primary header navigation links resolve without error', { tag: ['@regression'] }, async ({ homePage, request }) => {
  await homePage.open();

  const hrefs = await homePage.header.internalNavHrefs();
  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs.slice(0, 6)) {
    const response = await request.get(href);
    expect(response.status(), `expected ${href} to resolve`).toBeLessThan(400);
  }
});
