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
      <section className="card-hero hero-surface islamic-grid relative overflow-hidden rounded-[2rem] px-8 py-14 md:px-12 md:py-20">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src={cmsSettings.contentBlocks.heroVideoUrl} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-[oklch(0.16_0.02_255_/_0.52)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.02_250_/_0.65)] via-[oklch(0.15_0.02_250_/_0.35)] to-transparent" />

        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="animate-fade-up">
              <div className="badge-shimmer badge-primary">
                <Building2 className="size-3.5" />
                {cmsSettings.contentBlocks.heroBadge}
              </div>
            </div>

            <div className="animate-fade-up delay-100 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/50">{cmsSettings.contentBlocks.heroEyebrow}</p>
              <h1 className="font-heading text-5xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-[4.25rem]">{cms.heroTitle}</h1>
              <p className="max-w-lg text-lg leading-8 text-white/85">{cms.heroSubtitle}</p>
            </div>

            <div className="animate-fade-up delay-200 flex flex-wrap gap-3">
              <Link href={cms.heroPrimaryCtaHref} className="btn-primary">
                {cms.heroPrimaryCtaLabel}
                <ArrowRight className="size-4" />
              </Link>
              <Link href={ROUTE_PATHS.contact} className="btn-outline">
                {cmsSettings.contentBlocks.heroSecondaryButtonLabel}
              </Link>
            </div>

            <div className="animate-fade-up delay-300 grid gap-3 sm:grid-cols-3">
              {cmsSettings.contentBlocks.stats.map((s, idx) => {
                const Icon = statIcons[idx % statIcons.length];
                const iconBg = idx % 3 === 0 ? "bg-primary/10" : idx % 3 === 1 ? "bg-amber-50" : "bg-teal-50";
                const iconColor = idx % 3 === 0 ? "text-primary" : idx % 3 === 1 ? "text-amber-600" : "text-teal-600";
                return (
                  <div key={`${s.label}-${idx}`} className="glass-card flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-0.5">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                      <Icon className={`size-4 ${iconColor}`} />
                    </div>
                    <div>
                      <p className="text-lg font-bold leading-none text-white">{s.value}</p>
                      <p className="mt-1 text-[11px] font-medium text-white/70">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="animate-slide-left delay-200 space-y-4">
            <div className="card-hero overflow-hidden p-0">
              <div className="relative bg-[oklch(0.18_0.02_250_/_0.56)] p-8 backdrop-blur-sm">
                <div className="relative space-y-4">
                  <div className="badge-amber">
                    <Star className="size-3" />
                    Sambutan
                  </div>
                  <h2 className="font-heading text-2xl leading-snug font-semibold text-white">{cms.welcomeTitle}</h2>
                  <p className="text-sm leading-7 text-white/80">{cms.welcomeContent}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card-elevated group cursor-default border-white/20 bg-[oklch(0.18_0.02_250_/_0.56)] p-5 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                  <HandCoins className="size-5" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Donasi</p>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug">{cms.donationCtaTitle}</h3>
                <p className="mt-2 text-xs leading-6 text-white/75">{cms.donationCtaDescription}</p>
              </div>
              <div className="card-elevated group cursor-default border-white/20 bg-[oklch(0.18_0.02_250_/_0.56)] p-5 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="size-5" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Lokasi</p>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug">{cmsSettings.contactCity}</h3>
                <p className="mt-2 text-xs leading-6 text-white/75">{cmsSettings.contactAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeader badge="Fitur Utama" title={cmsSettings.homeFeatureTitle} description={cmsSettings.homeFeatureDescription} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cmsSettings.contentBlocks.features.map((f, i) => {
            const Icon = featureIcons[i % featureIcons.length];
            const style = featureStyles[i % featureStyles.length];
            return (
              <article key={`${f.title}-${i}`} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-up card-elevated group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_oklch(0.18_0.018_250_/_0.16)]">
                <div className={`absolute inset-0 bg-gradient-to-br ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`inline-flex size-11 items-center justify-center rounded-2xl ${style.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-muted-foreground">{f.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card-hero p-8 md:p-10">
          <div className="badge-primary mb-4">Layanan Utama</div>
          <h2 className="font-heading text-3xl leading-tight font-semibold md:text-4xl">{cmsSettings.homeServiceTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{cmsSettings.homeServiceDescription}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cmsSettings.contentBlocks.services.map((s, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              const iconBg = serviceStyles[idx % serviceStyles.length];
              return (
                <div key={`${s.title}-${idx}`} className="card-base group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-hero p-8 md:p-10">
          <div className="badge-primary mb-6">{cmsSettings.contentBlocks.quickLinksSectionBadge}</div>
          <div className="space-y-3">
            {cmsSettings.quickLinks.map((item, i) => {
              const Icon = quickLinkIcons[i % quickLinkIcons.length];
              return (
                <Link key={item.title} href={item.href} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-up group flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-5 transition-all duration-200 hover:border-primary/20 hover:bg-white hover:shadow-[0_8px_24px_-12px_oklch(0.18_0.018_250_/_0.1)]">
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
        </div>
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
