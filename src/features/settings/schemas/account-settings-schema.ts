import { z } from "zod";

export const accountSettingsSchema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter."),
    email: z.string().email("Email tidak valid."),
    phone: z.string().optional(),
    password: z.string().min(8, "Password baru minimal 8 karakter.").or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password === data.confirmPassword,
    {
      message: "Konfirmasi password tidak sesuai.",
      path: ["confirmPassword"],
    },
  );

export type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;
