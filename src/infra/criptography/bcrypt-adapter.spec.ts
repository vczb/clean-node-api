import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const SALT = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

describe("Bcrypt Adapter", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Should call bcrypt with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  test("Should returns a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  test("Should throw if bcrypt throws", async () => {
    const { encrypt } = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = encrypt(accountData.password);
    await expect(promise).rejects.toThrow();
  });
});
