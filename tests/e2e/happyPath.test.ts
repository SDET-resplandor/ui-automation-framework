import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';
import { PRODUCTS } from '../../src/data/products';
import { CheckoutDataFactory } from '../../src/data/CheckoutDataFactory';
 
test.describe('E2E Checkout Flow - Happy Path', () => {
  test('standard_user can complete the full purchase journey and download the order PDF @smoke', async ({
    page,
    loginPage,
    productsPage,
    cartPage,
    checkoutStepOne,
    checkoutStepTwo,
    checkoutComplete,
  }, testInfo) => {
    const user = CheckoutDataFactory.validUser();
 
    await test.step('Log in with valid standard credentials', async () => {
      await loginPage.goto();
      await loginPage.loginAs(USERS.standard);
      await expect(page).toHaveURL(/inventory\.html/);
    });
 
    await test.step('Add a product to the cart and navigate to cart', async () => {
      await productsPage.addProductToCart(PRODUCTS.backpack.slug);
      await expect(productsPage.cartBadge).toHaveText('1');
      await productsPage.goToCart();
      await expect(page).toHaveURL(/cart\.html/);
    });
 
    await test.step('Proceed from cart to checkout information step', async () => {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
 
    await test.step('Fill out shipping information and continue', async () => {
      await checkoutStepOne.fillUserInformation(user.firstName, user.lastName, user.postalCode);
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });
 
    await test.step('Finish the checkout process and verify success screen', async () => {
      await checkoutStepTwo.finishCheckout();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutComplete.header).toHaveText('Thank you for your order!');
    });
 
    await test.step('Generate and download the order PDF', async () => {
      const downloadPromise = page.waitForEvent('download');
      await checkoutComplete.generatePdfOrder();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      await download.saveAs(testInfo.outputPath(download.suggestedFilename()));
    });
  });
});
 