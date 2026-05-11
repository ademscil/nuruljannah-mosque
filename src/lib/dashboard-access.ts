import { auth } from "@/auth";
import { ROLE_PERMISSIONS } from "@/constants/roles";
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

export async function canAccessDashboardOverview() {
  const user = await getCurrentDashboardUser();

  if (!user) {
    return false;
  }

  return ROLE_PERMISSIONS[user.role].length > 0;
}
