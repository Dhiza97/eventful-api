import request from "supertest";
import app from "../app";

export const registerAndLogin = async () => {
  const email = `creator_${Date.now()}@test.com`;

  await request(app).post("/api/auth/register").send({
    name: "Creator",
    email,
    password: "password123",
    role: "creator"
  });

  const res = await request(app).post("/api/auth/login").send({
    email,
    password: "password123"
  });

  return res.body.data.token;
};