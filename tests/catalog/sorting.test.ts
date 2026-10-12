import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';
 
test.describe('Product sorting', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
  });
 
  const priceCases = [
    { option: 'lohi', label: 'low to high', cmp: (a: number, b: number) => a - b },
    { option: 'hilo', label: 'high to low', cmp: (a: number, b: number) => b - a },
  ];
 
  for (const { option, label, cmp } of priceCases) {
    test(`products can be sorted by price: ${label} @regression`, async ({ productsPage }) => {
      await productsPage.sortBy(option);
      const prices = await productsPage.getPrices();
      expect(prices).toEqual([...prices].sort(cmp));
    });
  }
 
  const nameCases = [
    { option: 'az', label: 'A to Z', cmp: (a: string, b: string) => a.localeCompare(b) },
    { option: 'za', label: 'Z to A', cmp: (a: string, b: string) => b.localeCompare(a) },
  ];
 
  for (const { option, label, cmp } of nameCases) {
    test(`products can be sorted alphabetically: ${label} @regression`, async ({ productsPage }) => {
      await productsPage.sortBy(option);
      const names = await productsPage.getNames();
      expect(names).toEqual([...names].sort(cmp));
    });
  }
});