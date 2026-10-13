import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { LazyLoadCatalogPage } from '../pages/LazyLoadCatalogPage';
import { SpinnerCatalogPage } from '../pages/SpinnerCatalogPage';
import { NetworkTimingCollector } from '../utils/NetworkTimingCollector';

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

type Monitoring = {
  networkMetrics: void;
};

export const test = base.extend<Pages & Monitoring>({
  networkMetrics: [
    async ({ page }, use, testInfo) => {
      const collector = new NetworkTimingCollector(page);
      await use();
      await collector.attach(testInfo);
    },
    { auto: true },
  ],

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