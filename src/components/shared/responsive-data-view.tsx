"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";

type ResponsiveDataViewProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderMobileCard: (item: TData, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
};

export function ResponsiveDataView<TData, TValue>({
  columns,
  data,
  renderMobileCard,
  emptyState,
}: ResponsiveDataViewProps<TData, TValue>) {
  if (data.length === 0 && emptyState) {
    return <div className="py-2">{emptyState}</div>;
  }

  return (
    <div className="w-full">
      {/* Mobile Card Feed (Smooth touch-friendly cards) */}
      <div className="block space-y-3.5 md:hidden">
        {data.map((item, index) => renderMobileCard(item, index))}
      </div>

      {/* Desktop & Tablet Full Data Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-depth-sm">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
