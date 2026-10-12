import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { LazyLoadCatalogPage } from '../../src/pages/LazyLoadCatalogPage';
import { SpinnerCatalogPage } from '../../src/pages/SpinnerCatalogPage';

type Pages = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutStepOne: CheckoutStepOnePage;
  checkoutStepTwo: CheckoutStepTwoPage;
  checkoutComplete: CheckoutCompletePage;
  lazyLoadPage: LazyLoadCatalogPage;
  spinnerPage: SpinnerCatalogPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutStepOne: async ({ page }, use) => use(new CheckoutStepOnePage(page)),
  checkoutStepTwo: async ({ page }, use) => use(new CheckoutStepTwoPage(page)),
  checkoutComplete: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  lazyLoadPage: async ({ page }, use) => use(new LazyLoadCatalogPage(page)),
  spinnerPage: async ({ page }, use) => use(new SpinnerCatalogPage(page)),
});

export { expect };