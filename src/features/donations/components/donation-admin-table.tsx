"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import { Heart, Sparkles, Tag, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ResponsiveDataView } from "@/components/shared/responsive-data-view";
import { EmptyState } from "@/components/shared/empty-state";
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
import { formatRupiah } from "@/lib/format-rupiah";
import { deleteDonationEntryAction } from "@/features/donations/services/donation-actions";
import type { DonationCampaignItem, DonationListItem } from "@/features/donations/types/donation";
import { DonationEntryFormModal } from "./donation-entry-form-modal";

type DonationAdminTableProps = {
  campaigns: DonationCampaignItem[];
  donations: DonationListItem[];
};

const statusLabelMap = {
  PENDING: "Menunggu",
  CONFIRMED: "Terkonfirmasi",
  CANCELLED: "Dibatalkan",
} as const;

function DeleteDonationDialog({ donation }: { donation: DonationListItem }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDonationEntryAction(donation.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={(props) => (
          <Button {...props} variant="ghost" size="icon">
            <Trash2 className="size-4" />
          </Button>
        )}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus data donasi?</AlertDialogTitle>
          <AlertDialogDescription>
            Data donasi dari <span className="font-semibold">{donation.donorName}</span> akan dihapus
            dan total terkumpul campaign akan diperbarui. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus Donasi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DonationAdminTable({
  campaigns,
  donations,
}: DonationAdminTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [campaign, setCampaign] = useState("ALL");

  const columns = useMemo<ColumnDef<DonationListItem>[]>(
    () => [
      {
        accessorKey: "donorName",
        header: "Donatur",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/10 shadow-sm">
              <Heart className="size-4 text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{row.original.donorName}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="size-3" />
                {row.original.campaignTitle}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Nominal",
        cell: ({ row }) => (
          <span className="font-semibold text-primary">
            {formatRupiah(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            label={statusLabelMap[row.original.status]}
            value={
              row.original.status === "CONFIRMED"
                ? "PUBLISHED"
                : row.original.status === "PENDING"
                  ? "DRAFT"
                  : "ARCHIVED"
            }
          />
        ),
      },
      {
        accessorKey: "donatedAt",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDateIndonesia(row.original.donatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DonationEntryFormModal
              campaigns={campaigns}
              donation={row.original}
              trigger={
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              }
            />
            <DeleteDonationDialog donation={row.original} />
          </div>
        ),
      },
    ],
    [campaigns],
  );

  const filteredData = donations.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.donorName.toLowerCase().includes(query.toLowerCase()) ||
      item.campaignTitle.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "ALL" || item.status === status;
    const matchesCampaign =
      campaign === "ALL" || item.campaignTitle === campaign;

    return matchesQuery && matchesStatus && matchesCampaign;
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-6 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-purple-500/5" />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/10 shadow-sm">
              <Sparkles className="size-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">Data Donasi</h3>
              <p className="text-sm text-muted-foreground">Kelola dan verifikasi donasi masuk</p>
            </div>
          </div>
          <div className="w-full sm:w-auto shrink-0"><DonationEntryFormModal campaigns={campaigns} /></div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 xl:grid-cols-[1fr_200px_200px]">
          <SearchInput value={query} placeholder="Cari donatur atau campaign..." onChange={setQuery} />
          <FilterSelect 
            placeholder="Filter status" 
            value={status} 
            onValueChange={setStatus} 
            options={[
              { label: "Semua Status", value: "ALL" },
              { label: "Menunggu", value: "PENDING" },
              { label: "Terkonfirmasi", value: "CONFIRMED" },
              { label: "Dibatalkan", value: "CANCELLED" },
            ]} 
          />
          <FilterSelect 
            placeholder="Filter campaign" 
            value={campaign} 
            onValueChange={setCampaign} 
            options={[
              { label: "Semua Campaign", value: "ALL" },
              ...campaigns.map((item) => ({ label: item.title, value: item.title })),
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
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {item.campaignTitle}
                </span>
                <StatusBadge
                  label={statusLabelMap[item.status]}
                  value={
                    item.status === "CONFIRMED"
                      ? "PUBLISHED"
                      : item.status === "CANCELLED"
                        ? "ARCHIVED"
                        : "DRAFT"
                  }
                />
              </div>

              <div>
                <p className="font-heading text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(item.amount)}
                </p>
                <h4 className="font-medium text-sm text-foreground">
                  {item.donorName}
                </h4>
                {item.note ? (
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    &quot;{item.note}&quot;
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {formatDateIndonesia(item.donatedAt)}
                </span>
                <div className="flex items-center gap-1">
                  <DonationEntryFormModal campaigns={campaigns} donation={item}  />
                  <DeleteDonationDialog donation={item} />
                </div>
              </div>
            </div>
          )}
          emptyState={
            <EmptyState
              title="Belum ada transaksi donasi"
              description="Catatan infaq dan donasi jamaah akan muncul di sini."
            />
          }
        />

        {/* Footer Info */}
        {filteredData.length < donations.length && (
          <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filteredData.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{donations.length}</span> donasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
