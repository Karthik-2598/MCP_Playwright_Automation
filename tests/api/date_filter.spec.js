// @ts-check
const {
  test,
  expect
} = require('../../fixtures');
const {
  POSTS_QUERY
} = require('../../graphql/queries');

test('a narrower postedAfter window returns a smaller totalCount than a wide one', { tag: ['@regression'] }, async ({
  gql
}) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const narrow = await gql(POSTS_QUERY, {
    first: 1,
    postedAfter: oneWeekAgo
  });
  const wide = await gql(POSTS_QUERY, {
    first: 1,
    postedAfter: '2013-01-01T00:00:00Z'
  });

  expect(narrow.body.errors).toBeUndefined();
  expect(wide.body.errors).toBeUndefined();

  const narrowCount = narrow.body.data.posts.totalCount;
  const wideCount = wide.body.data.posts.totalCount;

  expect(narrowCount).toBeGreaterThan(0);
  expect(wideCount).toBeGreaterThan(narrowCount);
});
