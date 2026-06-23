"use client";

import { LogOut, Menu, Sparkles } from "lucide-react";
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

type Props = { title: string; userName: string; role: UserRole };

export function AppTopbar({ title, userName, role }: Props) {
  const pathname = usePathname();
  const pageLabel = DASHBOARD_LABELS[pathname] ?? title;
  const isRoot = pathname === DASHBOARD_PATHS.overview;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar overlay with blur */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full shadow-depth-lg">
            <AppSidebar userName={userName} role={role} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 glass-ultra border-b border-border/40 bg-white/95 shadow-depth-sm backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Hamburger with 3D effect — mobile only */}
            <button
              type="button"
              className="card-3d-advanced flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-white to-gray-50 text-muted-foreground shadow-depth-sm transition-all hover:border-primary/30 hover:text-primary hover:shadow-depth-md lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="size-4" />
            </button>
            
            <div className="min-w-0 space-y-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href={DASHBOARD_PATHS.overview} 
                      className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Sparkles className="size-3" />
                      <span className="font-medium">Dashboard</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {!isRoot && (
                    <>
                      <BreadcrumbSeparator className="text-border" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold text-foreground">
                          {pageLabel}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-heading text-xl font-bold tracking-tight text-transparent sm:text-2xl">
                {pageLabel}
              </h1>
            </div>
          </div>
          
          {/* Logout button with 3D styling */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="card-3d-advanced shrink-0 rounded-xl border-border/50 bg-gradient-to-br from-white to-gray-50 font-semibold shadow-depth-sm transition-all hover:border-primary/30 hover:from-primary/5 hover:to-primary/10 hover:text-primary hover:shadow-depth-md"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>
    </>
  );
}
