import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Controller } from '../../protocols/controller'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(badRequest(new MissingParamError('email')))) 
  }
}
