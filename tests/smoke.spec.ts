// tests/smoke.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test('login page loads and accepts input', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.usernameInput.fill('standard_user');
  await expect(loginPage.usernameInput).toHaveValue('standard_user');
});