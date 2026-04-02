"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ROUTE_PATHS } from "@/constants/routes";
import {
  homepageContentSchema,
  type HomepageContentSchema,
} from "@/features/cms/schemas/homepage-content-schema";
import { saveHomepageContent } from "@/features/cms/services/homepage-content-service";

export type HomepageActionState = {
  success: boolean;
  message: string;
};

export async function saveHomepageContentAction(
  input: HomepageContentSchema & { id?: string },
): Promise<HomepageActionState> {
  const session = await auth();
  const parsed = homepageContentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Data CMS Beranda belum valid.",
    };
  }

  try {
    await saveHomepageContent({
      id: input.id,
      ...parsed.data,
      userId: session?.user.id,
    });

    revalidatePath(ROUTE_PATHS.home);
    revalidatePath("/dashboard/cms-beranda");

    return {
      success: true,
      message: "Konten beranda berhasil disimpan.",
    };
  } catch {
    return {
      success: false,
      message:
        "Gagal menyimpan ke database. Pastikan PostgreSQL atau Supabase sudah terhubung.",
    };
  }
}
