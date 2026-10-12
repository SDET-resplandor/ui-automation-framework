import { BasePage } from './BasePage';
 
export class CheckoutCompletePage extends BasePage {
  readonly header = this.page.locator('[data-test="complete-header"]');
  readonly generatePdfOrderButton = this.page.locator('[data-test="generate-pdf-order"]');
  readonly backToProductsButton = this.page.locator('[data-test="back-to-products"]');
 
  async generatePdfOrder() {
    await this.generatePdfOrderButton.click();
  }
 
  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
 