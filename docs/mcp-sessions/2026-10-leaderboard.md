# MCP session: <feature>

- **Date:**
- **Client:** Claude Desktop / Claude Code / VS Code
- **Prompt:** prompts/explore-feature.md (paste any changes you made)

## Phase 1: what the AI found

- Journey:
1. Open /. A cookie banner appears at the bottom ("No thanks" / "Accept all cookies"). It doesn't block clicks.
2. Click Launches in the sidebar. This opens /leaderboard/daily/2026/10/6, the Featured view.

3. The page shows the heading "Best of Product Hunt | 2026-10-06" and a ranked list of 17 products. Each row has a thumbnail, a "N. Name" link, a tagline, topic links, a comment button and a vote button.
 
4. Click All. The URL becomes /leaderboard/daily/2026/10/6/all and the list reloads client-side.
Click Weekly. The URL becomes /leaderboard/weekly/2026/41/all, so the All/Featured choice carries over. The heading changes to a week range and the date input turns into a year combobox.
Click Daily, then type 2026-10-05 into the date box in the heading. The URL changes to /2026/10/5/all and the title changes to "October 5, 2026".

- Locators it proposed: Sidebar Launches link, Page heading, Date input, Daily tab, Weekly/Monthly/Yearly, Featured filter, Vote button, Future-date message.

- GraphQL operations seen:
LeaderboardDailyPage: the main one. The Featured view sends {featured:true, year, month, day, order:"DAILY_RANK", cursor:null}. The All view sends {featured:false, ..., order:"VOTES"}. The response is data.homefeedItems.edges[].node plus pageInfo {endCursor, hasNextPage}.
The homepage also fired HeaderDesktopProductsNavigationQuery, DismissableContent and SpotlightPlaceholderQuery, plus three POSTs with no operationName in the URL. I couldn't read those (timed out).
- Surprises:
The response contains GhostAd nodes mixed in with the posts, but they don't render as rows. A mock needs to handle that union type.
Every row has an img "Promoted", because every post in the response has promotedPillImageUrl set. So you can't use it to tell promoted rows from normal ones.

## Phase 2: test ideas it proposed

1.Launches opens today's daily leaderboard (@smoke, live data)
Click Launches from the homepage. Check that the URL matches /leaderboard/daily/YYYY/M/D, the leaderboard-title heading is visible and contains "Best of Product Hunt", the date input value matches the date in the URL, and at least one product link shows up. I'd read the date from the URL instead of computing "today", because PH runs on Pacific time and you're on IST, so "today" can differ by a day.

2.
Period tabs and the Featured/All filter change the view (@regression, @data-driven, live data)
For each of Daily, Weekly, Monthly and Yearly, click the tab and check that the URL has the right segment and the heading is still visible. Then click All and check that the URL ends in /all and switching period keeps /all. The rows go in test-data/leaderboardTabs.js. This only checks structure, nothing about which products show up.

3.Picking a past date loads that day (@regression, live data)
Fill a fixed past date (something old, like 2025-01-15) into the date input. Check that the URL becomes /2025/1/15, the input keeps the value, and the list has products. To make sure it doesn't pass for the wrong reason, first assert that the URL was not already that date.

4.A future date shows the empty state (@regression, @negative, live but effectively stable)
Open a date about a year ahead through BasePage.goto(). Check that /look into the future/ is visible and no product links render. I'd use a regex and skip the "N days" number, since that changes daily.

**Picked:** # because ...

## Phase 3: the draft, and what I changed in review

AI explored at a narrow width and said "no header menu"	Caught in review: re-explored at 1280×720, and Launches was a header dropdown
Locator 'Launch archive Most-loved'	Fixed: /^Launch archive/i, so it no longer depends on marketing copy
Date format depends on the browser locale	Fixed: locale: 'en-US' in config
Hover menu might be flaky	Checked: --repeat-each=5, 5/5 passed
Site observations	Unnamed vote buttons (a11y gap), "All" not sorted by votes (unverified)
## Result

- Files committed:
- Local run: pass / fail
- Broke it on purpose: did it go red? yes / no
- What I would tell the AI next time (add to AGENTS.md if it is general):
