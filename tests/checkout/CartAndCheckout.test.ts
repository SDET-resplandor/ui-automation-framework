import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';
import { PRODUCTS } from '../../src/data/products';
 
test.describe('Cart and checkout edge cases', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
  });
 
  test('cart badge tracks adding and removing items @regression', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(PRODUCTS.backpack.slug);
    await productsPage.addProductToCart(PRODUCTS.bikeLight.slug);
    await expect(productsPage.cartBadge).toHaveText('2');
 
    await productsPage.goToCart();
    await cartPage.removeItemByTitle(PRODUCTS.backpack.name);
    await expect(productsPage.cartBadge).toHaveText('1');
 
    await cartPage.removeItemByTitle(PRODUCTS.bikeLight.name);
    await expect(productsPage.cartBadge).toHaveCount(0);
  });
 
  test('cancel on checkout step one returns to the cart @regression', async ({
    page,
    productsPage,
    cartPage,
    checkoutStepOne,
  }) => {
    await productsPage.addProductToCart(PRODUCTS.backpack.slug);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});