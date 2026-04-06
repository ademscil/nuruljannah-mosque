import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
