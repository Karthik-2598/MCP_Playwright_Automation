# AI-assisted exploration with Playwright MCP

Playwright MCP lets an AI assistant drive a real browser through tools (`browser_navigate`,
`browser_snapshot`, `browser_click`, ...). It reads the page's **accessibility tree**, not
pixels, so the locators it proposes are role- and name-based by nature.

In this repo MCP is a **research assistant, not the author**. The AI explores and drafts;
a human reviews, fixes and owns every line that gets committed. Each session is logged in
this folder so the process is visible, including what the AI got wrong.

## Workflow

```
 prompt (prompts/explore-feature.md)
   │
   ▼
 Phase 1  AI explores the live site through MCP  ──►  journey, locators, GraphQL ops
   │
   ▼
 Phase 2  AI proposes test ideas  ──►  human picks one
   │
   ▼
 Phase 3  AI drafts page object + spec
   │
   ▼
 Human review (checklist below) ──► fix ──► run ──► break it once ──► commit
   │
   ▼
 Session log in docs/mcp-sessions/ (copy TEMPLATE.md)
```

## Review checklist for AI-drafted tests

Tick every box before committing. Each one maps to a real mistake in this project's history.

- [ ] Imports `test`/`expect` from `fixtures/`, not `@playwright/test`
- [ ] Navigates through a page object (`BasePage.goto`), never `page.goto` in the spec
- [ ] No CSS-class or XPath locators; every locator was actually seen in a snapshot
- [ ] Locator is specific enough (no strict-mode violation, e.g. `level: 1` for page titles)
- [ ] Locators and actions are in `pages/`, assertions are in the spec
- [ ] No `waitForTimeout`; waits are web-first assertions
- [ ] Asserts behavior, not today's live data (no exact names, counts, votes)
- [ ] Cannot pass for the wrong reason (text already on the page, too-loose URL regex)
- [ ] Tagged (`@smoke` / `@regression` + extras)
- [ ] Passes locally, then fails when the expected value is deliberately broken

## Sessions

| Date | Feature | Outcome | Log |
|---|---|---|---|
| | | | |
