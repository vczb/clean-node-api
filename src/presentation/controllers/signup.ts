import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
} from "../protocols";
import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helpers";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "password_confirmation",
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      if (
        httpRequest.body.password !== httpRequest.body.password_confirmation
      ) {
        return badRequest(new InvalidParamError("password_confirmation"));
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
