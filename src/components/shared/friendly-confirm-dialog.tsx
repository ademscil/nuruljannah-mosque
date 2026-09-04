"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

export interface FriendlyConfirmDialogProps {
  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  trigger?: React.ReactElement;
}

export function FriendlyConfirmDialog({
  title = "Konfirmasi Penghapusan",
  description = "Tindakan ini akan menghapus data secara permanen. Pastikan data yang dipilih sudah benar.",
  itemName,
  confirmLabel = "Ya, Hapus Sekarang",
  cancelLabel = "Batal",
  isPending = false,
  onConfirm,
  trigger,
}: FriendlyConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={(props) =>
          trigger ? (
            React.cloneElement(trigger, props)
          ) : (
            <Button
              {...props}
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Hapus
            </Button>
          )
        }
      />
      <AlertDialogContent className="max-w-md rounded-2xl p-6">
        <AlertDialogHeader className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-sm text-muted-foreground">
            <span>{description}</span>
            {itemName && (
              <span className="block rounded-lg bg-muted p-2 font-medium text-foreground">
                &ldquo;{itemName}&rdquo;
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isPending} className="rounded-xl">
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-xl font-semibold"
          >
            {isPending ? "Menghapus..." : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

