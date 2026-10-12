import { test, expect } from '../../src/fixtures';
import { ScrollUntilCountIncreasesStrategy, WaitForExpectedCountStrategy } from '../../src/utils/WaitStrategies';
import { USERS } from '../../src/data/users';
 
test.describe('Dynamic Catalog', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
  });
 
  test('lazy load catalog loads additional items on scroll @regression', async ({
    page,
    lazyLoadPage,
  }) => {
    await lazyLoadPage.navigate();
    await expect(lazyLoadPage.items.first()).toBeVisible();
 
    const initialCount = await lazyLoadPage.getItemCount();
    await new ScrollUntilCountIncreasesStrategy('[data-test^="lazy-load-item-"]').waitFor(page);
 
    expect(await lazyLoadPage.getItemCount()).toBeGreaterThan(initialCount);
  });
 
  test('lazy load catalog keeps loading batch after batch @regression', async ({
    page,
    lazyLoadPage,
  }) => {
    await lazyLoadPage.navigate();
    await expect(lazyLoadPage.items.first()).toBeVisible();
 
    const initialCount = await lazyLoadPage.getItemCount();
    const strategy = new ScrollUntilCountIncreasesStrategy('[data-test^="lazy-load-item-"]');
    await strategy.waitFor(page);
    await strategy.waitFor(page);
    await strategy.waitFor(page);
 
    expect(await lazyLoadPage.getItemCount()).toBeGreaterThanOrEqual(initialCount + 3);
  });
 
  test('spinner catalog renders its grid after the randomized delay @regression', async ({
    page,
    spinnerPage,
  }) => {
    await spinnerPage.navigate();
 
    await new WaitForExpectedCountStrategy('[data-test^="spinner-item-"]', 5).waitFor(page);
    expect(await spinnerPage.getItemCount()).toBeGreaterThanOrEqual(5);
  });
});
 