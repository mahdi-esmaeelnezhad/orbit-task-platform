import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  role: Role;
};

export type ApiError = {
  message: string;
};
