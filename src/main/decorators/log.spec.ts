import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const HTTP_RESPONSE: HttpResponse = {
  statusCode: 200,
  body: {
    ok: true,
  },
};

const HTTP_REQUEST = {
  body: {
    email: "any_mail@mail.com",
    name: "any_name",
    password: "123",
    password_confirmation: "123",
  },
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(HTTP_RESPONSE));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
  };
};

describe("LogControllerDecorator", () => {
  test("should call controller handle", async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");

    await sut.handle(HTTP_REQUEST);
    expect(handleSpy).toHaveBeenCalledWith(HTTP_REQUEST);
  });

  test("should return the same result of the controller", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(HTTP_REQUEST);
    expect(httpResponse).toEqual(HTTP_RESPONSE);
  });
});
