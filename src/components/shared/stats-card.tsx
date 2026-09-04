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
    <div className="card-3d animate-card-entry group flex flex-col gap-3 sm:gap-4 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", iconBg)}>
          <Icon className={cn("size-4", iconColor)} />
        </div>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
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
