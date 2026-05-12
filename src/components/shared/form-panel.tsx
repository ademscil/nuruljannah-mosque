import { cn } from "@/lib/utils";

type FormPanelProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function FormPanel({ title, description, children, className }: FormPanelProps) {
  return (
    <div className={cn("card-hero islamic-grid space-y-5 overflow-hidden p-6", className)}>
      <div className="relative z-10">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
