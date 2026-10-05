// @ts-check
// Network mocking for Product Hunt's frontend GraphQL API.
//
// The site sends every client-side query to /frontend/graphql, either as
//   GET  /frontend/graphql?operationName=SpotlightSearchQuery&variables=...
//   POST /frontend/graphql   { "operationName": "...", ... }
// so "mock the search API" really means "mock one operationName, let everything else through".

const FRONTEND_GRAPHQL = /\/frontend\/graphql/;

/** @param {import('@playwright/test').Request} request */
function operationNameOf(request) {
  const fromUrl = new URL(request.url()).searchParams.get('operationName');
  if (fromUrl) return fromUrl;
  try {
    return request.postDataJSON()?.operationName ?? null;
  } catch {
    return null;
  }
}

/** @param {import('@playwright/test').Request} request */
function variablesOf(request) {
  try {
    const fromUrl = new URL(request.url()).searchParams.get('variables');
    if (fromUrl) return JSON.parse(fromUrl);
    return request.postDataJSON()?.variables ?? {};
  } catch {
    return {};
  }
}

/**
 * Intercept one GraphQL operation.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} operationName e.g. 'SpotlightSearchQuery'
 * @param {(ctx: { route: import('@playwright/test').Route, variables: any }) => Promise<void>} handler
 *        Decide what to do: route.fulfill(...), route.abort(), or route.fetch() then modify.
 * @returns a getter for how many times the operation was intercepted
 */
async function mockGraphQLOperation(page, operationName, handler) {
  let calls = 0;
  await page.route(FRONTEND_GRAPHQL, async (route) => {
    if (operationNameOf(route.request()) !== operationName) {
      return route.fallback(); // not ours: pass to other handlers / the network
    }
    calls++;
    await handler({ route, variables: variablesOf(route.request()) });
  });
  return () => calls;
}

/** Shorthand: answer an operation with a fixed JSON body. */
const respondWith = (/** @type {object} */ body, status = 200) =>
  /** @param {{ route: import('@playwright/test').Route }} ctx */
  ({ route }) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

module.exports = { mockGraphQLOperation, respondWith, operationNameOf };
