"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import { eventFormSchema, type EventFormSchema } from "@/features/events/schemas/event-form-schema";

type EventActionResult = {
  success: boolean;
  message: string;
};

export async function saveEventAction(
  input: EventFormSchema,
): Promise<EventActionResult> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "agenda")) {
    return { success: false, message: "Anda tidak memiliki akses modul agenda." };
  }

  const parsed = eventFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data agenda belum valid." };
  }

  try {
    await prisma.event.upsert({
      where: {
        id: parsed.data.id ?? "__new__",
      },
      update: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        date: new Date(parsed.data.date),
        timeLabel: parsed.data.timeLabel,
        location: parsed.data.location,
        personInCharge: parsed.data.personInCharge,
        status: parsed.data.status,
        isPublic: parsed.data.isPublic,
        isFeatured: parsed.data.isFeatured,
        posterUrl: parsed.data.posterUrl || null,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
      create: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        date: new Date(parsed.data.date),
        timeLabel: parsed.data.timeLabel,
        location: parsed.data.location,
        personInCharge: parsed.data.personInCharge,
        status: parsed.data.status,
        isPublic: parsed.data.isPublic,
        isFeatured: parsed.data.isFeatured,
        posterUrl: parsed.data.posterUrl || null,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/agenda-kegiatan");
    revalidatePath("/agenda-kegiatan");
    return { success: true, message: "Agenda berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan agenda." };
  }
}

export async function deleteEventAction(id: string): Promise<EventActionResult> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "agenda")) {
    return { success: false, message: "Anda tidak memiliki akses modul agenda." };
  }

  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/dashboard/agenda-kegiatan");
    revalidatePath("/agenda-kegiatan");
    return { success: true, message: "Agenda berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus agenda." };
  }
}
