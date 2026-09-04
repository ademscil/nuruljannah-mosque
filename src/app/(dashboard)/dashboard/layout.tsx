import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { ROUTE_PATHS } from "@/constants/routes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTE_PATHS.login);
  }

  return (
    <DashboardShell
      userName={session.user.name ?? session.user.email ?? "Pengurus"}
      role={session.user.role}
    >
      {children}
    </DashboardShell>
  );
}
