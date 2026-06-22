type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="animate-card-entry flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between md:gap-5 md:pb-7">
      <div className="space-y-2.5">
        {eyebrow && (
          <div className="badge-primary group transition-all duration-300 hover:scale-105">
            <span className="size-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-gradient md:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0 animate-fade-left [animation-delay:200ms]">{action}</div>}
    </div>
  );
}
