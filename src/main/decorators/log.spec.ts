import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
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

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
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
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
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

  test("should call LogErrorRepository with correct error if controoler returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)));
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    await sut.handle(HTTP_REQUEST);
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});
