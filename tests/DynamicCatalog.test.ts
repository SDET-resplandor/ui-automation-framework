import { test, expect } from '@playwright/test';
import { LazyLoadCatalogPage } from '../Pages/LazyLoadCatalogPage';
import { SpinnerCatalogPage } from '../Pages/SpinnerCatalogPage';
import { ScrollUntilCountIncreasesStrategy, WaitForExpectedCountStrategy } from '../utils/WaitStrategies';

test.describe('Dynamic Catalog', () => {
 
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('lazy load catalog loads additional items on scroll', async ({ page }) => {
    const lazyLoadPage = new LazyLoadCatalogPage(page);
    await lazyLoadPage.navigate();

    const initialCount = await lazyLoadPage.getItemCount();

    const strategy = new ScrollUntilCountIncreasesStrategy('[data-test^="lazy-load-item-"]');
    await strategy.waitFor(page);

    const newCount = await lazyLoadPage.getItemCount();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('lazy load catalog keeps loading across multiple scrolls without breaking', async ({ page }) => {
    const lazyLoadPage = new LazyLoadCatalogPage(page);
    await lazyLoadPage.navigate();

    for (let i = 0; i < 3; i++) {
      await lazyLoadPage.scrollDown();
    }

    const finalCount = await lazyLoadPage.getItemCount();
    expect(finalCount).toBeGreaterThan(6); 
  });

  test('spinner catalog eventually loads all 5 items', async ({ page }) => {
    const spinnerPage = new SpinnerCatalogPage(page);
    await spinnerPage.navigate();

    const strategy = new WaitForExpectedCountStrategy ('[data-test^="spinner-item-"]', 5);
    await strategy.waitFor(page);

    const count = await spinnerPage.getItemCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});