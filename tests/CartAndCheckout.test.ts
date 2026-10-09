import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { CartPage } from '../Pages/CartPage';
import { CheckoutStepOnePage } from '../Pages/CheckoutStepOnePage';
import { USERS } from '../utils/users';

test.describe('Cart and checkout edge cases', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('cart badge tracks adding and removing items', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.addProductToCart('sauce-labs-backpack');
    await productsPage.addProductToCart('sauce-labs-bike-light');
    await expect(productsPage.cartLink).toContainText('2');

    await productsPage.goToCart();
    await cartPage.removeItemByTitle('Sauce Labs Backpack');
    await expect(productsPage.cartLink).toContainText('1');

    await cartPage.removeItemByTitle('Sauce Labs Bike Light');
    await expect(productsPage.cartLink).toHaveText('');
  });

  test('cancel on checkout step one returns to the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const stepOne = new CheckoutStepOnePage(page);

    await productsPage.addProductToCart('sauce-labs-backpack');
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
    await stepOne.cancelButton.click();
    await expect(page).toHaveURL(/.*cart.html/);
  });
});