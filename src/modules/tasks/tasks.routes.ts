import { Router } from "express";
import { prisma } from "../../config/db.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createTaskSchema, updateTaskStatusSchema } from "./tasks.schemas.js";

export const tasksRouter = Router();

tasksRouter.post("/", requireAuth, validate(createTaskSchema), async (req, res) => {
  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      details: req.body.details,
      projectId: req.body.projectId,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      assigneeId: req.user!.id
    }
  });
  return res.status(201).json(task);
});

tasksRouter.patch("/:id/status", requireAuth, validate(updateTaskStatusSchema), async (req, res) => {
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { status: req.body.status }
  });
  return res.json(task);
});
