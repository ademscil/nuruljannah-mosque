import { z } from "zod";

export const managementFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nama minimal 3 karakter."),
  position: z.string().min(3, "Jabatan minimal 3 karakter."),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid.").or(z.literal("")),
  termPeriod: z.string().min(3, "Periode wajib diisi."),
  photoUrl: z.string().url("Foto harus berupa URL valid.").or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type ManagementFormSchema = z.infer<typeof managementFormSchema>;
