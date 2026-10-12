import { test, expect } from '../../src/fixtures';
import { CheckoutDataFactory } from '../../src/data/CheckoutDataFactory';
import { USERS } from '../../src/data/users';
import { PRODUCTS } from '../../src/data/products';
 
test.describe('Checkout information validation', () => {
  test.beforeEach(async ({ page, loginPage, productsPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await productsPage.addProductToCart(PRODUCTS.backpack.slug);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
 
  const invalidCases = [
    { name: 'missing first name', data: CheckoutDataFactory.validUser({ firstName: '' }), error: 'First Name is required' },
    { name: 'missing last name', data: CheckoutDataFactory.validUser({ lastName: '' }), error: 'Last Name is required' },
    { name: 'missing postal code', data: CheckoutDataFactory.validUser({ postalCode: '' }), error: 'Postal Code is required' },
  ];
 
  for (const { name, data, error } of invalidCases) {
    test(`shows an error when ${name} @regression`, async ({ checkoutStepOne }) => {
      await checkoutStepOne.fillUserInformation(data.firstName, data.lastName, data.postalCode);
      await expect(checkoutStepOne.errorMessage).toContainText(error);
    });
  }
 
  test('accepts names with special characters @regression', async ({ page, checkoutStepOne }) => {
    const data = CheckoutDataFactory.userWithSpecialCharacters();
    await checkoutStepOne.fillUserInformation(data.firstName, data.lastName, data.postalCode);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
 