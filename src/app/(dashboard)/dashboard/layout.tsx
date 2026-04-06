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
    <div className="flex min-h-screen bg-[#f7f8fb]">
      <AppSidebar
        userName={session.user.name ?? session.user.email ?? "Pengurus"}
        role={session.user.role}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppTopbar
          title="Dashboard Admin"
          description="Area CMS internal pengurus Masjid Nurul Jannah."
        />
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
