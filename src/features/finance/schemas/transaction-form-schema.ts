import { z } from "zod";

const isValidDateString = (value: string) => !Number.isNaN(new Date(value).getTime());

export const transactionFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(3, "Kategori minimal 3 karakter."),
  amount: z.number().positive("Nominal harus lebih besar dari nol."),
  transactionAt: z
    .string()
    .min(1, "Tanggal transaksi wajib diisi.")
    .refine(isValidDateString, "Tanggal transaksi tidak valid."),
  description: z.string().min(5, "Keterangan minimal 5 karakter."),
  attachmentUrl: z
    .string()
    .refine(
      (val) => !val || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/") || val.startsWith("/"),
      "Lampiran harus berupa URL atau berkas gambar valid.",
    )
    .or(z.literal("")),
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;
