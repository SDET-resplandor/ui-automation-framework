import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { USERS } from '../utils/users';

test('problem_user can log in (precondition for the known-defect test)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(USERS.problem);
  await expect(page).toHaveURL(/.*inventory.html/);
});

test('problem_user: every product shows its own image (known defect)', async ({ page }) => {
  test.fail(true, 'Known defect: problem_user renders the same image for every product');

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(USERS.problem);
  await expect(page).toHaveURL(/.*inventory.html/);

  const images = page.locator('.inventory_item_img img');
  await expect(images.first()).toBeVisible();

  const sources = await images.evaluateAll((imgs) =>
    imgs.map((img) => img.getAttribute('src')),
  );

  expect(sources.length).toBeGreaterThan(0);
  expect(new Set(sources).size).toBe(sources.length);
});