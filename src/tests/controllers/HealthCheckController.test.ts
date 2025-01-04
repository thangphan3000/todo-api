import request from "supertest";
import startApp from "../../utils/TestServer";
import RESPONSE_CODES from "../../constants/ResponseCodes";

describe("HealthCheckController", () => {
  it("checks health with success response", async () => {
    const app = startApp();

    const res = await request(app).get("/api/health");

    expect(res.status).toBe(RESPONSE_CODES.SUCCESS);
  });
});
