import request from "supertest";
import app from "../config/app";

describe("Body Parser Middleware", () => {
  test("Should parse body as json", async () => {
    const endpoint = "/test_body_parser";
    const body = { name: "vini" };
    app.post(endpoint, (req, res) => {
      res.send(req.body);
    });
    await request(app).post(endpoint).send(body).expect(body);
  });
});
