"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import {
  transactionFormSchema,
  type TransactionFormSchema,
} from "@/features/finance/schemas/transaction-form-schema";

type TransactionActionResult = {
  success: boolean;
  message: string;
};

export async function saveTransactionAction(
  input: TransactionFormSchema,
): Promise<TransactionActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "keuangan")) {
    return { success: false, message: "Anda tidak memiliki akses modul keuangan." };
  }

  const parsed = transactionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data transaksi belum valid." };
  }

  try {
    await prisma.transaction.upsert({
      where: { id: parsed.data.id ?? "__new__" },
      update: {
        type: parsed.data.type,
        category: parsed.data.category,
        amount: parsed.data.amount,
        transactionAt: new Date(parsed.data.transactionAt),
        description: parsed.data.description,
        attachmentUrl: parsed.data.attachmentUrl || null,
      },
      create: {
        type: parsed.data.type,
        category: parsed.data.category,
        amount: parsed.data.amount,
        transactionAt: new Date(parsed.data.transactionAt),
        description: parsed.data.description,
        attachmentUrl: parsed.data.attachmentUrl || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/keuangan");
    revalidatePath("/laporan-keuangan");
    revalidatePath("/dashboard");
    return { success: true, message: "Transaksi berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan transaksi." };
  }
}

export async function deleteTransactionAction(
  id: string,
): Promise<TransactionActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "keuangan")) {
    return { success: false, message: "Anda tidak memiliki akses modul keuangan." };
  }

  try {
    await prisma.transaction.delete({ where: { id } });
    revalidatePath("/dashboard/keuangan");
    revalidatePath("/laporan-keuangan");
    revalidatePath("/dashboard");
    return { success: true, message: "Transaksi berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus transaksi." };
  }
}
