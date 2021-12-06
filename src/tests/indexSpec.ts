import app from "../index";
import supertest from "supertest";

const request = supertest(app);

describe("GET /", () => {
  it("should return status code of 200", async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(200);
  });
});
