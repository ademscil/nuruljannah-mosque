import { cn } from "@/lib/utils";

type FormPanelProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function FormPanel({ title, description, children, className }: FormPanelProps) {
  return (
    <div className={cn("card-elevated p-6 space-y-5", className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
