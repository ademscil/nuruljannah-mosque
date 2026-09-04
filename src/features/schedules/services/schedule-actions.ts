"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import { getPrismaActionErrorMessage } from "@/lib/prisma-action-error";
import {
  scheduleFormSchema,
  type ScheduleFormSchema,
} from "@/features/schedules/schemas/schedule-form-schema";

type ScheduleActionResult = {
  success: boolean;
  message: string;
};

export async function saveScheduleAction(
  input: ScheduleFormSchema,
): Promise<ScheduleActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "jadwal-petugas")) {
    return { success: false, message: "Anda tidak memiliki akses modul jadwal." };
  }

  const parsed = scheduleFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data jadwal belum valid." };
  }

  try {
    await prisma.schedule.upsert({
      where: {
        id: parsed.data.id ?? "__new__",
      },
      update: {
        title: parsed.data.title,
        roleType: parsed.data.roleType,
        scheduleFor: new Date(parsed.data.scheduleFor),
        timeLabel: parsed.data.timeLabel,
        personName: parsed.data.personName,
        notes: parsed.data.notes || null,
      },
      create: {
        title: parsed.data.title,
        roleType: parsed.data.roleType,
        scheduleFor: new Date(parsed.data.scheduleFor),
        timeLabel: parsed.data.timeLabel,
        personName: parsed.data.personName,
        notes: parsed.data.notes || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/jadwal-petugas");
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/jadwal-sholat");
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, message: "Jadwal berhasil disimpan." };
  } catch (error) {
    return {
      success: false,
      message: getPrismaActionErrorMessage(error, "Gagal menyimpan jadwal."),
    };
  }
}

export async function deleteScheduleAction(id: string): Promise<ScheduleActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "jadwal-petugas")) {
    return { success: false, message: "Anda tidak memiliki akses modul jadwal." };
  }

  try {
    await prisma.schedule.delete({ where: { id } });
    revalidatePath("/dashboard/jadwal-petugas");
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/jadwal-sholat");
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, message: "Jadwal berhasil dihapus." };
  } catch (error) {
    return {
      success: false,
      message: getPrismaActionErrorMessage(error, "Gagal menghapus jadwal."),
    };
  }
}
