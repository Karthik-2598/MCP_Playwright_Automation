# Playwright + MCP QA Framework

[![Playwright Tests](https://github.com/Karthik-2598/MCP_Playwright_Automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/Karthik-2598/MCP_Playwright_Automation/actions/workflows/playwright.yml)

**Latest test report:** https://karthik-2598.github.io/MCP_Playwright_Automation/

E2E and GraphQL API test suites for [Product Hunt](https://www.producthunt.com), built with Playwright Test in JavaScript, with MCP-driven test authoring and triage (in progress).

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # then paste your Product Hunt developer token
```

## Running

| Command | What it runs |
|---|---|
| `npm test` | Everything (API + E2E) |
| `npm run test:api` | GraphQL API suite only |
| `npm run test:e2e` | Browser suite only |
| `npm run test:smoke` | Fast critical-path tests (`@smoke`) |
| `npm run test:regression` | Everything else (`@regression`) |
| `npm run test:negative` | Error-path tests only (`@negative`) |
| `npm run test:mock` | E2E tests with a mocked search API (`@mock`) |
| `npm run test:a11y` | Accessibility scans against the baseline (`@a11y`) |
| `npm run report` | Opens the last HTML report |

## Structure

```
fixtures/
  index.js            Single import for all specs (mergeTests of the files below)
  graphql.js          gql() fixture for GraphQL calls
  pages.js            Page-object fixtures + overridden `page` with noise handling
  noise.js            Third-party request blocking and popup auto-dismiss
  matchers.js         Custom expect matchers (toMatchSchema via Ajv)
  network.js          mockGraphQLOperation(): intercept one frontend GraphQL operation , mocking out the test for testing an error state that cant be reproduced.
pages/
  components/Header.js           Shared header (nav + search)
  components/SpotlightSearch.js  Search modal, owned by Header
  BasePage.js           Common page bits; specific pages extend it
  HomePage.js  ProductPage.js  TopicPage.js  SearchResultsPage.js
graphql/queries.js    GraphQL documents shared across tests
prompts/              Reusable prompts for AI-assisted exploration
docs/mcp-sessions/    MCP review checklist and session logs
AGENTS.md             Framework rules for AI agents (CLAUDE.md points here)
schemas/              JSON Schemas for API response contracts
test-data/            Category rows, mock responses, accessibility baseline
tests/api/            API tests (project: api)
tests/e2e/            Browser tests (project: e2e)
```

### Environment flags

| Variable | Default | Effect |
|---|---|---|
| `PH_DEV_TOKEN` | (required for API) | Product Hunt developer token |
| `BLOCK_THIRD_PARTY` | `true` | Abort ad/analytics requests in E2E tests |
| `BLOCK_MEDIA` | `false` | Also abort images, fonts and media (faster, not for visual tests) |

## CI (GitHub Actions)

`.github/workflows/playwright.yml` runs on every push and PR to `main`, nightly at 08:00 IST, and on demand.

```
 api ─────────────┐
 e2e shard 1/2 ───┼──► merge reports ──► HTML report artifact + GitHub Pages
 e2e shard 2/2 ───┘
```

- **API job** runs without installing a browser (it only makes HTTP calls).
- **E2E is sharded** across 2 machines that run in parallel; `fail-fast: false` lets every shard finish.
- Each job writes a **blob** report; the merge job combines them into **one** HTML report, even when tests fail.
- The report is published to **GitHub Pages** for `main`, so the latest results are one link away.
- **Run a subset by hand:** Actions → Playwright Tests → Run workflow → `grep: @smoke`.

**One-time setup:** add the `PH_DEV_TOKEN` repository secret (Settings → Secrets and variables → Actions) and set Settings → Pages → Source to **GitHub Actions**.

## AI-assisted exploration (Playwright MCP)

[Playwright MCP](https://github.com/microsoft/playwright-mcp) lets an AI assistant drive a real browser through tools, reading the page's accessibility tree. Here it is used as a **research assistant**: the AI explores Product Hunt and drafts tests, a human reviews and owns what gets committed.

- **Server config is in the repo:** `.mcp.json` (Claude Code) and `.vscode/mcp.json` (VS Code). Pinned version, Chrome, `--test-id-attribute data-test` to match the site, `--caps testing` for locator and assertion tools.
- **`AGENTS.md`** gives any AI agent the framework's rules (fixtures, page objects, locator priority, tags, never bypass Cloudflare), so drafts fit the codebase.
- **`prompts/explore-feature.md`** is a reusable 3-phase prompt: explore, propose test ideas, draft.
- **`docs/mcp-sessions/`** holds the review checklist and one log per session, including what the AI got wrong and how it was fixed.

## Roadmap

- [x] M1: Single runner. API suite moved from bun:test/TS to Playwright `request` in JS
- [x] M2: Page Objects, custom fixtures, ad/cookie noise handling
- [x] M3: Test depth
  - [x] 3A: Tags, JSON schema contracts, GraphQL negative tests
  - [x] 3B: Network mocking, accessibility, data-driven E2E
- [x] M4: CI with sharding and a published HTML report
- [ ] M5: Playwright MCP for AI-assisted exploration
- [ ] M6: Playwright Test Agents (planner, generator, healer)
- [ ] M7: Custom MCP server to run and triage this suite
- [ ] M8: Docs, architecture diagram, demo
