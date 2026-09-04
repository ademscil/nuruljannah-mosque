"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Sparkles, UserRoundCheck, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { ResponsiveDataView } from "@/components/shared/responsive-data-view";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDateIndonesia } from "@/lib/format-date";
import { ScheduleFormModal } from "@/features/schedules/components/schedule-form-modal";
import { deleteScheduleAction } from "@/features/schedules/services/schedule-actions";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

type ScheduleAdminTableProps = {
  schedules: ScheduleListItem[];
};

const roleLabelMap = {
  IMAM: "Imam",
  MUADZIN: "Muadzin",
  KHATIB: "Khatib",
  PETUGAS_KEGIATAN: "Petugas Kegiatan",
} as const;

function DeleteScheduleDialog({ schedule }: { schedule: ScheduleListItem }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteScheduleAction(schedule.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-11 min-h-[44px] min-w-[44px] sm:size-8 sm:min-h-8 sm:min-w-8"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Jadwal Petugas?</AlertDialogTitle>
          <AlertDialogDescription>
            Jadwal &ldquo;{schedule.title}&rdquo; akan dihapus permanen. Tindakan ini tidak
            bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ScheduleAdminTable({ schedules }: ScheduleAdminTableProps) {
  const [query, setQuery] = useState("");
  const [roleType, setRoleType] = useState("ALL");

  const columns = useMemo<ColumnDef<ScheduleListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Kegiatan",
        cell: ({ row }) => (
          <div className="space-y-1.5">
            <p className="font-semibold text-foreground">{row.original.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {row.original.notes ?? "Tanpa catatan tambahan"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "roleType",
        header: "Peran",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <UserRoundCheck className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-foreground">
              {roleLabelMap[row.original.roleType]}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "scheduleFor",
        header: "Jadwal",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm">
              <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">
                {formatDateIndonesia(row.original.scheduleFor)}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.timeLabel}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "personName",
        header: "Petugas",
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.personName}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ScheduleFormModal schedule={row.original} mode="edit" />
            <DeleteScheduleDialog schedule={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const filteredData = schedules.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.personName.toLowerCase().includes(query.toLowerCase());

    const matchesRole = roleType === "ALL" || item.roleType === roleType;

    return matchesQuery && matchesRole;
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Sparkles className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Daftar Jadwal Petugas
              </h3>
              <p className="text-sm text-muted-foreground">
                Kelola jadwal imam, muadzin, khatib, dan petugas kegiatan
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto shrink-0"><ScheduleFormModal mode="create" /></div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchInput
            value={query}
            placeholder="Cari kegiatan atau nama petugas..."
            onChange={setQuery}
          />
          <FilterSelect
            placeholder="Filter peran"
            value={roleType}
            onValueChange={setRoleType}
            options={[
              { label: "Semua Peran", value: "ALL" },
              { label: "Imam", value: "IMAM" },
              { label: "Muadzin", value: "MUADZIN" },
              { label: "Khatib", value: "KHATIB" },
              { label: "Petugas Kegiatan", value: "PETUGAS_KEGIATAN" },
            ]}
          />
        </div>

        {/* Table */}
        <ResponsiveDataView
          columns={columns}
          data={filteredData}
          renderMobileCard={(item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-depth-sm space-y-3 transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {roleLabelMap[item.roleType]}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDateIndonesia(item.scheduleFor)}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-base text-foreground leading-snug">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-foreground flex items-center gap-1.5 font-medium">
                  <UserRoundCheck className="size-3.5 text-primary" />
                  {item.personName}
                </p>
                {item.notes ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.notes}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.timeLabel}
                </span>
                <div className="flex items-center gap-2">
                  <ScheduleFormModal schedule={item} mode="edit" />
                  <DeleteScheduleDialog schedule={item} />
                </div>
              </div>
            </div>
          )}
          emptyState={
            <EmptyState
              title="Belum ada jadwal petugas"
              description="Klik tombol Tambah Jadwal di atas untuk menugaskan imam, muadzin, atau khatib."
            />
          }
        />

        {/* Info footer */}
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-semibold text-foreground">{filteredData.length}</span> dari{" "}
            <span className="font-semibold text-foreground">{schedules.length}</span> jadwal
          </p>
        </div>
      </div>
    </div>
  );
}
