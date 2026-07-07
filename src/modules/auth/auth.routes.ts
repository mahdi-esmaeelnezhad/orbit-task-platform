import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import { validate } from "../../middlewares/validate.js";
import { signToken } from "../../utils/jwt.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), async (req, res) => {
  const { email, fullName, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, fullName, passwordHash }
  });

  const token = signToken({ id: user.id, role: user.role });
  return res.status(201).json({ token });
});

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user.id, role: user.role });
  return res.json({ token });
});
