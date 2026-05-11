import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { EventPublicList } from "@/features/events/components/event-public-list";
import { getPublicEvents } from "@/features/events/services/event-service";

export default async function AgendaKegiatanPage() {
  const [events, cms] = await Promise.all([getPublicEvents(), getCmsSettings()]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={cms.contentBlocks.pageCopy.agendaTitle}
        description={cms.contentBlocks.pageCopy.agendaDescription}
      />
      <EventPublicList events={events} />
    </div>
  );
}
