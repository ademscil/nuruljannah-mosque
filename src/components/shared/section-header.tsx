type SectionHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-base text-muted-foreground">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
