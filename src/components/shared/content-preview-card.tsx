type ContentPreviewCardProps = {
  title: string;
  eyebrow?: string;
  description: string;
};

export function ContentPreviewCard({ title, eyebrow, description }: ContentPreviewCardProps) {
  return (
    <div className="card-elevated flex flex-col gap-3 p-6 transition-all duration-300 hover:-translate-y-0.5">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      )}
      <h3 className="text-lg font-semibold leading-snug tracking-tight">{title}</h3>
      <p className="text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
