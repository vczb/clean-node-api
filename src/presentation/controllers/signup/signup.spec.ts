import { SignUpController } from "./signup";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
} from "./signup-protocols";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

const makeFakeRequest = (
  props = {} as {
    invalid?: string;
    missing?: string;
  }
): HttpRequest => {
  const { invalid, missing } = props;
  const request = {
    body: {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
      password_confirmation: "valid_password",
    },
  };

  if (invalid) {
    request.body[invalid] = `invalid_${invalid}`;
  }

  if (missing) {
    delete request.body[missing];
  }

  return request;
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest({ missing: "name" });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = await makeFakeRequest({ missing: "email" });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = await makeFakeRequest({ missing: "password" });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
  test("Should return 400 if no password_confirmation is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = await makeFakeRequest({
      missing: "password_confirmation",
    });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("password_confirmation"))
    );
  });
  test("Should return 400 if no password_confirmation fail", async () => {
    const { sut } = makeSut();
    const httpRequest = await makeFakeRequest({
      invalid: "password_confirmation",
    });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("password_confirmation"))
    );
  });
  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest({ invalid: "email" });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = await makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("valid_email");
  });
  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = await makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      serverError(new ServerError(httpResponse.body.stack))
    );
  });
  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = await makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    });
  });
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((_, reject) => reject(new Error()));
    });
    const httpRequest = await makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      serverError(new ServerError(httpResponse.body.stack))
    );
  });
  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = await makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
