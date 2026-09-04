"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import { Sparkles, Briefcase, Calendar, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import { ResponsiveDataView } from "@/components/shared/responsive-data-view";
import { EmptyState } from "@/components/shared/empty-state";
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
import type { ManagementMemberItem } from "@/features/management/types/management";
import { deleteManagementMemberAction } from "@/features/management/services/management-actions";
import { ManagementFormModal } from "./management-form-modal";

type ManagementAdminTableProps = {
  members: ManagementMemberItem[];
};

type DeleteManagementDialogProps = {
  member: ManagementMemberItem;
  trigger: React.ReactElement;
};

function DeleteManagementDialog({ member, trigger }: DeleteManagementDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteManagementMemberAction(member.id);
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
        <AlertDialogTitle>Hapus data pengurus?</AlertDialogTitle>
        <AlertDialogDescription>
          Data pengurus <strong>{member.name}</strong> akan dihapus dan tidak akan lagi tampil di
          halaman profil masjid. Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus Pengurus"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ManagementAdminTable({
  members,
}: ManagementAdminTableProps) {
  const [query, setQuery] = useState("");

  const columns = useMemo<ColumnDef<ManagementMemberItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Pengurus",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 shadow-sm">
              <Briefcase className="size-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.position}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "termPeriod",
        header: "Periode",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-sm">{row.original.termPeriod}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Kontak",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.phone ?? "—"}
          </span>
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
            <ManagementFormModal
              member={row.original}
              trigger={
                <button className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Pencil className="size-3.5" />
                </button>
              }
            />
            <DeleteManagementDialog
              member={row.original}
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

  const filtered = members.filter((item) => {
    const q = query.toLowerCase();
    return (
      q.length === 0 ||
      item.name.toLowerCase().includes(q) ||
      item.position.toLowerCase().includes(q) ||
      item.termPeriod.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-6 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 shadow-sm">
              <Sparkles className="size-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">Data Pengurus</h3>
              <p className="text-sm text-muted-foreground">Kelola informasi kepengurusan masjid</p>
            </div>
          </div>
          <ManagementFormModal
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                Tambah Pengurus
              </Button>
            }
          />
        </div>

        {/* Search Filter */}
        <SearchInput value={query} placeholder="Cari nama, jabatan, atau periode..." onChange={setQuery} />

        {/* Table */}
        <ResponsiveDataView
          columns={columns}
          data={filtered}
          renderMobileCard={(item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-depth-sm space-y-3 transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {item.position}
                </span>
                <span className="text-xs text-muted-foreground">
                  Urutan: #{item.position}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-base text-foreground leading-snug">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Periode: {item.termPeriod}
                </p>
                {item.phone ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kontak: {item.phone}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50">
                <ManagementFormModal
                  member={item}
                  
                  trigger={
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                      <Pencil className="size-4" />
                    </Button>
                  }
                />
                <DeleteManagementDialog
                  member={item}
                  trigger={
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          )}
          emptyState={
            <EmptyState
              title="Belum ada data pengurus"
              description="Klik tombol Tambah Pengurus di atas untuk mendata jajaran takmir masjid."
            />
          }
        />

        {/* Footer Info */}
        {filtered.length < members.length && (
          <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{members.length}</span> pengurus
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
