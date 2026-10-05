import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePages';

export class CheckoutStepOnePage extends BasePage{

readonly cancelButton : Locator;
readonly continueButton : Locator;
readonly  firstNameInput: Locator;
readonly  lastNameInput: Locator;
readonly  postalCodeInput: Locator;

constructor( page:Page ) {
  super(page)
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
}
async fillUserInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
}
}