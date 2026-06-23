"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface LabelProps extends React.ComponentProps<"label"> {
  required?: boolean;
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-1.5 text-sm leading-tight font-semibold text-foreground/90 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive text-base leading-none" aria-label="required">
          *
        </span>
      )}
    </label>
  )
}

export { Label }
