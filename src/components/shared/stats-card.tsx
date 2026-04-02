import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  trend?: "up" | "down";
  trendLabel?: string;
  icon: LucideIcon;
};

export function StatsCard({
  title,
  value,
  description,
  trend,
  trendLabel,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card className="glass-panel aurora-border rounded-[1.9rem] border-white/50 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.45)] transition duration-500 hover:translate-y-[-4px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-semibold tracking-tight md:text-4xl">{value}</div>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        {trendLabel ? (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              trend === "down"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
            )}
          >
            {trend === "down" ? (
              <ArrowDownRight className="size-3.5" />
            ) : (
              <ArrowUpRight className="size-3.5" />
            )}
            {trendLabel}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
