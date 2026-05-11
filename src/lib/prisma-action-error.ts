import { Prisma } from "@prisma/client";

export function getPrismaActionErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Data duplikat terdeteksi. Pastikan nilai unik seperti slug atau email tidak sama.";
    }

    if (error.code === "P2003") {
      return "Data tidak bisa diproses karena masih terkait dengan data lain.";
    }

    if (error.code === "P2025") {
      return "Data yang dimaksud tidak ditemukan atau sudah berubah.";
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return "Data tidak valid untuk disimpan ke database.";
  }

  return fallbackMessage;
}
