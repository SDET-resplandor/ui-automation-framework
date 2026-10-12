import { Page } from '@playwright/test';

export interface WaitStrategy {
  waitFor(page: Page): Promise<void>;
}

export class ScrollUntilCountIncreasesStrategy implements WaitStrategy {
  constructor(
    private itemSelector: string,
    private maxScrolls: number = 5,
  ) {}

  async waitFor(page: Page): Promise<void> {
    const initialCount = await page.locator(this.itemSelector).count();
    for (let i = 0; i < this.maxScrolls; i++) {
      await page.mouse.wheel(0, 2000);
      try {
        await page.waitForFunction(
          ([selector, count]: [string, number]) =>
            document.querySelectorAll(selector).length > count,
          [this.itemSelector, initialCount] as [string, number],
          { timeout: 2000 },
        );
        return;
      } catch {
      }
    }
    throw new Error('Item count did not increase after scrolling.');
  }
}

export class WaitForExpectedCountStrategy implements WaitStrategy {
  constructor(
    private itemSelector: string,
    private expectedCount: number,
    private timeoutMs: number = 10000,
  ) {}

  async waitFor(page: Page): Promise<void> {
    await page
      .locator(this.itemSelector)
      .nth(this.expectedCount - 1)
      .waitFor({ state: 'visible', timeout: this.timeoutMs });
  }
}