"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Megaphone, Calendar, Tag, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
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
import { formatDateIndonesia } from "@/lib/format-date";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";
import { AnnouncementFormModal } from "./announcement-form-modal";
import { deleteAnnouncementAction } from "@/features/announcements/services/announcement-actions";

const statusLabelMap = { DRAFT: "Draft", PUBLISHED: "Publish", ARCHIVED: "Arsip" } as const;

function DeleteAnnouncementDialog({ announcement }: { announcement: AnnouncementListItem }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAnnouncementAction(announcement.id);

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
      <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Hapus</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
          <AlertDialogDescription>
            Pengumuman &ldquo;{announcement.title}&rdquo; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AnnouncementAdminTable({ announcements }: { announcements: AnnouncementListItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const columns = useMemo<ColumnDef<AnnouncementListItem>[]>(() => [
    {
      accessorKey: "title",
      header: "Judul Pengumuman",
      cell: ({ row }) => (
        <div className="flex items-start gap-3 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-depth-sm">
            <Megaphone className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground leading-tight">{row.original.title}</p>
            <p className="mt-1 text-xs text-muted-foreground truncate">{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{row.original.category}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge label={statusLabelMap[row.original.status]} value={row.original.status} />,
    },
    {
      accessorKey: "publishedAt",
      header: "Tanggal Tayang",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {row.original.publishedAt ? formatDateIndonesia(row.original.publishedAt) : "—"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <AnnouncementFormModal
            announcement={row.original}
            mode="edit"
          />
          <DeleteAnnouncementDialog announcement={row.original} />
        </div>
      ),
    },
  ], []);

  const filtered = announcements.filter((item) => {
    const q = query.toLowerCase();
    return (q.length === 0 || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      && (status === "ALL" || item.status === status);
  });

  return (
    <div className="glass-ultra rounded-3xl border border-border/50 p-8 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="relative space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-depth-sm">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Daftar Pengumuman</h3>
              <p className="text-sm text-muted-foreground">
                Kelola dan pantau semua pengumuman masjid
              </p>
            </div>
          </div>
          <AnnouncementFormModal mode="create" />
        </div>

        {/* Filters Section */}
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <SearchInput 
            value={query} 
            placeholder="Cari judul atau kategori pengumuman..." 
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
              { label: "Arsip", value: "ARCHIVED" },
            ]} 
          />
        </div>

        {/* Table Section */}
        <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>

        {/* Info Footer */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span>Total {filtered.length} pengumuman ditampilkan</span>
        </div>
      </div>
    </div>
  );
}
