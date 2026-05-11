"use server";

import { revalidatePath } from "next/cache";

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
