import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { USERS } from '../utils/users';

test.describe('Product sorting', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
  });

  test('products can be sorted by price: low to high', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('lohi');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);

    expect(numericPrices).toEqual(sorted);
  });

  test('products can be sorted by price: high to low', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('hilo');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => b - a);

    expect(numericPrices).toEqual(sorted);
  });

  test('products can be sorted alphabetically: A to Z', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('az');

    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort();

    expect(names).toEqual(sorted);
  });

  test('products can be sorted alphabetically: Z to A', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.sortBy('za');

  const names = await page.locator('.inventory_item_name').allTextContents();
  const sorted = [...names].sort().reverse();

  expect(names).toEqual(sorted);
});

});