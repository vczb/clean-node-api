import env from "../../../../main/config/env";
import { MongoHelper as sut } from "./mongo-helper";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(env.mongoUrl);
  });
  afterAll(async () => {
    await sut.disconnect();
  });
  test("should retry mongo connection", async () => {
    let accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
  });
});
