"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import { Image as ImageIcon, Sparkles, Tag, Calendar, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { formatDateIndonesia } from "@/lib/format-date";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";
import { deleteGalleryItemAction } from "@/features/gallery/services/gallery-actions";
import { GalleryFormModal } from "./gallery-form-modal";

type GalleryAdminTableProps = {
  items: GalleryItemRecord[];
};

type DeleteGalleryDialogProps = {
  item: GalleryItemRecord;
  trigger: React.ReactElement;
};

function DeleteGalleryDialog({ item, trigger }: DeleteGalleryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteGalleryItemAction(item.id);
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
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogTitle>Hapus foto galeri?</AlertDialogTitle>
        <AlertDialogDescription>
          Foto <strong>{item.title}</strong> akan dihapus dan tidak akan lagi tampil di galeri
          website. Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus Foto"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function GalleryAdminTable({ items }: GalleryAdminTableProps) {
  const [query, setQuery] = useState("");

  const columns = useMemo<ColumnDef<GalleryItemRecord>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Judul Galeri",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 shadow-sm">
              <ImageIcon className="size-4 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{row.original.title}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="size-3" />
                {row.original.category}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "activityDate",
        header: "Tanggal",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-sm">{formatDateIndonesia(row.original.activityDate)}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge label="Publish" value={row.original.status} />,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <GalleryFormModal
              item={row.original}
              trigger={
                <button className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Pencil className="size-3.5" />
                </button>
              }
            />
            <DeleteGalleryDialog
              item={row.original}
              trigger={
                <button className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              }
            />
          </div>
        ),
      },
    ],
    [],
  );

  const filtered = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      q.length === 0 ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-6 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5" />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 shadow-sm">
              <Sparkles className="size-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">Galeri Foto</h3>
              <p className="text-sm text-muted-foreground">Kelola dokumentasi kegiatan masjid</p>
            </div>
          </div>
          <GalleryFormModal
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                Tambah Foto
              </Button>
            }
          />
        </div>

        {/* Search Filter */}
        <SearchInput value={query} placeholder="Cari judul atau kategori galeri..." onChange={setQuery} />

        {/* Table */}
        <DataTable columns={columns} data={filtered} />

        {/* Footer Info */}
        {filtered.length < items.length && (
          <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{items.length}</span> foto
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
