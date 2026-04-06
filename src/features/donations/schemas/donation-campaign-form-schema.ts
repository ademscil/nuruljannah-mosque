import { z } from "zod";

export const donationCampaignFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Judul campaign minimal 5 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  description: z.string().min(20, "Deskripsi minimal 20 karakter."),
  targetAmount: z.number().positive("Target dana harus lebih besar dari nol."),
  collectedAmount: z.number().min(0, "Total terkumpul tidak boleh negatif."),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  qrisImageUrl: z.string().url("QRIS harus berupa URL valid.").or(z.literal("")),
  isActive: z.boolean(),
});

export type DonationCampaignFormSchema = z.infer<typeof donationCampaignFormSchema>;

export const donationEntryFormSchema = z.object({
  id: z.string().optional(),
  donorName: z.string().min(3, "Nama donatur minimal 3 karakter."),
  donorEmail: z.string().email("Email tidak valid.").or(z.literal("")),
  donorPhone: z.string().optional(),
  amount: z.number().positive("Nominal donasi harus lebih besar dari nol."),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  donatedAt: z.string().min(1, "Tanggal donasi wajib diisi."),
  campaignId: z.string().min(1, "Campaign donasi wajib dipilih."),
  note: z.string().optional(),
});

export type DonationEntryFormSchema = z.infer<typeof donationEntryFormSchema>;

export const donationStatusFormSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  note: z.string().optional(),
});

export type DonationStatusFormSchema = z.infer<typeof donationStatusFormSchema>;
