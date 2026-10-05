import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class CartPage extends BasePage {

readonly checkoutButton: Locator;
readonly continueShoppingButton: Locator;

constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

async removeItemByTitle(productTitle: string) {
  const itemRow = this.page.locator('.cart_item').filter({ hasText: productTitle });
  const removeButton = itemRow.locator('[data-test^="remove-"]'); 
  await removeButton.click();
}

async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

