"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppTopbar } from "@/components/layouts/app-topbar";
import { AppBottomNav } from "@/components/layouts/app-bottom-nav";
import type { UserRole } from "@/constants/roles";

type DashboardShellProps = {
  userName: string;
  role: UserRole;
  children: React.ReactNode;
};

export function DashboardShell({
  userName,
  role,
  children,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[oklch(0.978_0.004_80)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AppSidebar userName={userName} role={role} />
      </div>

      {/* Mobile Drawer (Slide-over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 max-w-[calc(100vw-3rem)] w-72 shadow-2xl transition-transform duration-300 ease-in-out">
            <AppSidebar
              userName={userName}
              role={role}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <AppTopbar
          title="Dashboard Admin"
          userName={userName}
          role={role}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-7 pb-32 lg:pb-10">
          <div className="mx-auto w-full max-w-[88rem]">{children}</div>
        </main>
        <AppBottomNav onOpenMenu={() => setMobileMenuOpen(true)} />
      </div>
    </div>
  );
}
