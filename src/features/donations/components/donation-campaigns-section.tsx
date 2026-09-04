"use client";

import { useTransition } from "react";
import { Target, Pencil, Trash2, Heart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogOverlay,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatRupiah } from "@/lib/format-rupiah";
import { deleteDonationCampaignAction } from "@/features/donations/services/donation-actions";
import type { DonationCampaignItem } from "@/features/donations/types/donation";
import { CampaignFormModal } from "./campaign-form-modal";

type DonationCampaignsSectionProps = {
  campaigns: DonationCampaignItem[];
};

function DeleteCampaignDialog({ campaign }: { campaign: DonationCampaignItem }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDonationCampaignAction(campaign.id);
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
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus program donasi?</AlertDialogTitle>
          <AlertDialogDescription>
            Program donasi <span className="font-semibold">{campaign.title}</span> akan dihapus beserta
            seluruh riwayat donasi yang terhubung dengannya. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus Campaign"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DonationCampaignsSection({ campaigns }: DonationCampaignsSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-6 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-emerald-500/5" />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 shadow-sm">
              <Target className="size-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">Program Donasi</h3>
              <p className="text-sm text-muted-foreground">Kelola program dan campaign donasi</p>
            </div>
          </div>
          <CampaignFormModal />
        </div>

        {/* Campaign Cards Grid */}
        {campaigns.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm transition-all hover:shadow-depth-md"
              >
                {/* Status Badge */}
                {campaign.isActive && (
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-600">
                      Aktif
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <h4 className="font-heading text-base font-semibold line-clamp-2">
                      {campaign.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{campaign.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                        style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Heart className="size-3" />
                        Terkumpul
                      </div>
                      <p className="mt-1 font-semibold text-sm text-foreground">
                        {formatRupiah(campaign.collectedAmount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="size-3" />
                        Target
                      </div>
                      <p className="mt-1 font-semibold text-sm text-foreground">
                        {formatRupiah(campaign.targetAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-border/50 pt-4">
                    <CampaignFormModal
                      campaign={campaign}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                      }
                    />
                    <DeleteCampaignDialog campaign={campaign} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 py-12 backdrop-blur-sm">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/5">
              <Target className="size-8 text-muted-foreground" />
            </div>
            <h4 className="mt-4 font-heading text-base font-semibold">Belum ada program donasi</h4>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Tambahkan program donasi baru untuk mulai menerima donasi
            </p>
            <CampaignFormModal
              trigger={
                <Button className="mt-4" variant="outline">
                  <Target className="size-4" />
                  Tambah Program Donasi
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
