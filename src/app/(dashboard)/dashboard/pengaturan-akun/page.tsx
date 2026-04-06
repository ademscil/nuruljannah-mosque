import { auth } from "@/auth";
import { PageHeader } from "@/components/shared/page-header";
import { ROLE_LABELS } from "@/constants/roles";
import { AccountSettingsForm } from "@/features/settings/components/account-settings-form";
import { prisma } from "@/lib/prisma";

export default async function DashboardPengaturanAkunPage() {
  const session = await auth();
  const user =
    session?.user.id
      ? await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            name: true,
            email: true,
            phone: true,
          },
        })
      : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Pengaturan Akun"
        description="Kelola profil admin, kata sandi, dan identitas akun yang digunakan untuk masuk ke dashboard."
      />
      <AccountSettingsForm
        initialValues={{
          name: user?.name ?? session?.user.name ?? "Pengurus",
          email: user?.email ?? session?.user.email ?? "",
          phone: user?.phone ?? "",
          roleLabel: ROLE_LABELS[session?.user.role ?? "JAMAAH_UMUM"],
        }}
      />
    </div>
  );
}
