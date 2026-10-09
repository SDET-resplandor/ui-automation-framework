import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { USERS, PASSWORD } from '../utils/users';

const invalidLogins = [
  { name: 'locked out user', user: 'locked_out_user', pass: PASSWORD, error: 'locked out' },
  { name: 'wrong password', user: 'standard_user', pass: 'wrong_password', error: 'do not match' },
  { name: 'unknown user', user: 'ghost_user', pass: PASSWORD, error: 'do not match' },
  { name: 'empty username', user: '', pass: PASSWORD, error: 'Username is required' },
  { name: 'empty password', user: 'standard_user', pass: '', error: 'Password is required' },
];

test.describe('Login: invalid attempts', () => {
  for (const { name, user, pass, error } of invalidLogins) {
    test(`rejects login with ${name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user, pass);
      await expect(loginPage.errorMessage).toContainText(error); 
      await expect(page).not.toHaveURL(/.*inventory.html/);
    });
  }

  test('inventory is not reachable without a session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('inventory.html');
    await expect(loginPage.errorMessage).toContainText('logged in');
  });

  test('performance_glitch_user can still log in despite the delay', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.performance);
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 15000 });
  });
});