"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

type AppTopbarProps = {
  title: string;
  description: string;
};

export function AppTopbar({ title, description }: AppTopbarProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/30 bg-background/75 px-4 py-4 backdrop-blur-2xl sm:px-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          type="button"
          variant="outline"
          className="rounded-full bg-white/60"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
