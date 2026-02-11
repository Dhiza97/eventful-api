import request from "supertest";
import app from "../app";

describe("Auth Module", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "John",
      email: "john@test.com",
      password: "password123",
      role: "creator",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty("email", "john@test.com");
  });

  it("should login user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "John",
      email: "john@test.com",
      password: "password123",
      role: "creator",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "john@test.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});