# Guide for AI agents working on this repo

This file tells AI coding agents (Claude, Copilot, Cursor, Playwright MCP sessions) how this
framework is built, so generated tests fit it instead of fighting it. Humans: this is also
the shortest description of the conventions.

## What is under test

- **E2E:** https://www.producthunt.com (live site, Next.js, behind Cloudflare)
- **API:** Product Hunt GraphQL API v2 at `https://api.producthunt.com/v2/api/graphql`
- Product Hunt's own frontend calls `/frontend/graphql` (persisted queries, `operationName` in the URL).

## Hard rules

1. **Import `test` and `expect` from `fixtures/`**, never from `@playwright/test` directly:
   `const { test, expect } = require('../../fixtures');`
2. **Navigate only through page objects** (`homePage.open()`, `topicPage.open(slug)`, or
   `new BasePage(page).goto(path)`). Never call `page.goto()` in a spec: `BasePage.goto()`
   skips the test when Cloudflare serves its bot challenge.
3. **Never try to bypass, solve or evade Cloudflare** or any other bot protection.
4. **Locators, in order of preference:** `getByRole` with a name → `getByTestId` (the site
   uses `data-test`, already configured) → `getByText` / `getByLabel`. No CSS class
   selectors (they are generated hashes and change every deploy), no XPath, no `nth()`
   unless the order itself is what is being tested.
5. **Locators and actions live in page objects** (`pages/`). Shared UI (header, search
   modal) is a component in `pages/components/`. **Assertions live in specs**, not page objects.
6. **No hard waits** (`waitForTimeout`). Use web-first assertions (`await expect(locator)...`)
   that retry. The one documented exception is in `search_mocked.spec.js`.
7. **Tag every test:** `@smoke` (critical path, fast) or `@regression`, plus `@negative`,
   `@mock`, `@a11y`, `@data-driven` where they apply:
   `test('title', { tag: ['@regression'] }, async ({ homePage }) => { ... })`
8. **Live data changes daily.** Assert structure and behavior (a heading exists, results
   mention the search term), never exact product names, counts or vote numbers.
9. **Plain JavaScript (CommonJS), not TypeScript.** Add `// @ts-check` at the top of files.
10. **Explore at the test viewport.** Before exploring with MCP, run `browser_resize` to
    1280x720 (the Desktop Chrome project). Product Hunt changes layout at narrower widths:
    the header nav becomes a sidebar and the leaderboard date becomes a textbox.
11. **Don't put marketing copy in locators.** Match the stable start of an accessible name
    (`/^Launch archive/i`), not a subtitle or tagline that can be reworded.

## Where things go

| Need | Put it in |
|---|---|
| New page | `pages/<Name>Page.js` extending `BasePage`, plus a fixture in `fixtures/pages.js` |
| Shared UI piece | `pages/components/` |
| Fake an API response | `mockGraphQL(operationName, handler)` fixture (see `fixtures/network.js`) |
| Mock response bodies | `test-data/mocks/*.json` |
| Rows for data-driven tests | `test-data/*.js` |
| GraphQL query for API tests | `graphql/queries.js` |
| Response contract | `schemas/*.schema.json`, checked with `expect(body).toMatchSchema(schema)` |

## Before calling a test done

- `npx playwright test <file>` passes locally (E2E needs a residential network; GitHub
  runners get the Cloudflare challenge and skip).
- It fails when it should: break the expected value once and confirm it goes red.
- It does not pass for the wrong reason (for example, matching text that was already on the
  page before the action under test).
