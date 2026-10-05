// @ts-check
const {
  test,
  expect
} = require('../../fixtures');
const {
  POSTS_QUERY
} = require('../../graphql/queries');
const postsSchema = require('../../schemas/posts.schema.json');

test('posts(first:N) returns exactly N posts with expected shape', { tag: ['@smoke'] }, async ({
  gql
}) => {
  const {
    status,
    body
  } = await gql(POSTS_QUERY, {
    first: 5
  });

  expect(status).toBe(200);
  expect(body.errors).toBeUndefined();
  // One line checks every field's type, required fields and no unexpected fields.
  expect(body).toMatchSchema(postsSchema);

  // The schema can't know how many we asked for, so this stays an explicit check.
  expect(body.data.posts.edges).toHaveLength(5);
});
