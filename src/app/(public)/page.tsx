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

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section Video & Sambutan */}
      <VideoHero
        videoSrc={cmsSettings.contentBlocks.heroVideoUrl}
        title={cms.heroTitle || "Selamat Datang di Masjid Nurul Jannah"}
        subtitle={
          cms.heroSubtitle ||
          "Pusat Ibadah, Pembinaan Umat, dan Kemakmuran Sosial di Kota Pangkal Pinang"
        }
        height="large"
        overlayOpacity={0.65}
      >
        <Link href={cms.heroPrimaryCtaHref || ROUTE_PATHS.donations} className="btn-3d">
          {cms.heroPrimaryCtaLabel || "Salurkan Infaq & Sedekah"}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={ROUTE_PATHS.contact}
          className="btn-outline bg-white/10 text-white border-white/30 hover:bg-white/20"
        >
          {cmsSettings.contentBlocks.heroSecondaryButtonLabel || "Lokasi & Kontak"}
        </Link>
      </VideoHero>

      {/* 2. Jadwal Salat Real-time (Benchmark: Masjid Istiqlal) */}
      <section>
        <PrayerTimesWidget initialSchedule={prayerTimes} />
      </section>

      {/* 3. Transparansi Kas Terbuka (Benchmark: Jogokariyan) */}
      <section>
        <WeeklyTransparencyCard report={weeklyCashReport} />
      </section>

      {/* 4. Agenda Kajian & Majelis Ilmu (Benchmark: Masjid Al Jabbar) */}
      <section>
        <FeaturedEventsSection events={publicEvents} />
      </section>

      {/* 5. Infaq Digital QRIS & Rekening Bank */}
      <section className="overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <HandCoins className="size-3.5" />
              Kemudahan Berinfaq Digital
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {cms.donationCtaTitle || "Tunaikan Infaq Terbaik untuk Kemakmuran Masjid"}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {cms.donationCtaDescription ||
                "Setiap rupiah yang Anda salurkan digunakan secara amanah untuk operasional masjid, santunan dhuafa, dan kegiatan dakwah ummat."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Bank Syariah Indonesia (BSI)</p>
                  <p className="font-mono text-base font-bold text-foreground">712-3456-789</p>
                  <p className="text-[11px] text-muted-foreground">a.n. DKM Masjid Nurul Jannah</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Alamat Masjid</p>
                  <p className="text-sm font-semibold text-foreground">{cmsSettings.contactAddress}</p>
                  <p className="text-[11px] text-muted-foreground">{cmsSettings.contactCity}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={ROUTE_PATHS.donations}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
              >
                Pilihan Program Donasi & Konfirmasi
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-muted/10 p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <QrCode className="size-10" />
            </div>
            <h3 className="text-lg font-bold text-foreground">QRIS Nasional Standar Bank Indonesia</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              Dapat dipindai melalui aplikasi m-Banking (BCA, Mandiri, BRI, BSI) maupun e-Wallet (GoPay, OVO, ShopeePay, DANA).
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <ShieldCheck className="size-4" />
              Rekening Resmi Terverifikasi DKM
            </div>
          </div>
        </div>
      </section>

      {/* 6. Layanan Jamaah */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <HeartHandshake className="size-3.5" />
            Layanan Ummat
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {cmsSettings.homeServiceTitle || "Fasilitas & Pelayanan Jamaah"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {cmsSettings.homeServiceDescription ||
              "Menyediakan ruang ibadah yang nyaman, majelis ta'lim, konsultasi keagamaan, dan layanan sosial kemasyarakatan."}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cmsSettings.contentBlocks.services.map((s, idx) => (
            <div
              key={s.title + idx}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 transition duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Call To Action Footer Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[oklch(0.22_0.04_175)] px-8 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="relative z-10 mx-auto max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Building2 className="size-3.5" />
            {cmsSettings.contentBlocks.ctaBadge || "Mari Berkunjung"}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {cmsSettings.homeCtaTitle || "Masjid yang Ramah dan Terhubung dengan Jamaah"}
          </h2>
          <p className="text-sm leading-relaxed text-white/80 sm:text-base">
            {cmsSettings.homeCtaDescription ||
              "Kunjungi Masjid Nurul Jannah di Pangkal Pinang atau hubungi pengurus untuk informasi kegiatan dan layanan ummat."}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href={ROUTE_PATHS.contact}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Lokasi & Kontak DKM
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={ROUTE_PATHS.events}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Jadwal Agenda Kegiatan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
