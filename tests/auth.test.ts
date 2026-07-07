import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/config/redis.js", () => ({
  redis: {
    connect: vi.fn(),
    incr: vi.fn(async () => 1),
    expire: vi.fn(),
    get: vi.fn(async () => null),
    setEx: vi.fn(),
    del: vi.fn()
  }
}));

vi.mock("../src/config/db.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async () => null),
      create: vi.fn(async () => ({
        id: "user_1",
        role: "MEMBER",
        email: "john@example.com",
        passwordHash: "hashed"
      }))
    },
    project: {
      findMany: vi.fn(async () => [])
    },
    task: {
      create: vi.fn(),
      update: vi.fn()
    }
  }
}));

import { app } from "../src/app.js";

describe("auth routes", () => {
  it("register returns token", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "john@example.com",
      password: "Password123",
      fullName: "John Doe"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeTypeOf("string");
  });
});
