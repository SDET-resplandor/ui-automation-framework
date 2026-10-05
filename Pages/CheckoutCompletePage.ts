import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class CheckoutCompletePage extends BasePage {

  readonly generatePdfOrderButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.generatePdfOrderButton = page.locator('[data-test="generate-pdf-order"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async generatePdfOrder() {
    await this.generatePdfOrderButton.click();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}