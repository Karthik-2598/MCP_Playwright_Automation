You have the Playwright MCP browser tools. Read AGENTS.md in my project folder
(C:\Users\hp\OneDrive\Desktop\Spare_assignment\playwright-mcp-qa-framework) first and follow it.

Feature to explore: the daily leaderboard, reached from the header's "Launches" menu
Start URL: https://www.producthunt.com/

Work in three phases and stop after each one so I can review.

Phase 1: Explore (no code yet).
Use the browser to find the feature and use it like a real user. Then report:
- the user journey, step by step;
- the stable locators for each element you used (role + accessible name, or data-test
  value), checked with browser_generate_locator where possible;
- any frontend GraphQL operation names you saw (/frontend/graphql?operationName=...);
- what is live data (changes daily) versus fixed structure;
- anything surprising: popups, slow loads, errors in the console.

Phase 2: Propose (still no code).
List 3 to 5 test ideas: the user-visible behavior each one checks, its tag, and whether it
needs live data or a mocked response. Mark which one you would write first and why.

Phase 3: Draft (after I pick an idea).
Write a page object in pages/ and a spec in tests/e2e/, following AGENTS.md exactly.
Do not invent locators you have not seen in the snapshot. Then list anything you were unsure about.