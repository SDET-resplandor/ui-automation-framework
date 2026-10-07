import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test('locked_out_user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('locked out');
  });
