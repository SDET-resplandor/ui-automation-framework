import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class SpinnerCatalogPage extends BasePage {
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('[data-test^="spinner-item-"]');
  }

  async navigate() {
    await this.goto('dynamic-catalog-spinner.html'); 
  }

  async getItemCount(): Promise<number> {
    return await this.items.count();
  }
}