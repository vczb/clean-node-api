import request from "supertest";
import app from "../config/app";

describe("SignUp Routes", () => {
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
