import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class CheckoutStepTwoPage extends BasePage {

  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }
}