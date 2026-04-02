import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { PageHeader } from "@/components/shared/page-header";
import { EventAdminTable } from "@/features/events/components/event-admin-table";
import { EventSummaryCards } from "@/features/events/components/event-summary-cards";
import { getEvents } from "@/features/events/services/event-service";

export default async function DashboardAgendaKegiatanPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Agenda Kegiatan"
        description="Kelola agenda kegiatan, unggulan, status selesai atau dibatalkan, serta visibilitas publik dari dashboard."
      />
      <EventSummaryCards events={events} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <EventAdminTable events={events} />
        <ContentPreviewCard
          eyebrow="Tahap Lanjut"
          title="Form CRUD Agenda"
          description="Tahap berikutnya saya bisa menambahkan form buat agenda baru, edit status, pengaturan unggulan, dan upload poster kegiatan."
        />
      </div>
    </div>
  );
}
