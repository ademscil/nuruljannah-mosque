import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  HandCoins,
  Megaphone,
  ShieldCheck,
  Users,
  Clock3,
  MapPin,
  BookOpen,
  TrendingUp,
  Building2,
  Star,
} from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { VideoHero } from "@/components/shared/video-hero";
import { Card3D } from "@/components/shared/card-3d";
import { ROUTE_PATHS } from "@/constants/routes";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { getHomepageContent } from "@/features/cms/services/homepage-content-service";

const quickLinkIcons = [CalendarDays, BookOpen, TrendingUp];
const statIcons = [CalendarDays, Megaphone, ShieldCheck];
const featureIcons = [CalendarDays, Megaphone, HandCoins, Users];
const featureStyles = [
  { iconBg: "bg-primary/8 text-primary", accent: "from-primary/5 to-transparent" },
  { iconBg: "bg-amber-50 text-amber-600", accent: "from-amber-50/60 to-transparent" },
  { iconBg: "bg-emerald-50 text-emerald-600", accent: "from-emerald-50/60 to-transparent" },
  { iconBg: "bg-violet-50 text-violet-600", accent: "from-violet-50/60 to-transparent" },
];
const serviceIcons = [Clock3, HandCoins, MapPin];
const serviceStyles = ["bg-primary/8 text-primary", "bg-amber-50 text-amber-600", "bg-teal-50 text-teal-600"];

export default async function HomePage() {
  const [cms, cmsSettings] = await Promise.all([getHomepageContent(), getCmsSettings()]);

  return (
    <div className="space-y-28">
      <VideoHero
        videoSrc={cmsSettings.contentBlocks.heroVideoUrl}
        title={cms.heroTitle}
        subtitle={cms.heroSubtitle}
        height="large"
        overlayOpacity={0.65}
      >
        <Link href={cms.heroPrimaryCtaHref} className="btn-3d">
          {cms.heroPrimaryCtaLabel}
          <ArrowRight className="size-4" />
        </Link>
        <Link href={ROUTE_PATHS.contact} className="btn-outline bg-white/10 text-white border-white/30 hover:bg-white/20">
          {cmsSettings.contentBlocks.heroSecondaryButtonLabel}
        </Link>
      </VideoHero>

      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] perspective-normal">
        <div className="space-y-8">
          <div className="badge-shimmer badge-primary">
            <Building2 className="size-3.5" />
            {cmsSettings.contentBlocks.heroBadge}
          </div>

          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/50">{cmsSettings.contentBlocks.heroEyebrow}</p>
            <h2 className="font-heading text-4xl leading-[1.05] tracking-tight md:text-5xl">{cms.welcomeTitle}</h2>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">{cms.welcomeContent}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {cmsSettings.contentBlocks.stats.map((s, idx) => {
              const Icon = statIcons[idx % statIcons.length];
              return (
                <Card3D key={`${s.label}-${idx}`} variant="magnetic" delay={idx * 0.1} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      idx % 3 === 0 ? "bg-primary/10 text-primary" : 
                      idx % 3 === 1 ? "bg-amber-50 text-amber-600" : 
                      "bg-teal-50 text-teal-600"
                    }`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-lg font-bold leading-none">{s.value}</p>
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 preserve-3d">
          <Card3D variant="glass" delay={0.2}>
            <div className="space-y-4">
              <div className="badge-amber">
                <Star className="size-3" />
                Sambutan
              </div>
              <h3 className="font-heading text-2xl leading-snug font-semibold">{cms.welcomeTitle}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{cms.welcomeContent}</p>
            </div>
          </Card3D>

          <div className="grid gap-4 sm:grid-cols-2 preserve-3d">
            <Card3D variant="magnetic" delay={0.3}>
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                <HandCoins className="size-5" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Donasi</p>
              <h3 className="mt-1.5 text-lg font-semibold leading-snug">{cms.donationCtaTitle}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{cms.donationCtaDescription}</p>
            </Card3D>
            <Card3D variant="magnetic" delay={0.4}>
              <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-transform duration-300 group-hover:scale-110">
                <MapPin className="size-5" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Lokasi</p>
              <h3 className="mt-1.5 text-lg font-semibold leading-snug">{cmsSettings.contactCity}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{cmsSettings.contactAddress}</p>
            </Card3D>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeader badge="Fitur Utama" title={cmsSettings.homeFeatureTitle} description={cmsSettings.homeFeatureDescription} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 perspective-normal">
          {cmsSettings.contentBlocks.features.map((f, i) => {
            const Icon = featureIcons[i % featureIcons.length];
            const style = featureStyles[i % featureStyles.length];
            return (
              <Card3D key={`${f.title}-${i}`} variant="magnetic" delay={i * 0.08}>
                <div className={`absolute inset-0 bg-gradient-to-br ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`inline-flex size-11 items-center justify-center rounded-2xl ${style.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-muted-foreground">{f.description}</p>
                </div>
              </Card3D>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] perspective-normal">
        <Card3D variant="elevated" className="p-8 md:p-10">
          <div className="badge-primary mb-4">Layanan Utama</div>
          <h2 className="font-heading text-3xl leading-tight font-semibold md:text-4xl">{cmsSettings.homeServiceTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{cmsSettings.homeServiceDescription}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cmsSettings.contentBlocks.services.map((s, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              const iconBg = serviceStyles[idx % serviceStyles.length];
              return (
                <div key={`${s.title}-${idx}`} className="card-3d group p-5">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.description}</p>
                </div>
              );
            })}
          </div>
        </Card3D>

        <Card3D variant="elevated" className="p-8 md:p-10">
          <div className="badge-primary mb-6">{cmsSettings.contentBlocks.quickLinksSectionBadge}</div>
          <div className="space-y-3">
            {cmsSettings.quickLinks.map((item, i) => {
              const Icon = quickLinkIcons[i % quickLinkIcons.length];
              return (
                <Link key={item.title} href={item.href} className="interactive-3d group flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-5 hover:border-primary/20 hover:bg-white transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-base font-semibold tracking-tight">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </Card3D>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-[oklch(0.22_0.04_175)] px-10 py-16 text-center md:px-16 md:py-20">
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.35_0.05_175)] bg-[oklch(0.28_0.05_175)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.68_0.14_82)]">
            <Building2 className="size-3.5" />
            {cmsSettings.contentBlocks.ctaBadge}
          </div>
          <h2 className="font-heading text-3xl font-semibold leading-tight text-white md:text-5xl">{cmsSettings.homeCtaTitle}</h2>
          <p className="mx-auto max-w-xl text-base leading-8 text-[oklch(0.72_0.03_175)]">{cmsSettings.homeCtaDescription}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={ROUTE_PATHS.events} className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.68_0.14_82)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.02_250)] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              {cmsSettings.contentBlocks.ctaPrimaryButtonLabel}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={ROUTE_PATHS.donations} className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.35_0.05_175)] bg-[oklch(0.28_0.05_175)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[oklch(0.32_0.05_175)]">
              {cmsSettings.contentBlocks.ctaSecondaryButtonLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
