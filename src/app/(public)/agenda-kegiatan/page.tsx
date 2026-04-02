import { PageHeader } from "@/components/shared/page-header";
import { EventPublicList } from "@/features/events/components/event-public-list";
import { getEvents } from "@/features/events/services/event-service";

export default async function AgendaKegiatanPage() {
  const events = await getEvents();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Agenda Kegiatan"
        description="Daftar kegiatan masjid yang dipublikasikan dari CMS agenda internal pengurus."
      />
      <EventPublicList events={events} />
    </div>
  );
}
