// @ts-check
const { test, expect } = require('../../fixtures');
const { POSTS_QUERY } = require('../../graphql/queries');

test('a non-existent topic slug returns an empty result set, not an error', { tag: ['@regression', '@negative'] }, async ({ gql }) => {
  const { status, body } = await gql(POSTS_QUERY, {
    first: 5,
    topic: 'this-topic-definitely-does-not-exist-zzz123',
  });

  expect(status).toBe(200);
  expect(body.errors).toBeUndefined();
  expect(body.data.posts.totalCount).toBe(0);
  expect(body.data.posts.edges).toHaveLength(0);
});

test('an injection-style string in a filter argument does not cause a server error', { tag: ['@regression', '@negative'] }, async ({ gql }) => {
  const { status, body } = await gql(POSTS_QUERY, { first: 5, topic: "' OR '1'='1" });

  expect(status).not.toBe(500);
  expect(JSON.stringify(body).toLowerCase()).not.toMatch(/sql syntax|postgres|pg::/);
});
