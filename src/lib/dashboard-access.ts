import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";

export async function getCurrentDashboardUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function hasDashboardPermission(permission: string) {
  const user = await getCurrentDashboardUser();

  if (!user) {
    return false;
  }

  return hasPermission(user.role, permission);
}
