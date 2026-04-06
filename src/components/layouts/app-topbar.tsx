"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DASHBOARD_LABELS, DASHBOARD_PATHS } from "@/constants/routes";

type Props = { title: string; description: string };

export function AppTopbar({ title, description }: Props) {
  const pathname = usePathname();
  const pageLabel = DASHBOARD_LABELS[pathname] ?? title;
  const isRoot = pathname === DASHBOARD_PATHS.overview;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-white/92 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="space-y-1 min-w-0">
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
        <h1 className="font-heading text-xl font-semibold tracking-tight truncate">{pageLabel}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-border/70 bg-white text-sm font-medium"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-3.5" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
