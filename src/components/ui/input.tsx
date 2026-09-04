import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: "sm" | "default";
}

function Input({ className, type, size = "default", id, autoComplete = "off", ...props }: InputProps) {
  const generatedId = React.useId();
  const inputId = id || (props.name ? `field-${props.name}` : generatedId);

  return (
    <InputPrimitive
      id={inputId}
      autoComplete={autoComplete}
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "w-full min-w-0 rounded-xl border border-white/40 bg-white/60 backdrop-blur-sm px-4 py-2.5 text-base sm:text-sm font-normal shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 hover:border-primary/30 hover:bg-white/80 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.06)] focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:bg-white/90 focus-visible:shadow-[0_4px_16px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.08)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/30 aria-invalid:border-destructive/50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-11 data-[size=sm]:h-9 data-[size=sm]:text-xs dark:bg-card/40 dark:border-white/10 dark:hover:bg-card/60 dark:focus-visible:bg-card/70",
        className
      )}
      {...props}
    />
  )
}

export { Input }
