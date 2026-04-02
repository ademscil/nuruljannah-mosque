import { ROLE_PERMISSIONS, type UserRole } from "@/constants/roles";

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  return permissions.includes("*") || permissions.includes(permission);
}

export function requireRole(
  role: UserRole,
  allowedRoles: readonly UserRole[],
): boolean {
  return allowedRoles.includes(role);
}
