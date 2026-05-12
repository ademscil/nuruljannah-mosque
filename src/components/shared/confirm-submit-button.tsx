"use client";

import { LoaderCircle } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = {
  title: string;
  description: string;
  label: string;
  confirmLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export function ConfirmSubmitButton({
  title,
  description,
  label,
  confirmLabel = "Ya, Simpan",
  pendingLabel = "Menyimpan...",
  isPending = false,
  onConfirm,
}: ConfirmSubmitButtonProps) {
  return (
    <ConfirmDialog
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      trigger={
        <Button type="button" disabled={isPending} className="btn-primary">
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {pendingLabel}
            </>
          ) : (
            label
          )}
        </Button>
      }
    />
  );
}
