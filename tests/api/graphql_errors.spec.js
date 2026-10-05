// @ts-check
// Negative tests: what happens when the client sends something wrong.
// A good API rejects bad input with a clear 4xx-style error, never a 500,
// and never leaks internals (stack traces, file paths, DB errors).
const { test, expect } = require('../../fixtures');
const { POSTS_QUERY, VIEWER_ID_QUERY } = require('../../graphql/queries');
const errorSchema = require('../../schemas/graphql-error.schema.json');

const LEAK_PATTERN = /\.rb:\d+|backtrace|traceback|sql syntax|pg::|postgres/i;

test.describe('GraphQL error handling', { tag: ['@regression', '@negative'] }, () => {
  test('a syntactically broken query returns a GraphQL error, not a 500', async ({ gql }) => {
    const { status, body } = await gql('query { posts(first: 1) { edges { node { id }');

    expect(status).toBeLessThan(500);
    expect(body).toMatchSchema(errorSchema);
    expect(JSON.stringify(body)).not.toMatch(LEAK_PATTERN);
  });

  test('querying a field that does not exist names the bad field in the error', async ({ gql }) => {
    const { status, body } = await gql(
      'query { posts(first: 1) { edges { node { id thisFieldDoesNotExist } } } }'
    );

    expect(status).toBeLessThan(500);
    expect(body).toMatchSchema(errorSchema);
    expect(body.errors[0].message).toMatch(/thisFieldDoesNotExist/);
  });

  test('a variable of the wrong type is rejected', async ({ gql }) => {
    const { status, body } = await gql(POSTS_QUERY, { first: 'five' });

    expect(status).toBeLessThan(500);
    expect(body).toMatchSchema(errorSchema);
    expect(body.errors[0].message).toMatch(/first|Int/i);
  });

  test('a malformed pagination cursor fails gracefully', async ({ gql }) => {
    const { status, body } = await gql(POSTS_QUERY, { first: 1, after: 'not-a-real-cursor' });

    // Either answer is acceptable: an error, or an empty/valid page. A crash is not.
    expect(status).toBeLessThan(500);
    expect(JSON.stringify(body)).not.toMatch(LEAK_PATTERN);
  });

  test('a request with no Authorization header is rejected', async ({ playwright }) => {
    // (The first version of this test fell into exactly that trap; the trace showed it.)
    // Passing an empty extraHTTPHeaders object is what actually strips the token.
    const baseURL = test.info().project.use.baseURL;
    const anonymous = await playwright.request.newContext({ baseURL, extraHTTPHeaders: {} });

    try {
      const res = await anonymous.post('/v2/api/graphql', { data: { query: VIEWER_ID_QUERY } });
      const body = await res.json();

      // The security property: no private data without credentials.
      expect(body?.data?.viewer?.user ?? null, 'viewer data must not leak without a token').toBeNull();
      // The contract: missing credentials are rejected the same way as invalid ones.
      expect(res.status()).toBe(401);
      expect(body).toMatchSchema(errorSchema);
    } finally {
      await anonymous.dispose(); // contexts you create yourself, you clean up yourself
    }
  });
});
