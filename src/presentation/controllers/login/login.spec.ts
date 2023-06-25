import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helpers";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();
  return {
    sut,
  };
};

const makeHttpRequest = () => {
  return {
    body: {
      email: "any@mail.com",
      password: "123",
    },
  };
};

describe("Login Controller", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.email;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    delete httpRequest.body.password;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
});
