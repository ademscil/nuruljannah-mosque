import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  QrCode,
  Building2,
  HandCoins,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

import { VideoHero } from "@/components/shared/video-hero";
import { ROUTE_PATHS } from "@/constants/routes";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { getHomepageContent } from "@/features/cms/services/homepage-content-service";
import { PrayerTimesWidget } from "@/features/prayer-times/components/prayer-times-widget";
import { getTodayPrayerTimes } from "@/features/prayer-times/services/prayer-time-service";
import { WeeklyTransparencyCard } from "@/features/finance/components/weekly-transparency-card";
import { getWeeklyCashReport } from "@/features/finance/repositories/transaction-repository";
import { FeaturedEventsSection } from "@/features/events/components/featured-events-section";
import { getPublicEvents } from "@/features/events/services/event-service";

export default async function HomePage() {
  const [cms, cmsSettings, prayerTimes, weeklyCashReport, publicEvents] = await Promise.all([
    getHomepageContent(),
    getCmsSettings(),
    Promise.resolve(getTodayPrayerTimes()),
    getWeeklyCashReport(),
    getPublicEvents(),
  ]);

  const heroVideo =
    cmsSettings.contentBlocks?.heroVideoUrl &&
    !cmsSettings.contentBlocks.heroVideoUrl.includes("BigBuckBunny")
      ? cmsSettings.contentBlocks.heroVideoUrl
      : "/videos/hero-mosque.webm";

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section Video & Sambutan */}
      <VideoHero
        videoSrc={heroVideo}
        title={cms.heroTitle || "Selamat Datang di Masjid Nurul Jannah"}
        subtitle={
          cms.heroSubtitle ||
          "Pusat Ibadah, Pembinaan Umat, dan Kemakmuran Sosial di Kota Pangkal Pinang"
        }
        height="large"
        overlayOpacity={0.42}
      >
        <Link href={cms.heroPrimaryCtaHref || ROUTE_PATHS.donations} className="btn-primary">
          {cms.heroPrimaryCtaLabel || "Salurkan Infaq & Sedekah"}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={ROUTE_PATHS.contact}
          className="btn-outline bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md"
        >
          {cmsSettings.contentBlocks.heroSecondaryButtonLabel || "Lokasi & Kontak"}
        </Link>
      </VideoHero>

      {/* 2. Jadwal Salat Real-time */}
      <section className="relative -mt-10 sm:-mt-16 z-20">
        <PrayerTimesWidget initialSchedule={prayerTimes} />
      </section>

      {/* 3. Transparansi Kas Terbuka */}
      <section>
        <WeeklyTransparencyCard report={weeklyCashReport} />
      </section>

      {/* 4. Agenda Kajian & Majelis Ilmu */}
      <section>
        <FeaturedEventsSection events={publicEvents} />
      </section>

      {/* 5. Infaq Digital QRIS & Rekening Bank */}
      <section className="card-craft p-6 sm:p-10 lg:p-12 overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <HandCoins className="size-3.5" />
              <span>Kemudahan Infaq & Sedekah</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {cms.donationCtaTitle || "Tunaikan Infaq Terbaik untuk Kemakmuran Masjid"}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {cms.donationCtaDescription ||
                "Setiap rupiah yang Anda salurkan digunakan secara amanah untuk operasional masjid, santunan dhuafa, dan kegiatan dakwah ummat."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-muted/30 p-4 transition-colors hover:border-primary/40">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Bank Syariah Indonesia (BSI)</p>
                  <p className="font-mono text-base font-bold text-foreground tracking-wide tabular-nums">712-3456-789</p>
                  <p className="text-[11px] text-muted-foreground">a.n. DKM Masjid Nurul Jannah</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-muted/30 p-4 transition-colors hover:border-primary/40">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Alamat Masjid</p>
                  <p className="truncate text-sm font-semibold text-foreground">{cmsSettings.contactAddress}</p>
                  <p className="text-[11px] text-muted-foreground">{cmsSettings.contactCity}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={ROUTE_PATHS.donations}
                className="btn-primary"
              >
                Pilihan Program Donasi & Konfirmasi
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-muted/20 p-8 text-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 shadow-sm">
              <QrCode className="size-12" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">QRIS Standar Bank Indonesia</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-sm">
              Pindai melalui seluruh aplikasi Mobile Banking (BSI, BCA, Mandiri, BRI) dan Dompet Digital (GoPay, OVO, ShopeePay, DANA).
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
              <span>Rekening Resmi Terverifikasi DKM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Layanan Jamaah */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <HeartHandshake className="size-3.5" />
            <span>Layanan Jamaah</span>
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {cmsSettings.homeServiceTitle || "Fasilitas & Pelayanan Jamaah"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {cmsSettings.homeServiceDescription ||
              "Menyediakan ruang ibadah yang nyaman, majelis ta'lim, konsultasi keagamaan, dan layanan sosial kemasyarakatan."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cmsSettings.contentBlocks.services.map((s, idx) => (
            <div
              key={s.title + idx}
              className="card-craft flex flex-col justify-between p-6 sm:p-7"
            >
              <div className="space-y-3.5">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Call To Action Footer Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.20_0.035_170)] via-[oklch(0.18_0.035_170)] to-[oklch(0.16_0.03_170)] px-6 py-12 text-center text-white sm:px-12 sm:py-16 shadow-lg">
        <div className="relative z-10 mx-auto max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-sm">
            <Building2 className="size-3.5" />
            <span>{cmsSettings.contentBlocks.ctaBadge || "Mari Berkunjung"}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight">
            {cmsSettings.homeCtaTitle || "Masjid yang Ramah dan Terhubung dengan Jamaah"}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            {cmsSettings.homeCtaDescription ||
              "Kunjungi Masjid Nurul Jannah di Pangkal Pinang atau hubungi pengurus untuk informasi kegiatan dan layanan ummat."}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href={ROUTE_PATHS.contact}
              className="btn-primary bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold"
            >
              Lokasi & Kontak DKM
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={ROUTE_PATHS.events}
              className="btn-outline bg-white/10 text-white border-white/25 hover:bg-white/20 backdrop-blur-sm"
            >
              Jadwal Agenda Kegiatan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
