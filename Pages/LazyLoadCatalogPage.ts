import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class LazyLoadCatalogPage extends BasePage {
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.locator('[data-test^="lazy-load-item-"]');
  }

  async navigate() {
    await this.goto('dynamic-catalog-lazy-load.html'); 
  }

  async getItemCount(): Promise<number> {
    return await this.items.count();
  }

  async scrollDown() {
    await this.page.mouse.wheel(0, 2000);
  }
}