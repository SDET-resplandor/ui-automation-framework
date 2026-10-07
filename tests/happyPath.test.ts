import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { CartPage } from '../Pages/CartPage';
import { CheckoutStepOnePage } from '../Pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../Pages/CheckoutStepTwoPage';
import {CheckoutCompletePage} from '../Pages/CheckoutCompletePage';

test.describe('E2E Checkout Flow - Happy Path', () => {
  test('standard_user can complete the full purchase journey and download the order PDF', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    await test.step('Log in with valid standard credentials', async () => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    await test.step('Add a product to the cart and navigate to cart', async () => {
      await productsPage.addProductToCart('sauce-labs-backpack');
      await expect(productsPage.cartLink).toContainText('1');
      await productsPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);
    });

    await test.step('Proceed from cart to checkout information step', async () => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    await test.step('Fill out shipping information and continue', async () => {
      await checkoutStepOne.fillUserInformation('Juan', 'Resplandor', '12345');
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
    });

    await test.step('Finish the checkout process and verify success screen', async () => {
      await checkoutStepTwo.finishCheckout();
      await expect(page).toHaveURL(/.*checkout-complete.html/);
      await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });

    await test.step('Generate and download the order PDF securely', async () => {
      const downloadPromise = page.waitForEvent('download');
      await checkoutComplete.generatePdfOrder();
      const download = await downloadPromise;
      const uniqueSuffix = Date.now();
      await download.saveAs(`./downloads/order-confirmation-${uniqueSuffix}.pdf`); 
    });
  });
});