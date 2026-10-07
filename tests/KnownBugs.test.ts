import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test('problem_user: product images are broken (known bug, tracked via test.fail)', async ({ page }) => {
  test.fail();

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('problem_user', 'secret_sauce');

  const firstImage = page.locator('.inventory_item_img img').first();
  const secondImage = page.locator('.inventory_item_img img').nth(1);

  const firstSrc = await firstImage.getAttribute('src');
  const secondSrc = await secondImage.getAttribute('src');

  expect(firstSrc).not.toBe(secondSrc); 
});