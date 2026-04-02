import { cn } from "@/lib/utils";

type FormFieldWrapperProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormFieldWrapper({
  label,
  error,
  hint,
  className,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
