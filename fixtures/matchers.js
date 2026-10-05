// @ts-check
// Custom expect matchers. Usage in any spec:
//   expect(body).toMatchSchema(postsSchema);
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// allErrors: report every mismatch, not just the first one.
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // enables "format": "date-time", "uri", etc.
const compiled = new Map();
const matchers = {
  /**
   * @param {unknown} received
   * @param {object & { $id?: string }} schema
   */
  toMatchSchema(received, schema) {
    let validate = compiled.get(schema);
    if (!validate) {
      validate = ajv.compile(schema);
      compiled.set(schema, validate);
    }

    const pass = /** @type {boolean} */ (validate(received));
    const name = schema.$id ?? 'schema';
    const message = pass
      ? () => `Expected value NOT to match "${name}", but it did.`
      : () =>
          `Response does not match "${name}":\n` +
          (validate.errors ?? [])
            .map((e) => `  - ${e.instancePath || '(root)'} ${e.message}${e.params ? ` ${JSON.stringify(e.params)}` : ''}`)
            .join('\n');
    return { pass, message, name: 'toMatchSchema' };
  },
};

module.exports = { matchers };
