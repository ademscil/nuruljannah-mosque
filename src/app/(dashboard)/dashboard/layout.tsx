import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppTopbar } from "@/components/layouts/app-topbar";
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
    <div className="flex min-h-screen bg-[oklch(0.978_0.004_80)]">
      <div className="hidden lg:flex">
        <AppSidebar
          userName={session.user.name ?? session.user.email ?? "Pengurus"}
          role={session.user.role}
        />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <AppTopbar
          title="Dashboard Admin"
          userName={session.user.name ?? session.user.email ?? "Pengurus"}
          role={session.user.role}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7">
          <div className="mx-auto w-full max-w-[88rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
