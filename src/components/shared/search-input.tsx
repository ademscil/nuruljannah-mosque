import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchInputProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function SearchInput({
  value,
  placeholder = "Cari data...",
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}
