import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { EventAdminTable } from "@/features/events/components/event-admin-table";
import { EventSummaryCards } from "@/features/events/components/event-summary-cards";
import { getEvents } from "@/features/events/services/event-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardAgendaKegiatanPage() {
  const canAccess = await hasDashboardPermission("agenda");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const events = await getEvents();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Agenda Kegiatan"
        description="Kelola agenda kegiatan, unggulan, status selesai atau dibatalkan, serta visibilitas publik dari dashboard."
      />
      <EventSummaryCards events={events} />
      <EventAdminTable events={events} />
    </div>
  );
}
