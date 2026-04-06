"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  accountSettingsSchema,
  type AccountSettingsSchema,
} from "@/features/settings/schemas/account-settings-schema";

type AccountSettingsActionResult = {
  success: boolean;
  message: string;
};

export async function saveAccountSettingsAction(
  input: AccountSettingsSchema,
): Promise<AccountSettingsActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Sesi login tidak ditemukan." };
  }

  const parsed = accountSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Data akun belum valid." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        ...(parsed.data.password
          ? {
              passwordHash: await hash(parsed.data.password, 10),
            }
          : {}),
      },
    });

    revalidatePath("/dashboard/pengaturan-akun");
    return { success: true, message: "Pengaturan akun berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan pengaturan akun." };
  }
}
