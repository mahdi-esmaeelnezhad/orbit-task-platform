import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/config/redis.js", () => {
  const store = new Map<string, string>();
  const counts = new Map<string, number>();
  return {
    redis: {
      connect: vi.fn(),
      incr: vi.fn(async (key: string) => {
        const next = (counts.get(key) ?? 0) + 1;
        counts.set(key, next);
        return next;
      }),
      expire: vi.fn(),
      get: vi.fn(async (key: string) => store.get(key) ?? null),
      setEx: vi.fn(async (key: string, _ttl: number, value: string) => {
        store.set(key, value);
      }),
      del: vi.fn(async (key: string) => {
        store.delete(key);
      })
    }
  };
});

vi.mock("../src/config/db.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async () => null),
      create: vi.fn(async () => ({
        id: "user_1",
        role: "MEMBER"
      }))
    },
    project: {
      findMany: vi.fn(async () => []),
      create: vi.fn(async () => ({
        id: "project_1"
      }))
    },
    task: {
      create: vi.fn(async () => ({
        id: "task_1",
        status: "TODO"
      })),
      update: vi.fn(async () => ({
        id: "task_1",
        status: "DONE"
      }))
    }
  }
}));

import { app } from "../src/app.js";

describe("health endpoint", () => {
  it("returns api status", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
