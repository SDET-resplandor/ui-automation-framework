import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePages';

export class CheckoutStepOnePage extends BasePage{

readonly cancelButton : Locator;
readonly continueButton : Locator;
readonly  firstNameInput: Locator;
readonly  lastNameInput: Locator;
readonly  postalCodeInput: Locator;
readonly errorMessage: Locator;

constructor( page:Page ) {
  super(page)
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.errorMessage = page.locator('[data-test="error"]');
}
async fillUserInformation(firstName: string, lastName: string, postalCode: string) {
  await expect(this.firstNameInput).toBeVisible();

  await expect(async () => {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await expect(this.firstNameInput).toHaveValue(firstName, { timeout: 1000 });
    await expect(this.lastNameInput).toHaveValue(lastName, { timeout: 1000 });
    await expect(this.postalCodeInput).toHaveValue(postalCode, { timeout: 1000 });
  }).toPass({ timeout: 10000 });

  await this.continueButton.click();
}
}