"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { auth } from "@/auth";
import { ROUTE_PATHS } from "@/constants/routes";
import { getPrismaActionErrorMessage } from "@/lib/prisma-action-error";
import { hasPermission } from "@/lib/role-guard";
import {
  cmsSettingsSchema,
  type CmsSettingsSchema,
} from "@/features/cms/schemas/cms-settings-schema";
import { saveCmsSettings } from "@/features/cms/services/cms-settings-service";

export type CmsSettingsActionState = {
  success: boolean;
  message: string;
};

export type CmsVideoUploadActionState = {
  success: boolean;
  message: string;
  url?: string;
};

export async function saveCmsSettingsAction(
  input: CmsSettingsSchema & { id?: string },
): Promise<CmsSettingsActionState> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "cms")) {
    return {
      success: false,
      message: "Anda tidak memiliki akses untuk mengubah CMS global.",
    };
  }

  const parsed = cmsSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Data CMS global belum valid.",
    };
  }

  try {
    await saveCmsSettings({
      id: input.id,
      ...parsed.data,
    });

    revalidatePath(ROUTE_PATHS.home);
    revalidatePath(ROUTE_PATHS.profile);
    revalidatePath(ROUTE_PATHS.contact);
    revalidatePath("/dashboard/cms-beranda");

    return {
      success: true,
      message: "CMS global berhasil disimpan.",
    };
  } catch (error) {
    return {
      success: false,
      message: getPrismaActionErrorMessage(error, "Gagal menyimpan CMS global."),
    };
  }
}

export async function uploadHeroVideoAction(
  formData: FormData,
): Promise<CmsVideoUploadActionState> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "cms")) {
    return {
      success: false,
      message: "Anda tidak memiliki akses untuk upload video.",
    };
  }

  const file = formData.get("video");
  if (!(file instanceof File)) {
    return {
      success: false,
      message: "File video tidak ditemukan.",
    };
  }

  const allowedTypes = new Set(["video/mp4", "video/webm"]);
  if (!allowedTypes.has(file.type)) {
    return {
      success: false,
      message: "Format video harus MP4 atau WEBM.",
    };
  }

  const maxBytes = 80 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      success: false,
      message: "Ukuran video maksimal 80MB.",
    };
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return {
      success: false,
      message: "Konfigurasi Supabase belum lengkap.",
    };
  }

  const supabase = createClient(url, serviceRoleKey);
  const bucket = "cms-media";

  const createBucketResult = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: maxBytes,
    allowedMimeTypes: ["video/mp4", "video/webm"],
  });

  if (createBucketResult.error && !createBucketResult.error.message.toLowerCase().includes("already")) {
    return {
      success: false,
      message: `Gagal menyiapkan bucket: ${createBucketResult.error.message}`,
    };
  }

  const ext = file.type === "video/mp4" ? "mp4" : "webm";
  const path = `hero/${Date.now()}-${randomUUID()}.${ext}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await supabase.storage.from(bucket).upload(path, fileBuffer, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadResult.error) {
    return {
      success: false,
      message: `Upload gagal: ${uploadResult.error.message}`,
    };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    success: true,
    message: "Video berhasil diupload.",
    url: data.publicUrl,
  };
}
