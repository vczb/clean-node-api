import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    accountCollection.deleteMany({});
  });
  test("Should return an account on success", async () => {
    const endpoint = "/api/signup";
    const body = {
      name: "Vini",
      email: "viniczb@gmail.com",
      password: "123",
      password_confirmation: "123",
    };
    await request(app).post(endpoint).send(body).expect(200);
  });
});
