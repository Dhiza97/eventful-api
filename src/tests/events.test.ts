import request from "supertest";
import app from "../app";
import { registerAndLogin } from "./helpers";

describe("Events Module", () => {
  it("should create an event", async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tech Conf",
        description: "Conference",
        date: "2026-06-10",
        price: 5000,
        capacity: 100,
        location: "Lagos, Nigeria",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Tech Conf");
  });
});