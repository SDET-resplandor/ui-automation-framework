import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {

  readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');
  readonly cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
  readonly menuButton = this.page.locator('#react-burger-menu-btn');
  readonly twitterLink = this.page.locator('[data-test="social-x"]');
  readonly facebookLink = this.page.locator('[data-test="social-facebook"]');
  readonly linkedinLink = this.page.locator('[data-test="social-linkedin"]');


  readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  readonly prices = this.page.locator('.inventory_item_price');
  readonly names = this.page.locator('.inventory_item_name');
  readonly images = this.page.locator('.inventory_item_img img');


  async addProductToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
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

  async getPrices(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async getImageSources(): Promise<(string | null)[]> {
    return this.images.evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
  }
}