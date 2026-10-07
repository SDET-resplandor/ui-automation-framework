import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { CartPage } from '../Pages/CartPage';
import { CheckoutStepOnePage } from '../Pages/CheckoutStepOnePage';
import { CheckoutDataFactory } from '../utils/CheckoutDataFactory';

test.describe('Checkout information validation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addProductToCart('sauce-labs-backpack');
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  const invalidCases = [
    { name: 'missing first name', data: { ...CheckoutDataFactory.validUser(), firstName: '' }, error: 'First Name is required' },
    { name: 'missing last name', data: { ...CheckoutDataFactory.validUser(), lastName: '' }, error: 'Last Name is required' },
    { name: 'missing postal code', data: { ...CheckoutDataFactory.validUser(), postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const { name, data, error } of invalidCases) {
    test(`shows an error when ${name}`, async ({ page }) => {
      const stepOne = new CheckoutStepOnePage(page);
      await stepOne.fillUserInformation(data.firstName, data.lastName, data.postalCode);
      await expect(stepOne.errorMessage).toContainText(error);
    });
  }

  test('accepts names with special characters', async ({ page }) => {
    const stepOne = new CheckoutStepOnePage(page);
    const data = CheckoutDataFactory.userWithSpecialCharacters();
    await stepOne.fillUserInformation(data.firstName, data.lastName, data.postalCode);
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });
});