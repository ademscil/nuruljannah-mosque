type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {eyebrow && (
          <div className="badge-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
