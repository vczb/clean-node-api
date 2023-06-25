import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/accout-repository/account";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
