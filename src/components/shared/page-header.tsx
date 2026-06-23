import { Sparkles } from "lucide-react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="animate-card-entry relative">
      {/* Decorative background blur */}
      <div className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative flex flex-col gap-4 border-b border-border/50 pb-6 md:flex-row md:items-end md:justify-between md:gap-5 md:pb-8">
        <div className="space-y-3">
          {eyebrow && (
            <div className="card-3d-advanced inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-depth-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-depth-md">
              <Sparkles className="size-3" />
              {eyebrow}
            </div>
          )}
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-gradient drop-shadow-sm md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        {action && (
          <div className="shrink-0 animate-fade-left [animation-delay:200ms]">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
