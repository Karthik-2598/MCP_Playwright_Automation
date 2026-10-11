// @ts-check
const base = require('@playwright/test');
const GRAPHQL_PATH = '/v2/api/graphql';

/**
 * @typedef {{ status: number, headers: Record<string, string>, body: any }} GqlResponse
 * @typedef {(query: string, variables?: Record<string, unknown>, opts?: { token?: string }) => Promise<GqlResponse>} Gql
 */

const test = base.test.extend({
  gql: async ({ request }, use) => {
    if (!process.env.PH_DEV_TOKEN) {
      throw new Error('PH_DEV_TOKEN is not set. Copy .env.example to .env and add your Product Hunt developer token.');
    }

    /** @type {Gql} */
    const gql = async (query, variables = {}, opts = {}) => {
      const res = await request.post(GRAPHQL_PATH, {
        data: {
          query,
          variables,
        },
        headers: opts.token
          ? {
              Authorization: `Bearer ${opts.token}`,
            }
          : {},
      });
      const raw = await res.text();
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new Error(
          `Expected JSON from ${GRAPHQL_PATH} but got status ${res.status()}. First 300 chars:\n${raw.slice(0, 300)}`,
        );
      }
      return {
        status: res.status(),
        headers: res.headers(),
        body,
      };
    };
    await use(gql); // the test runs here
  },
});

module.exports = {
  test,
  expect: base.expect,
};
