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
};

type FilterSelectProps = {
  placeholder: string;
  value?: string;
  options: FilterOption[];
  onValueChange?: (value: string) => void;
};

export function FilterSelect({
  placeholder,
  value,
  options,
  onValueChange,
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
      <SelectTrigger className="w-full md:w-56">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
