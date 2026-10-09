import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { USERS } from '../utils/users';

test('Smoke test: Successful login and ProductsPage verification', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  await loginPage.goto();
  
  
  await loginPage.loginAs(USERS.standard);

  
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(productsPage.cartLink).toBeVisible(); 
});