"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";

type ResponsiveDataViewProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderMobileCard: (item: TData, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
};

const MOBILE_PAGE_SIZE = 10;

export function ResponsiveDataView<TData, TValue>({
  columns,
  data,
  renderMobileCard,
  emptyState,
}: ResponsiveDataViewProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(1);

  if (data.length === 0 && emptyState) {
    return <div className="py-2">{emptyState}</div>;
  }

  const totalPages = Math.max(1, Math.ceil(data.length / MOBILE_PAGE_SIZE));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * MOBILE_PAGE_SIZE;
  const paginatedMobileData = data.slice(startIndex, startIndex + MOBILE_PAGE_SIZE);

  return (
    <div className="w-full">
      {/* Mobile Card Feed (Smooth touch-friendly cards) */}
      <div className="block space-y-3.5 md:hidden">
        {paginatedMobileData.map((item, index) =>
          renderMobileCard(item, startIndex + index),
        )}

        {/* Mobile Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground font-medium">
              Halaman {safePage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safePage <= 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safePage >= totalPages}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop & Tablet Full Data Table */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
