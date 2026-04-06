import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { ManagementAdminTable } from "@/features/management/components/management-admin-table";
import { ManagementFormPanel } from "@/features/management/components/management-form-panel";
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
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ManagementAdminTable members={members} />
        <ManagementFormPanel members={members} />
      </div>
    </div>
  );
}
