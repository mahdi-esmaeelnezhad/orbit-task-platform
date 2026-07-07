import { Router } from "express";
import { prisma } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createProjectSchema } from "./projects.schemas.js";

export const projectsRouter = Router();

projectsRouter.get("/", requireAuth, async (req, res) => {
  const cacheKey = `projects:${req.user!.id}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: req.user!.id },
    include: { tasks: true }
  });
  await redis.setEx(cacheKey, 30, JSON.stringify(projects));
  return res.json(projects);
});

projectsRouter.post("/", requireAuth, validate(createProjectSchema), async (req, res) => {
  const project = await prisma.project.create({
    data: {
      ...req.body,
      ownerId: req.user!.id
    }
  });
  await redis.del(`projects:${req.user!.id}`);
  return res.status(201).json(project);
});
