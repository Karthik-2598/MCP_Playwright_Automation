// @ts-check
const { test, expect } = require('../../fixtures');
const { POSTS_QUERY } = require('../../graphql/queries');

test('consecutive pages return non-overlapping post IDs', { tag: ['@regression'] }, async ({ gql }) => {
  const page1 = await gql(POSTS_QUERY, { first: 5 });
  expect(page1.body.errors).toBeUndefined();

  const cursor = page1.body.data.posts.pageInfo?.endCursor;
  expect(cursor).toBeTruthy();

  const page2 = await gql(POSTS_QUERY, { first: 5, after: cursor });
  expect(page2.body.errors).toBeUndefined();

  const page1Ids = new Set(page1.body.data.posts.edges.map((e) => e.node.id));
  const page2Ids = page2.body.data.posts.edges.map((e) => e.node.id);

  const overlap = page2Ids.filter((id) => page1Ids.has(id));
  expect(overlap).toEqual([]);
});
