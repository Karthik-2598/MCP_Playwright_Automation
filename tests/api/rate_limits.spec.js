// @ts-check
const {
  test,
  expect
} = require('../../fixtures');
const {
  POSTS_QUERY
} = require('../../graphql/queries');

test('rate-limit headers are present and remaining quota decreases across calls', { tag: ['@regression'] }, async ({
  gql
}) => {
  const first = await gql(POSTS_QUERY, {
    first: 1
  });

  const limit = Number(first.headers['x-rate-limit-limit']);
  const remaining1 = Number(first.headers['x-rate-limit-remaining']);
  const reset = first.headers['x-rate-limit-reset'];

  expect(limit).toBeGreaterThan(0);
  expect(remaining1).toBeLessThanOrEqual(limit);
  expect(reset).toBeDefined();

  const second = await gql(POSTS_QUERY, {
    first: 1
  });
  const remaining2 = Number(second.headers['x-rate-limit-remaining']);

  expect(remaining2).toBeLessThan(remaining1);
});
