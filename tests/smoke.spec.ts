import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductsPage';

test('Smoke Test: login exitoso y verificación de ProductsPage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  await loginPage.goto();
  
  // Usamos el método de login que ya agrupa todo
  await loginPage.login('standard_user', 'secret_sauce');

  
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(productsPage.cartLink).toBeVisible(); 
});