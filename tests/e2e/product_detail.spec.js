// @ts-check
const { test, expect } = require('../../fixtures');
const { ProductPage } = require('../../pages/ProductPage');

test.describe('Product detail navigation', () => {
  test('clicking a product card navigates to its detail page', { tag: ['@smoke'] }, async ({ homePage, productPage, page }) => {
    await homePage.open();
    await homePage.openFirstProduct();

    await expect(page).toHaveURL(ProductPage.URL_PATTERN);
    await expect(productPage.title).toBeVisible();
  });
});
