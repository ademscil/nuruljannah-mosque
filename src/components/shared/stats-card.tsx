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
  iconBg = "bg-primary/8",
}: StatsCardProps) {
  return (
    <div className="card-elevated group flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_oklch(0.18_0.018_250_/_0.14)]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", iconBg)}>
          <Icon className={cn("size-4", iconColor)} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {trendLabel && (
        <div
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            trend === "down"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700",
          )}
        >
          {trend === "down" ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}
