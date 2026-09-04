"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ROUTE_PATHS } from "@/constants/routes";
import { getPrismaActionErrorMessage } from "@/lib/prisma-action-error";
import { hasPermission } from "@/lib/role-guard";
import {
  homepageContentSchema,
  type HomepageContentSchema,
} from "@/features/cms/schemas/homepage-content-schema";
import {
  getHomepageContentForCms,
  saveHomepageContent,
} from "@/features/cms/services/homepage-content-service";

export type HomepageActionState = {
  success: boolean;
  message: string;
};

export async function saveHomepageContentAction(
  input: Partial<HomepageContentSchema> & { id?: string },
): Promise<HomepageActionState> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "cms")) {
    return {
      success: false,
      message: "Anda tidak memiliki akses untuk mengubah CMS Beranda.",
    };
  }

  // Fetch current database state to support partial section updates seamlessly
  const current = await getHomepageContentForCms();

  const merged = {
    heroTitle: input.heroTitle ?? current.heroTitle,
    heroSubtitle: input.heroSubtitle ?? current.heroSubtitle,
    heroPrimaryCtaLabel: input.heroPrimaryCtaLabel ?? current.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: input.heroPrimaryCtaHref ?? current.heroPrimaryCtaHref,
    welcomeTitle: input.welcomeTitle ?? current.welcomeTitle,
    welcomeContent: input.welcomeContent ?? current.welcomeContent,
    donationCtaTitle: input.donationCtaTitle ?? current.donationCtaTitle,
    donationCtaDescription: input.donationCtaDescription ?? current.donationCtaDescription,
    featuredAnnouncementId: input.featuredAnnouncementId ?? current.featuredAnnouncementId ?? undefined,
    featuredEventId: input.featuredEventId ?? current.featuredEventId ?? undefined,
    status: input.status ?? current.status,
  };

  const parsed = homepageContentSchema.safeParse(merged);

  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ") || "Data CMS Beranda belum valid.";
    return {
      success: false,
      message: errorMsg,
    };
  }

  try {
    await saveHomepageContent({
      id: input.id ?? current.id,
      ...parsed.data,
      userId: session.user.id,
    });

    revalidatePath(ROUTE_PATHS.home);
    revalidatePath("/dashboard/cms-beranda");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Konten beranda berhasil disimpan.",
    };
  } catch (error) {
    return {
      success: false,
      message: getPrismaActionErrorMessage(
        error,
        "Gagal menyimpan ke database. Pastikan PostgreSQL atau Supabase sudah terhubung.",
      ),
    };
  }
}
