// @ts-check
const { test, expect } = require('../../fixtures');
const { VIEWER_ID_QUERY } = require('../../graphql/queries');
const viewerSchema = require('../../schemas/viewer.schema.json');
const errorSchema = require('../../schemas/graphql-error.schema.json');

test('a developer token can read viewer-scoped (private) data', { tag: ['@smoke'] }, async ({ gql }) => {
  const { status, body } = await gql(VIEWER_ID_QUERY);

  expect(status).toBe(200);
  expect(body).toMatchSchema(viewerSchema);
});

test('an invalid token is rejected with a generic, non-leaking error', { tag: ['@regression', '@negative'] }, async ({ gql }) => {
  const { status, body } = await gql(VIEWER_ID_QUERY, {}, { token: 'this-is-not-a-real-token' });

  expect(status).toBe(401);
  expect(body).toMatchSchema(errorSchema);
  expect(body.data).toBeNull();
  expect(body.errors?.[0]?.error).toBe('invalid_oauth_token');

  const raw = JSON.stringify(body);
  expect(raw).not.toMatch(/\.rb:\d+/);
  expect(raw).not.toMatch(/traceback|backtrace/i);
});
