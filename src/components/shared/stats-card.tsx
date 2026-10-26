import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  trend?: "up" | "down";
  trendLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
};

export function StatsCard({
  title,
  value,
  description,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatsCardProps) {
  return (
    <div className="card-craft group flex flex-col justify-between gap-3 sm:gap-4 p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("flex size-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105", iconBg)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
      </div>
      <div>
        <p className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">{value}</p>
        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {trendLabel && (
        <div
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1",
            trend === "down"
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40",
          )}
        >
          {trend === "down" ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
