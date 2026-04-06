import { z } from "zod";

export const transactionFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(3, "Kategori minimal 3 karakter."),
  amount: z.number().positive("Nominal harus lebih besar dari nol."),
  transactionAt: z.string().min(1, "Tanggal transaksi wajib diisi."),
  description: z.string().min(5, "Keterangan minimal 5 karakter."),
  attachmentUrl: z
    .string()
    .url("Lampiran harus berupa URL valid.")
    .or(z.literal("")),
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;
