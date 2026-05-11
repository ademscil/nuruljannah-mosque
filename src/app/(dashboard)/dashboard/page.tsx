import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { AccessDenied } from "@/components/shared/access-denied";
import { canAccessDashboardOverview } from "@/lib/dashboard-access";

export default async function DashboardPage() {
  const canAccess = await canAccessDashboardOverview();
  if (!canAccess) {
    return <AccessDenied />;
  }

  return <DashboardOverview />;
}
