/**
 * Safely extracts a database user ID for foreign-key relations (e.g. createdById).
 * In development or when using fallback demo credentials (demo-*), return null
 * to prevent PostgreSQL foreign-key constraint violations (P2003).
 */
export function getSafeAuthorId(
  userId: string | null | undefined,
): string | null {
  if (!userId || typeof userId !== "string") {
    return null;
  }
  if (userId.startsWith("demo-")) {
    return null;
  }
  return userId;
}
