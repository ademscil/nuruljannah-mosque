"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, MapPin, Eye, EyeOff, Star, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { ResponsiveDataView } from "@/components/shared/responsive-data-view";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
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
import { EventFormModal } from "@/features/events/components/event-form-modal";
import { deleteEventAction } from "@/features/events/services/event-actions";
import type { EventListItem } from "@/features/events/types/event";

type EventAdminTableProps = {
  events: EventListItem[];
};

const statusLabelMap = {
  DRAFT: "Draft",
  PUBLISHED: "Publish",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
} as const;

function DeleteEventDialog({ event }: { event: EventListItem }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEventAction(event.id);

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
          <Button variant="ghost" size="icon-sm">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Agenda Kegiatan?</AlertDialogTitle>
          <AlertDialogDescription>
            Agenda &ldquo;{event.name}&rdquo; akan dihapus permanen. Tindakan ini tidak bisa
            dibatalkan.
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

export function EventAdminTable({ events }: EventAdminTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [visibility, setVisibility] = useState("ALL");

  const columns = useMemo<ColumnDef<EventListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Kegiatan",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="flex items-start gap-3 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-depth-sm">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground leading-tight">{item.name}</p>
                  {item.isFeatured ? (
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500 shrink-0" />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.slug}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: "Jadwal",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{formatDateIndonesia(row.original.date)}</p>
            <p className="text-xs text-muted-foreground">{row.original.timeLabel}</p>
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: "Lokasi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm">{row.original.location}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            label={statusLabelMap[row.original.status]}
            value={
              row.original.status === "COMPLETED"
                ? "PUBLISHED"
                : row.original.status === "CANCELLED"
                  ? "ARCHIVED"
                  : row.original.status
            }
          />
        ),
      },
      {
        accessorKey: "isPublic",
        header: "Tampil di Website",
        cell: ({ row }) =>
          row.original.isPublic ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <Eye className="h-4 w-4" />
              Ya
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <EyeOff className="h-4 w-4" />
              Tidak
            </span>
          ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <EventFormModal event={row.original} mode="edit" />
            <DeleteEventDialog event={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const filteredData = events.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.personInCharge.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "ALL" || item.status === status;
    const matchesVisibility =
      visibility === "ALL" ||
      (visibility === "PUBLIC" && item.isPublic) ||
      (visibility === "INTERNAL" && !item.isPublic);

    return matchesQuery && matchesStatus && matchesVisibility;
  });

  return (
    <div className="glass-ultra rounded-3xl border border-border/50 p-4 sm:p-6 lg:p-8 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-depth-sm">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Daftar Agenda Kegiatan</h3>
              <p className="text-sm text-muted-foreground">
                Kelola dan pantau semua agenda kegiatan masjid
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto shrink-0"><EventFormModal mode="create" /></div>
        </div>

        {/* Filters Section */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px]">
          <SearchInput 
            value={query} 
            placeholder="Cari kegiatan, lokasi, atau PIC..." 
            onChange={setQuery} 
          />
          <FilterSelect 
            placeholder="Filter status" 
            value={status} 
            onValueChange={setStatus} 
            options={[
              { label: "Semua Status", value: "ALL" },
              { label: "Draft", value: "DRAFT" },
              { label: "Publish", value: "PUBLISHED" },
              { label: "Selesai", value: "COMPLETED" },
              { label: "Dibatalkan", value: "CANCELLED" },
            ]} 
          />
          <FilterSelect 
            placeholder="Filter visibilitas" 
            value={visibility} 
            onValueChange={setVisibility} 
            options={[
              { label: "Semua Visibilitas", value: "ALL" },
              { label: "Publik", value: "PUBLIC" },
              { label: "Internal", value: "INTERNAL" },
            ]} 
          />
        </div>

        {/* Table Section */}
        <ResponsiveDataView
          columns={columns}
          data={filteredData}
          renderMobileCard={(item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-depth-sm space-y-3 transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                  {item.timeLabel}
                </span>
                <StatusBadge
                  label={statusLabelMap[item.status]}
                  value={
                    item.status === "COMPLETED"
                      ? "PUBLISHED"
                      : item.status === "CANCELLED"
                        ? "ARCHIVED"
                        : item.status
                  }
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-base text-foreground leading-snug">
                    {item.name}
                  </h4>
                  {item.isFeatured ? (
                    <Star className="size-4 fill-amber-400 text-amber-500 shrink-0" />
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatDateIndonesia(item.date)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {item.location}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  PIC: {item.personInCharge}
                </span>
                <div className="flex items-center gap-1">
                  <EventFormModal event={item} mode="edit" />
                  <DeleteEventDialog event={item} />
                </div>
              </div>
            </div>
          )}
          emptyState={
            <EmptyState
              title="Belum ada agenda kegiatan"
              description="Klik tombol Tambah Agenda di atas untuk menjadwalkan kegiatan baru."
            />
          }
        />

        {/* Info Footer */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          <span>Total {filteredData.length} agenda kegiatan ditampilkan</span>
        </div>
      </div>
    </div>
  );
}
