import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';

test.describe('problem_user', () => {
  test('can log in and reach the product catalog @regression', async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.problem);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.images.first()).toBeVisible();
  });

  test('every product shows its own image (known defect) @regression', async ({
    page,
    loginPage,
    productsPage,
  }) => {
    test.fail(true, 'Known defect: problem_user renders the same image for every product');

    await loginPage.goto();
    await loginPage.loginAs(USERS.problem);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.images.first()).toBeVisible();

    const sources = await productsPage.getImageSources();

    expect(sources.length).toBeGreaterThan(0);
    expect(new Set(sources).size).toBe(sources.length);
  });
});