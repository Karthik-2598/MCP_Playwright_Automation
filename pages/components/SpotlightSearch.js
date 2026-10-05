// @ts-check

/**
 * The search modal ("spotlight") that opens from the header.
 * Built from the live DOM: the header box is only a readonly trigger, the real
 * input lives inside this modal, and every result has a stable data-test id.
 */
class SpotlightSearch {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.trigger = page.getByTestId('header-search-input');
    this.modal = page.getByTestId('spotlight-search');
    this.input = page.getByTestId('spotlight-search-input');
    this.results = this.modal.locator('[data-test^="spotlight-result-"]');
    this.productResults = this.modal.locator('[data-test^="spotlight-result-product-"]');
  }

  /** @param {string} id Product Hunt product id */
  productResult(id) {
    return this.page.getByTestId(`spotlight-result-product-${id}`);
  }

  /** Live site renders: No results found for "<term>" */
  get noResultsMessage() {
    return this.modal.getByText(/No results found for/i);
  }

  async open() {
    await this.trigger.click();
    // Clicking the trigger occasionally fires before the page has hydrated.
    // The keyboard shortcut is a real user path too, so use it as the fallback.
    try {
      await this.input.waitFor({ state: 'visible', timeout: 3_000 });
    } catch {
      await this.page.keyboard.press('ControlOrMeta+k');
      await this.input.waitFor({ state: 'visible' });
    }
  }

  /** Type a query and leave the modal open (live suggestions). @param {string} term */
  async type(term) {
    await this.input.fill(term);
  }

  /** Type a query and press Enter (goes to the full results page). @param {string} term */
  async submit(term) {
    await this.type(term);
    // The app debounces the input. Pressing Enter straight after fill() submitted
    // an EMPTY query (/search?q=). Wait until the app has reacted to what we typed
    // (suggestions or the empty state appear), which is what a human does anyway.
    await this.results.first().or(this.noResultsMessage).waitFor();
    await this.input.press('Enter');
  }
}

module.exports = { SpotlightSearch };
