// @ts-check
const {
  BasePage
} = require('./BasePage');

class TopicPage extends BasePage {
  /** @param {string} slug e.g. 'productivity' */
  async open(slug) {
    return this.goto(`/categories/${slug}`);
  }

  /** @param {RegExp | string} name */
  heading(name) {
    // level: 1 → only the page title. Without it, /LLMs/i also matched
    // "Top reviewed llms", FAQ questions, etc. (strict mode violation).
    return this.page.getByRole('heading', {
      name,
      level: 1
    });
  }
}

module.exports = {
  TopicPage
};
