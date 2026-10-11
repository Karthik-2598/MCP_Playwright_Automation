# Leaderboard test plan

**Seed:** `tests/e2e/seed.spec.js`
**Locators (from snapshots):** tabs and filters are links: `link "Daily"`, `link "Weekly"`,
`link "Monthly"`, `link "Yearly"`, `link "Featured"`, `link "All"`.
Heading: `getByTestId('leaderboard-title')` (h1). No active-state attribute on tabs/filters.
Start every scenario with `leaderboardPage.openDaily(2026, 10, 8)`, a fixed past day.

## 1.2 Period tabs
**File:** `tests/e2e/leaderboard-tabs.spec.js`
1. Click Weekly.
   - URL matches `/\/leaderboard\/weekly\/\d{4}\/\d{1,2}$/`
   - h1 matches `/Best of Product Hunt \| Week of \w+ \d{1,2}, \d{4}/`
   - Record in a comment: is it the week of Oct 8, 2026 or the current week?
2. Click Monthly.
   - URL matches `/\/leaderboard\/monthly\/\d{4}\/\d{1,2}$/`
   - h1 matches `/Best of Product Hunt \| \w+ \d{4}$/`
3. Click Yearly.
   - URL matches `/\/leaderboard\/yearly\/\d{4}$/`
   - h1 matches `/Best of Product Hunt \| \d{4}$/`
4. Click Daily.
   - URL matches `/\/leaderboard\/daily\/\d{4}\/\d{1,2}\/\d{1,2}$/`

## 1.3 Featured and All filters
**File:** `tests/e2e/leaderboard-filters.spec.js`
1. Click All.
   - URL ends with `/leaderboard/daily/2026/10/8/all`
   - At least one product link (`/^\d+\. /`) is visible
2. Click Featured.
   - URL ends with `/leaderboard/daily/2026/10/8` (no `/all`)
   - At least one product link is visible

## 1.4 Past and future dates
**File:** `tests/e2e/leaderboard-date-navigation.spec.js`
1. Past: `openDaily(2026, 10, 8)`.
   - h1 contains `October 8, 2026`
   - At least one product link is visible
2. Future: `openDaily` with today + 1 year (computed in the test).
   - Text matches `/look into the future/` and `/Come back in \d+ days/`
   - No product links are shown (count 0)
   - Tag `@negative`