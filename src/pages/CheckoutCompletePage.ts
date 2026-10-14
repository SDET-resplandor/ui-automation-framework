import { BasePage } from './BasePage';
 
export class CheckoutCompletePage extends BasePage {
  readonly header = this.page.locator('[data-test="complete-header"]');
  readonly generatePdfOrderButton = this.page.locator('[data-test="generate-pdf-order"]');
 
  async generatePdfOrder() {
    await this.generatePdfOrderButton.click();
  }
 

}
 