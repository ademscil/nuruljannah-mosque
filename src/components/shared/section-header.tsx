type SectionHeaderProps = {
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
  center?: boolean;
};

export function SectionHeader({ title, description, badge, action, center }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={`space-y-3 ${center ? "max-w-2xl" : ""}`}>
        {badge ? (
          <div className="badge-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
            {badge}
          </div>
        ) : (
          <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-primary to-primary/20" />
        )}
        <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight md:text-[2.25rem]">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
