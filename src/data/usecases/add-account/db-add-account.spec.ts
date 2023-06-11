import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    class EncrypterStup {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_password"));
      }
    }
    const encrypterStup = new EncrypterStup();
    const sut = new DbAddAccount(encrypterStup);
    const encryptSpy = jest.spyOn(encrypterStup, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
