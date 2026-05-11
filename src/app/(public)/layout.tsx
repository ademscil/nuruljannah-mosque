import { PublicFooter } from "@/components/layouts/public-footer";
import { PublicHeader } from "@/components/layouts/public-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cmsSettings = await getCmsSettings();

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader
        siteShortName={cmsSettings.siteShortName}
        siteTagline={cmsSettings.siteTagline}
        nav={cmsSettings.publicNav}
      />
      <main className="mx-auto min-h-[calc(100vh-200px)] max-w-[88rem] px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
      <PublicFooter
        siteName={cmsSettings.siteName}
        contactAddress={cmsSettings.contactAddress}
        contactEmail={cmsSettings.contactEmail}
        contactPhone={cmsSettings.contactPhone}
        contactMapUrl={cmsSettings.contactMapUrl}
        footerDescription={cmsSettings.footerDescription}
        footerCopyright={cmsSettings.footerCopyright}
      />
    </div>
  );
}
