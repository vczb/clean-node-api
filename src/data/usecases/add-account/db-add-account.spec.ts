import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};

const FAKE_ACCOUNT_DATA = {
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
};

const FAKE_ACCOUNT_MOCK = {
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(FAKE_ACCOUNT_MOCK));
    }
  }

  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStup: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStup = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStup);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStup,
  };
};

describe("DbAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.add(FAKE_ACCOUNT_DATA);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.add(FAKE_ACCOUNT_DATA);
    await expect(promise).rejects.toThrow();
  });

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStup } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStup, "add");

    await sut.add(FAKE_ACCOUNT_DATA);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("should throw if DbAddAccount throws", async () => {
    const { sut, addAccountRepositoryStup } = makeSut();
    jest
      .spyOn(addAccountRepositoryStup, "add")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.add(FAKE_ACCOUNT_DATA);
    await expect(promise).rejects.toThrow();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();

    const account = await sut.add(FAKE_ACCOUNT_DATA);
    expect(account).toEqual(FAKE_ACCOUNT_MOCK);
  });
});
