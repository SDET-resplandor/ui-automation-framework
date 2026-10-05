import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class ProductsPage extends BasePage {
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly sortDropdown: Locator;
  
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;

  constructor(page: Page) {
    super(page);
    
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    
    this.twitterLink = page.locator('[data-test="social-x"]');
    this.facebookLink = page.locator('[data-test="social-facebook"]');
    this.linkedinLink = page.locator('[data-test="social-linkedin"]');
  }
  async addProductToCart(productName: string) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productName}"]`);
    await addButton.click();
  }

  async sortBy(optionValue: string) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async clickTwitter() {
    await this.twitterLink.click();
  }

  async clickFacebook() {
    await this.facebookLink.click();
  }

  async clickLinkedin() {
    await this.linkedinLink.click();
  }
}