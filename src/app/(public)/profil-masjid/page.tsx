import { Target, Heart, Building2, CheckCircle2 } from "lucide-react";

import { PublicPageTemplate } from "@/features/public/components/public-page-template";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { ManagementPublicGrid } from "@/features/management/components/management-public-grid";
import { getPublicManagementMembers } from "@/features/management/services/management-service";

export default async function ProfilMasjidPage() {
  const [members, cmsSettings] = await Promise.all([
    getPublicManagementMembers(),
    getCmsSettings(),
  ]);

  return (
    <PublicPageTemplate
      title={cmsSettings.profileTitle}
      description={cmsSettings.profileDescription}
      sidebarTitle={cmsSettings.profileSidebarTitle}
      sidebarDescription={cmsSettings.profileSidebarDescription}
      sidebarItems={cmsSettings.profileSidebarItems}
    >
      <div className="card-3d-depth p-8">
        <div className="badge-primary mb-4">{cmsSettings.contentBlocks.profileAboutTitle}</div>
        <h2 className="font-heading text-3xl font-semibold leading-snug">{cmsSettings.contentBlocks.profileAboutHeading}</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">{cmsSettings.contentBlocks.profileAboutContent}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 perspective-normal">
        <div className="card-3d animate-card-entry group p-6">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110">
            <Target className="size-5" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">{cmsSettings.contentBlocks.profileVisionTitle}</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{cmsSettings.contentBlocks.profileVisionContent}</p>
        </div>
        <div className="card-3d animate-card-entry delay-100 group p-6">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
            <Heart className="size-5" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">{cmsSettings.contentBlocks.profileMissionTitle}</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{cmsSettings.contentBlocks.profileMissionContent}</p>
        </div>
      </div>

      <div className="card-3d p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Fasilitas</p>
            <h3 className="text-lg font-semibold">{cmsSettings.contentBlocks.profileFacilitiesHeading}</h3>
          </div>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {cmsSettings.profileFacilities.map((item) => (
            <div key={item} className="interactive-3d flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm transition-colors hover:bg-white">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="badge-primary mb-3">{cmsSettings.contentBlocks.profileManagementBadge}</div>
          <h3 className="font-heading text-2xl font-semibold">{cmsSettings.contentBlocks.profileManagementHeading}</h3>
        </div>
        <ManagementPublicGrid members={members} />
      </div>
    </PublicPageTemplate>
  );
}
