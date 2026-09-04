"use server";

import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";

export type ImageUploadResult = {
  success: boolean;
  message: string;
  url?: string;
};

export async function uploadImageAction(
  formData: FormData,
  folder = "images",
): Promise<ImageUploadResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Silakan login terlebih dahulu untuk mengunggah gambar.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return {
      success: false,
      message: "Berkas gambar tidak ditemukan.",
    };
  }

  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);

  if (!allowedTypes.has(file.type)) {
    return {
      success: false,
      message: "Format gambar harus JPG, PNG, atau WebP.",
    };
  }

  const maxBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxBytes) {
    return {
      success: false,
      message: "Ukuran gambar melebihi batas 10MB.",
    };
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase service role key is configured, upload to Supabase storage
  if (url && serviceRoleKey) {
    try {
      const supabase = createClient(url, serviceRoleKey);
      const bucket = "cms-media";

      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: maxBytes,
        allowedMimeTypes: Array.from(allowedTypes),
      });

      const extension = file.name.split(".").pop() ?? "webp";
      const fileName = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (upload.error) {
        return {
          success: false,
          message: `Gagal upload ke storage: ${upload.error.message}`,
        };
      }

      const publicUrl = supabase.storage.from(bucket).getPublicUrl(fileName).data
        .publicUrl;

      return {
        success: true,
        message: "Gambar berhasil diunggah.",
        url: publicUrl,
      };
    } catch {
      // Fallback
    }
  }

  // Fallback: Convert to optimized data URL if cloud storage is not connected
  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return {
      success: true,
      message: "Gambar berhasil disimpan.",
      url: dataUrl,
    };
  } catch {
    return {
      success: false,
      message: "Gagal memproses berkas gambar.",
    };
  }
}

