import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-input/85 bg-gradient-to-b from-white to-[oklch(0.985_0.003_170)] px-3 py-2 text-base shadow-[0_1px_2px_oklch(0_0_0_/_0.08),inset_0_1px_0_oklch(1_0_0_/_0.9),0_0_0_1px_oklch(0_0_0_/_0.02)] transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/90 hover:border-primary/30 hover:shadow-[0_1px_3px_oklch(0_0_0_/_0.1),inset_0_1px_0_oklch(1_0_0_/_0.9),0_0_0_1px_oklch(0_0_0_/_0.03)] focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:shadow-[0_2px_4px_oklch(0_0_0_/_0.1),inset_0_1px_0_oklch(1_0_0_/_0.9),0_0_0_1px_oklch(var(--primary)_/_0.1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-gradient-to-b dark:from-input/30 dark:to-input/20 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
