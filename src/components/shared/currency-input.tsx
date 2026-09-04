"use client";

import React, { useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { terbilangRupiah } from "@/lib/terbilang";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  showTerbilang?: boolean;
  showQuickButtons?: boolean;
  disabled?: boolean;
}

const QUICK_AMOUNTS = [
  { label: "+50rb", value: 50000 },
  { label: "+100rb", value: 100000 },
  { label: "+500rb", value: 500000 },
  { label: "+1jt", value: 1000000 },
];

function formatRupiahDisplay(num: number): string {
  if (!num) return "";
  return new Intl.NumberFormat("id-ID").format(num);
}

export function CurrencyInput({
  value,
  onChange,
  id,
  placeholder = "0",
  className,
  showTerbilang = true,
  showQuickButtons = true,
  disabled = false,
}: CurrencyInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const displayString = value ? formatRupiahDisplay(value) : "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    const parsed = rawVal ? parseInt(rawVal, 10) : 0;
    onChange(parsed);
  };

  const handleAddAmount = (addValue: number) => {
    const current = typeof value === "number" && !isNaN(value) ? value : 0;
    onChange(current + addValue);
  };

  const handleClear = () => {
    onChange(0);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
          Rp
        </span>
        <Input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayString}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
          className={cn("pl-11 pr-16 text-base font-semibold", className)}
        />
        {value > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex min-h-[36px] sm:min-h-[32px] items-center rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
          >
            Reset
          </button>
        )}
      </div>

      {showQuickButtons && !disabled && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="self-center pr-1 text-xs text-muted-foreground">Tambah cepat:</span>
          {QUICK_AMOUNTS.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddAmount(item.value)}
              className="min-h-[36px] sm:min-h-[32px] h-9 sm:h-8 px-3 text-xs font-medium"
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}

      {showTerbilang && value > 0 && (
        <p className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span className="font-semibold">Terbilang:</span> {terbilangRupiah(value)}
        </p>
      )}
    </div>
  );
}

