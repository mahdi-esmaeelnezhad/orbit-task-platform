import { app } from "./app.js";
import { prisma } from "./config/db.js";
import { env } from "./config/env.js";
import { redis } from "./config/redis.js";

const start = async () => {
  await prisma.$connect();
  await redis.connect();
  app.listen(env.PORT, () => {
    console.log(`Server started on port ${env.PORT}`);
  });
};

void start();
