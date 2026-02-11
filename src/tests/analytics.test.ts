import request from "supertest";
import app from "../app";
import { registerAndLogin } from "./helpers";

describe("Analytics API", () => {
  it("should return creator analytics", async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .get("/api/analytics/creator")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("totalEvents");
    expect(res.body.data).toHaveProperty("totalTicketsSold");
    expect(res.body.data).toHaveProperty("totalRevenue");
  });
});