// @ts-check
// Accessibility scans with axe-core (WCAG 2.1 A + AA).
//
// The live site already has known violations (see test-data/a11y-baseline.json),
// so "zero violations" would fail forever and get ignored. Instead this is a
// regression gate: it fails only when a NEW serious/critical rule shows up.
const { test, expect } = require('../../fixtures');
const baseline = require('../../test-data/a11y-baseline.json');

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'category page', path: '/categories/productivity' },
  { name: 'search results', path: '/search?q=notion' },
];

test.describe('Accessibility', { tag: ['@regression', '@a11y'] }, () => {
  for (const { name, path } of PAGES) {
    test(`${name} has no new serious or critical violations`, async ({ page, makeAxeBuilder }, testInfo) => {
      await page.goto(path);
      await page.getByRole('main').waitFor();

      const { violations } = await makeAxeBuilder().analyze();

      // Full details go into the HTML report for anyone who wants to fix them.
      await testInfo.attach('axe-violations.json', {
        body: JSON.stringify(violations, null, 2),
        contentType: 'application/json',
      });

      const known = new Set(baseline[name] ?? []);
      const severe = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      const newOnes = severe.filter((v) => !known.has(v.id));
      const fixed = [...known].filter((id) => !violations.some((v) => v.id === id));

      testInfo.annotations.push({
        type: 'a11y',
        description: `${severe.length} serious/critical rules (${severe.length - newOnes.length} known, ${newOnes.length} new)`,
      });
      if (fixed.length) {
        testInfo.annotations.push({ type: 'a11y fixed, remove from baseline', description: fixed.join(', ') });
      }

      expect(
        newOnes.map((v) => `${v.impact}: ${v.id} on ${v.nodes.length} element(s). ${v.help}`),
        'new accessibility violations (not in test-data/a11y-baseline.json)'
      ).toEqual([]);
    });
  }
});
