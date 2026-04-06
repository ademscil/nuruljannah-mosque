"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import {
  donationCampaignFormSchema,
  donationEntryFormSchema,
  donationStatusFormSchema,
  type DonationCampaignFormSchema,
  type DonationEntryFormSchema,
  type DonationStatusFormSchema,
} from "@/features/donations/schemas/donation-campaign-form-schema";

type DonationActionResult = {
  success: boolean;
  message: string;
};

async function syncCampaignCollectedAmount(campaignId: string) {
  const aggregate = await prisma.donation.aggregate({
    where: {
      campaignId,
      status: "CONFIRMED",
    },
    _sum: {
      amount: true,
    },
  });

  await prisma.donationCampaign.update({
    where: { id: campaignId },
    data: {
      collectedAmount: aggregate._sum.amount ?? 0,
    },
  });
}

export async function saveDonationCampaignAction(
  input: DonationCampaignFormSchema,
): Promise<DonationActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "donasi")) {
    return { success: false, message: "Anda tidak memiliki akses modul donasi." };
  }

  const parsed = donationCampaignFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data campaign belum valid." };
  }

  try {
    await prisma.donationCampaign.upsert({
      where: { id: parsed.data.id ?? "__new__" },
      update: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        targetAmount: parsed.data.targetAmount,
        collectedAmount: parsed.data.collectedAmount,
        bankAccountName: parsed.data.bankAccountName || null,
        bankAccountNumber: parsed.data.bankAccountNumber || null,
        qrisImageUrl: parsed.data.qrisImageUrl || null,
        isActive: parsed.data.isActive,
      },
      create: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        targetAmount: parsed.data.targetAmount,
        collectedAmount: parsed.data.collectedAmount,
        bankAccountName: parsed.data.bankAccountName || null,
        bankAccountNumber: parsed.data.bankAccountNumber || null,
        qrisImageUrl: parsed.data.qrisImageUrl || null,
        isActive: parsed.data.isActive,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/donasi");
    revalidatePath("/donasi");
    revalidatePath("/dashboard");
    return { success: true, message: "Campaign donasi berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan campaign donasi." };
  }
}

export async function deleteDonationCampaignAction(
  id: string,
): Promise<DonationActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "donasi")) {
    return { success: false, message: "Anda tidak memiliki akses modul donasi." };
  }

  try {
    await prisma.donationCampaign.delete({ where: { id } });

    revalidatePath("/dashboard/donasi");
    revalidatePath("/donasi");
    revalidatePath("/dashboard");
    return { success: true, message: "Campaign donasi berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus campaign donasi." };
  }
}

export async function saveDonationEntryAction(
  input: DonationEntryFormSchema,
): Promise<DonationActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "donasi")) {
    return { success: false, message: "Anda tidak memiliki akses modul donasi." };
  }

  const parsed = donationEntryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data donasi belum valid." };
  }

  try {
    await prisma.donation.upsert({
      where: { id: parsed.data.id ?? "__new__" },
      update: {
        donorName: parsed.data.donorName,
        donorEmail: parsed.data.donorEmail || null,
        donorPhone: parsed.data.donorPhone || null,
        amount: parsed.data.amount,
        status: parsed.data.status,
        note: parsed.data.note || null,
        donatedAt: new Date(parsed.data.donatedAt),
        campaignId: parsed.data.campaignId,
        recordedById: session.user.id,
      },
      create: {
        donorName: parsed.data.donorName,
        donorEmail: parsed.data.donorEmail || null,
        donorPhone: parsed.data.donorPhone || null,
        amount: parsed.data.amount,
        status: parsed.data.status,
        note: parsed.data.note || null,
        donatedAt: new Date(parsed.data.donatedAt),
        campaignId: parsed.data.campaignId,
        recordedById: session.user.id,
      },
    });

    await syncCampaignCollectedAmount(parsed.data.campaignId);

    revalidatePath("/dashboard/donasi");
    revalidatePath("/donasi");
    revalidatePath("/dashboard");
    return { success: true, message: "Data donasi berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan data donasi." };
  }
}

export async function deleteDonationEntryAction(
  id: string,
): Promise<DonationActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "donasi")) {
    return { success: false, message: "Anda tidak memiliki akses modul donasi." };
  }

  try {
    const donation = await prisma.donation.delete({
      where: { id },
      select: { campaignId: true },
    });

    await syncCampaignCollectedAmount(donation.campaignId);

    revalidatePath("/dashboard/donasi");
    revalidatePath("/donasi");
    revalidatePath("/dashboard");
    return { success: true, message: "Data donasi berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus data donasi." };
  }
}

export async function updateDonationStatusAction(
  input: DonationStatusFormSchema,
): Promise<DonationActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "donasi")) {
    return { success: false, message: "Anda tidak memiliki akses modul donasi." };
  }

  const parsed = donationStatusFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data status donasi belum valid." };
  }

  try {
    await prisma.donation.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        note: parsed.data.note || null,
        recordedById: session.user.id,
      },
    });

    const donation = await prisma.donation.findUnique({
      where: { id: parsed.data.id },
      select: { campaignId: true },
    });

    if (donation?.campaignId) {
      await syncCampaignCollectedAmount(donation.campaignId);
    }

    revalidatePath("/dashboard/donasi");
    revalidatePath("/donasi");
    revalidatePath("/dashboard");
    return { success: true, message: "Status donasi berhasil diperbarui." };
  } catch {
    return { success: false, message: "Gagal memperbarui status donasi." };
  }
}
