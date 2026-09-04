"use client";

import { LogOut, Menu, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DASHBOARD_LABELS, DASHBOARD_PATHS } from "@/constants/routes";
import type { UserRole } from "@/constants/roles";

type Props = {
  title: string;
  userName: string;
  role: UserRole;
  onOpenMenu?: () => void;
};

export function AppTopbar({ title, onOpenMenu }: Props) {
  const pathname = usePathname();
  const pageLabel = DASHBOARD_LABELS[pathname] ?? title;
  const isRoot = pathname === DASHBOARD_PATHS.overview;

  return (
    <div className="sticky top-0 z-30 border-b border-border/50 bg-card/95 backdrop-blur-xl shadow-depth-sm">
      <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {/* Hamburger button on mobile */}
          {onOpenMenu && (
            <button
              type="button"
              className="flex size-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 lg:hidden"
              onClick={onOpenMenu}
              aria-label="Buka navigasi menu"
            >
              <Menu className="size-4" />
            </button>
          )}

          <div className="min-w-0">
            <div className="hidden sm:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={DASHBOARD_PATHS.overview}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Sparkles className="size-3" />
                      <span>Dashboard</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {!isRoot && (
                    <>
                      <BreadcrumbSeparator className="text-border" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs font-semibold text-foreground">
                          {pageLabel}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="truncate font-heading text-base font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
              {pageLabel}
            </h1>
          </div>
        </div>

        {/* Logout button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl border-border/70 font-semibold text-xs transition-all hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline ml-1.5">Keluar</span>
        </Button>
      </div>
    </div>
  );
}
