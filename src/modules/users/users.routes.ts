import { Router } from "express";
import { prisma } from "../../config/db.js";
import { requireAuth } from "../../middlewares/auth.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true }
  });

  return res.json(user);
});
