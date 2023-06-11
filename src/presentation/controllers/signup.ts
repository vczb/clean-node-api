import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
} from "../protocols";
import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helpers";
import { AddAccount } from "../../domain/usecases/add-account";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

      const {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("password_confirmation"));
      }

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }

      this.addAccount.add({
        name,
        email,
        password,
      });
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
