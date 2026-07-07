import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  details: z.string().min(5),
  projectId: z.string().min(5),
  dueDate: z.string().datetime().optional()
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"])
});
