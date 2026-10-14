import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {

readonly checkoutButton: Locator;

constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
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

