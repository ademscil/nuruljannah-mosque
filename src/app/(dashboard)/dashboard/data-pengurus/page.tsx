import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { ManagementAdminTable } from "@/features/management/components/management-admin-table";
import { getManagementMembers } from "@/features/management/services/management-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardDataPengurusPage() {
  const canAccess = await hasDashboardPermission("pengurus");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const members = await getManagementMembers();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Data Pengurus"
        description="Kelola daftar pengurus, jabatan, kontak, periode, dan kesiapan publikasinya."
      />
      <ManagementAdminTable members={members} />
    </div>
  );
}
