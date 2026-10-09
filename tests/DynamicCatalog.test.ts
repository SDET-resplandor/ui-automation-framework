import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { LazyLoadCatalogPage } from '../Pages/LazyLoadCatalogPage';
import { SpinnerCatalogPage } from '../Pages/SpinnerCatalogPage';
import { ScrollUntilCountIncreasesStrategy, WaitForExpectedCountStrategy } from '../utils/WaitStrategies';
import { USERS } from '../utils/users';

test.describe('Dynamic Catalog', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('lazy load catalog loads additional items on scroll', async ({ page }) => {
    const lazyLoadPage = new LazyLoadCatalogPage(page);
    await lazyLoadPage.navigate();
    await expect(lazyLoadPage.items.first()).toBeVisible();

    const initialCount = await lazyLoadPage.getItemCount();
    await new ScrollUntilCountIncreasesStrategy('[data-test^="lazy-load-item-"]').waitFor(page);

    expect(await lazyLoadPage.getItemCount()).toBeGreaterThan(initialCount);
  });

  test('lazy load catalog keeps loading batch after batch', async ({ page }) => {
    const lazyLoadPage = new LazyLoadCatalogPage(page);
    await lazyLoadPage.navigate();
    await expect(lazyLoadPage.items.first()).toBeVisible();

    const initialCount = await lazyLoadPage.getItemCount();
    const strategy = new ScrollUntilCountIncreasesStrategy('[data-test^="lazy-load-item-"]');
    await strategy.waitFor(page);
    await strategy.waitFor(page);
    await strategy.waitFor(page);

    expect(await lazyLoadPage.getItemCount()).toBeGreaterThanOrEqual(initialCount + 3);
  });

  test('spinner catalog renders its grid after the randomized delay', async ({ page }) => {
    const spinnerPage = new SpinnerCatalogPage(page);
    await spinnerPage.navigate();

    await new WaitForExpectedCountStrategy('[data-test^="spinner-item-"]', 5).waitFor(page);
    expect(await spinnerPage.getItemCount()).toBeGreaterThanOrEqual(5);
  });
});