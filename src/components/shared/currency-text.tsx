import { formatRupiah } from "@/lib/format-rupiah";

type CurrencyTextProps = {
  value: number;
  className?: string;
};

export function CurrencyText({ value, className }: CurrencyTextProps) {
  return <span className={className}>{formatRupiah(value)}</span>;
}
