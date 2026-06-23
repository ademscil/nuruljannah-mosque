import type { LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

type FilterSelectProps = {
  placeholder: string;
  value?: string;
  options: FilterOption[];
  onValueChange?: (value: string) => void;
  icon?: LucideIcon;
  size?: "sm" | "default";
  className?: string;
};

export function FilterSelect({
  placeholder,
  value,
  options,
  onValueChange,
  icon: Icon,
  size = "default",
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onValueChange?.(nextValue);
        }
      }}
    >
      <SelectTrigger 
        size={size}
        className={className || "w-full sm:w-[220px] md:w-[240px]"}
      >
        <SelectValue placeholder={
          Icon ? (
            <span className="flex items-center gap-2">
              <Icon className="size-4 text-muted-foreground/70" />
              <span>{placeholder}</span>
            </span>
          ) : placeholder
        } />
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((option) => {
          const OptionIcon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              {OptionIcon ? (
                <span className="flex items-center gap-2">
                  <OptionIcon className="size-4 text-muted-foreground/70" />
                  <span>{option.label}</span>
                </span>
              ) : (
                option.label
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
