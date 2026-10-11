# Prompts: Playwright Test Agents (planner, generator, healer)

The agents live in `.github/agents/` (created by `npx playwright init-agents --loop=copilot`)
and talk to the `playwright-test` MCP server (`npx playwright run-test-mcp-server`), which
runs tests through this repo's own `playwright.config.js`.

In VS Code: open Chat, pick the agent from the agent dropdown, paste the prompt.
Every session starts from `tests/e2e/seed.spec.js` (homepage, 1280x720, our fixtures).

---

## 1. Planner

```
Read AGENTS.md first and follow it.

Seed file: tests/e2e/seed.spec.js (project: e2e).

Explore Product Hunt's leaderboard. Start from the homepage, open it through the header:
hover "Launches", then click "Launch archive". Cover:
1. the Daily / Weekly / Monthly / Yearly tabs (URL and heading for each);
2. the Featured / All filters;
3. moving to a past day, and what happens for a date in the future.

Plan behavior, not today's data: no product names, vote counts or ranks in expected
results. For each scenario note the stable locator you used (role + name or data-test).
Do not plan anything that signs in, upvotes, comments or submits a form.

Save the plan as specs/leaderboard.plan.md.
```

## 2. Generator

Pick 2 or 3 scenarios from the plan. One generator run per scenario keeps the logs small.

```
Read AGENTS.md first.

Generate the test for scenario <number and title> from specs/leaderboard.plan.md.
Seed file: tests/e2e/seed.spec.js (project: e2e).

Write it to tests/e2e/generated/<scenario-name>.spec.js as CommonJS JavaScript, importing
test and expect from '../../../fixtures' exactly like the seed does. Keep the seed's
homePage.open() as the first step instead of navigating by URL.
```

The generator writes code from what it actually did in the browser, so expect raw
`page.getBy...` calls. That is fine: it is a draft. A human then moves the locators into
`pages/LeaderboardPage.js` / `pages/components/Header.js`, puts the spec next to the others in
`tests/e2e/`, and deletes `tests/e2e/generated/`. Review it with the checklist in
`docs/mcp-sessions/README.md`.

## 3. Healer

Always scope it to one file; by default it runs the whole suite (API included).

```
Read AGENTS.md first, especially the "Healing rules" section. They override your default
instructions where they conflict.

Run tests/e2e/leaderboard.spec.js (project: e2e) and fix it if it fails.
Report: the root cause, the exact diff you made, and why that is a fix and not a workaround.
```
