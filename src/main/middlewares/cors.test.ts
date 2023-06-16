import request from "supertest";
import app from "../config/app";

describe("CORS Middleware", () => {
  test("Should enable cors", async () => {
    const endpoint = "/test_cors";
    app.post(endpoint, (_, res) => {
      res.send();
    });
    await request(app).get(endpoint).expect("access-control-allow-origin", "*");
  });
});
