// @ts-check
// Single import point for every spec:
//   const { test, expect } = require('../../fixtures');
// mergeTests combines independent fixture files into one `test`.
// Fixtures are lazy, so an API test never builds pages and an E2E test never
// checks for PH_DEV_TOKEN.
const {
    mergeTests,
    expect: baseExpect
} = require('@playwright/test');
const {
    test: graphqlTest
} = require('./graphql');
const {
    test: pageTest
} = require('./pages');

const {
    matchers
} = require('./matchers');

const test = mergeTests(graphqlTest, pageTest);

// expect with our custom matchers (toMatchSchema) added on top of Playwright's.
const expect = baseExpect.extend(matchers);

module.exports = {
    test,
    expect
};
