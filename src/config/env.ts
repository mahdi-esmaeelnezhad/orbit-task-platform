import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/orbit"),
  JWT_SECRET: z.string().min(10).default("super_secret_key"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  REDIS_URL: z.string().default("redis://localhost:6379")
});

export const env = schema.parse(process.env);
