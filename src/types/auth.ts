import type { UserRole } from "@/constants/roles";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthUser = SessionUser & {
  image?: string | null;
};
