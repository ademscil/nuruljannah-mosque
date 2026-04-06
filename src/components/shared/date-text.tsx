import { formatDateIndonesia } from "@/lib/format-date";

type DateTextProps = {
  value: string;
  className?: string;
};

export function DateText({ value, className }: DateTextProps) {
  return <span className={className}>{formatDateIndonesia(value)}</span>;
}
