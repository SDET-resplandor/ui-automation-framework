export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutDataFactory {
  static validUser(): CheckoutData {
    return { firstName: 'Juan', lastName: 'Resplandor', postalCode: '12345' };
  }

  static userWithSpecialCharacters(): CheckoutData {
    return { firstName: "O'Brien", lastName: 'Muñoz-Díaz', postalCode: 'A1B 2C3' };
  }
}