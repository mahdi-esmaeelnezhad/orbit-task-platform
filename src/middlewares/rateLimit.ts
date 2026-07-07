import type { NextFunction, Request, Response } from "express";
import { redis } from "../config/redis.js";

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const key = `rl:${req.ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 100) {
    return res.status(429).json({ message: "Too many requests" });
  }

  next();
};
