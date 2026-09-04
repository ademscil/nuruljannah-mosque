import * as React from "react";
import { cn } from "@/lib/utils";

type FormFieldWrapperProps = {
  label: string;
  htmlFor?: string;
  id?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormFieldWrapper({
  label,
  htmlFor,
  id,
  error,
  hint,
  className,
  children,
}: FormFieldWrapperProps) {
  let targetId = htmlFor || id;

  if (!targetId && React.isValidElement(children)) {
    const props = children.props as Record<string, unknown> | undefined;
    if (props?.id && typeof props.id === "string") {
      targetId = props.id;
    } else if (props?.name && typeof props.name === "string") {
      targetId = `field-${props.name}`;
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <label
          htmlFor={targetId}
          className="text-sm font-semibold text-foreground/90 select-none block"
        >
          {label}
        </label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm text-destructive font-medium">{error}</p> : null}
    </div>
  );
}
