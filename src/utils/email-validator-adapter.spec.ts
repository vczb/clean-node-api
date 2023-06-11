import { EmailValidatorAdapter } from "./email-validator";

describe("EmailValidator Adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const isValidEmail = sut.isValid("invalid_email@mail.com");
    expect(isValidEmail).toBe(false);
  });
});
