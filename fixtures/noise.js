// @ts-check
// Handles the "noise" on a live site: ad/analytics scripts and surprise popups.

// Third-party hosts that add load time but nothing we test.
// Never add challenges.cloudflare.com here: blocking it breaks the bot check
// and every test fails.
const BLOCKED_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'adservice.google.com',
  'facebook.net',
  'connect.facebook.net',
  'hotjar.com',
  'segment.io',
  'segment.com',
  'intercom.io',
  'intercomcdn.com',
  'amplitude.com',
  'mixpanel.com',
  'clarity.ms',
  'ads-twitter.com',
  'snap.licdn.com',
  'scorecardresearch.com',
  'quantserve.com',
];

// Product Hunt proxies its own telemetry through first-party paths, so a host
// blocklist alone catches nothing there (verified by watching the live network tab).
// NEVER add /cdn-cgi/challenge-platform: that is Cloudflare's bot check.
const BLOCKED_FIRST_PARTY_PATHS = [
  '/sentry-tunnel', // error reporting
  '/cdn-cgi/rum', // Cloudflare real-user-monitoring beacon
];

/** @param {URL} url */
const isBlockedHost = (url) =>
  BLOCKED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ||
  BLOCKED_FIRST_PARTY_PATHS.some((path) => url.pathname.startsWith(path));

/**
 * Aborts requests to known ad/analytics hosts and first-party telemetry paths.
 * Returns a getter for how many requests were blocked, so the fixture can report it.
 * @param {import('@playwright/test').Page} page
 */
async function blockThirdParty(page) {
  let blocked = 0;
  await page.route(isBlockedHost, (route) => {
    blocked++;
    return route.abort();
  });

  // Opt-in: also drop images, fonts and media. Faster, but a test that checks
  // visuals would break, so it stays off by default.
  if (process.env.BLOCK_MEDIA === 'true') {
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (type === 'image' || type === 'font' || type === 'media') {
        blocked++;
        return route.abort();
      }
      return route.fallback();
    });
  }

  return () => blocked;
}

/**
 * Popups that can appear at any moment and cover what we want to click.
 * addLocatorHandler checks for these before every action and clears them,
 * so no test needs "if banner visible then close" code.
 * @param {import('@playwright/test').Page} page
 */
async function registerPopupHandlers(page) {
  // The live banner offers "No thanks" and "Accept all cookies". Decline: it is the
  // privacy-friendly choice and keeps analytics cookies out of test runs.
  // Anchored regex so we never click a real button that merely contains these words.
  const cookieConsent = page.getByRole('button', {
    name: /^(no thanks|reject all|decline)$/i,
  });
  await page.addLocatorHandler(cookieConsent, async (button) => {
    await button.click();
  });
}

module.exports = { blockThirdParty, registerPopupHandlers, BLOCKED_HOSTS, BLOCKED_FIRST_PARTY_PATHS };
