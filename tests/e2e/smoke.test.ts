import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';
 
test('Smoke: successful login and ProductsPage verification @smoke', async ({
  page,
  loginPage,
  productsPage,
}) => {
  await loginPage.goto();
  await loginPage.loginAs(USERS.standard);
 
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(productsPage.cartLink).toBeVisible();
});
 