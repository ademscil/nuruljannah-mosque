import { LockKeyhole } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

type AccessDeniedProps = {
  title?: string;
  description?: string;
};

export function AccessDenied({
  title = "Akses modul dibatasi",
  description = "Role akun Anda belum memiliki izin untuk membuka halaman ini. Silakan gunakan akun dengan hak akses yang sesuai.",
}: AccessDeniedProps) {
  return (
    <EmptyState
      icon={LockKeyhole}
      title={title}
      description={description}
    />
  );
}
