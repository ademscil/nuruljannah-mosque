"use client";

import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DASHBOARD_LABELS, DASHBOARD_PATHS } from "@/constants/routes";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import type { UserRole } from "@/constants/roles";

type Props = { title: string; description: string; userName: string; role: UserRole };

export function AppTopbar({ title, description, userName, role }: Props) {
  const pathname = usePathname();
  const pageLabel = DASHBOARD_LABELS[pathname] ?? title;
  const isRoot = pathname === DASHBOARD_PATHS.overview;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <AppSidebar userName={userName} role={role} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-white/92 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-white text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="size-4" />
          </button>
          <div className="space-y-0.5 min-w-0">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={DASHBOARD_PATHS.overview} className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!isRoot && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="font-heading text-lg font-semibold tracking-tight truncate sm:text-xl">{pageLabel}</h1>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full border-border/70 bg-white text-sm font-medium"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </>
  );
}
