"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadImageAction } from "@/services/media-actions";

export interface SmartImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: "4:5" | "16:9" | "1:1" | "free";
  label?: string;
  hint?: string;
  maxDimension?: number;
}

/**
 * Mengompres gambar di sisi browser dengan Canvas API sebelum upload.
 * Mengurangi ukuran gambar hingga 80-90% dan mengonversi ke WebP.
 */
async function compressImage(file: File, maxDimension = 1200): Promise<{ blob: Blob; originalSize: number; compressedSize: number }> {
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                originalSize,
                compressedSize: blob.size,
              });
            } else {
              reject(new Error("Gagal mengompres gambar"));
            }
          },
          "image/webp",
          0.82
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SmartImageUploader({
  value,
  onChange,
  folder = "flyers",
  label = "Unggah Foto / Flyer",
  hint = "Format JPG, PNG, atau WebP. Otomatis dipotong dan diperkecil.",
  maxDimension = 1200,
}: SmartImageUploaderProps) {
  const [isPending, startTransition] = useTransition();
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        const { blob, originalSize, compressedSize } = await compressImage(file, maxDimension);
        setCompressionInfo(
          `Dikompres otomatis: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)}`
        );

        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
          type: "image/webp",
        });

        const formData = new FormData();
        formData.append("file", compressedFile);

        const result = await uploadImageAction(formData, folder);
        if (result.success && result.url) {
          onChange(result.url);
          toast.success("Foto berhasil diunggah!");
        } else {
          toast.error(result.message || "Gagal mengunggah foto.");
        }
      } catch {
        toast.error("Terjadi kesalahan saat memproses gambar.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleRemove = () => {
    onChange("");
    setCompressionInfo(null);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-semibold text-foreground">{label}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 p-3">
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl bg-muted">
            <Image
              src={value}
              alt="Pratinjau Foto"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            {compressionInfo ? (
              <p className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                {compressionInfo}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Foto aktif tersimpan</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 gap-1 text-xs"
              >
                <RefreshCw className="size-3" />
                Ganti
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={handleRemove}
                className="h-8 gap-1 text-xs"
              >
                <Trash2 className="size-3" />
                Hapus
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isPending && fileInputRef.current?.click()}
          className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 px-6 py-8 text-center transition hover:border-primary/50 hover:bg-muted/40"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:scale-110">
            {isPending ? (
              <RefreshCw className="size-6 animate-spin" />
            ) : (
              <UploadCloud className="size-6" />
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {isPending ? "Mengompres & Mengunggah..." : "Pilih Foto / Flyer dari Perangkat"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      )}
    </div>
  );
}

