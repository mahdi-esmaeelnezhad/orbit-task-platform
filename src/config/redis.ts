import { createClient } from "redis";
import { env } from "./env.js";

export const redis = createClient({ url: env.REDIS_URL });
