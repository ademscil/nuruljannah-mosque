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
import { SITE_CONFIG } from "@/constants/site";
import { getHomepageContent } from "@/features/cms/services/homepage-content-service";

const stats = [
  { label: "Agenda Aktif", value: "4+", icon: CalendarDays, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Informasi Publik", value: "Terpusat", icon: Megaphone, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { label: "CMS Pengurus", value: "Siap Pakai", icon: ShieldCheck, iconBg: "bg-teal-50", iconColor: "text-teal-600" },
];

const features = [
  {
    title: "Agenda dan Kajian",
    description: "Jamaah dapat melihat agenda kegiatan, kajian, dan program masjid dengan tampilan yang jelas dan mudah dipahami.",
    icon: CalendarDays,
    iconBg: "bg-primary/8 text-primary",
    accent: "from-primary/5 to-transparent",
  },
  {
    title: "Pengumuman Resmi",
    description: "Pengurus mempublikasikan informasi penting secara tertata langsung dari dashboard internal.",
    icon: Megaphone,
    iconBg: "bg-amber-50 text-amber-600",
    accent: "from-amber-50/60 to-transparent",
  },
  {
    title: "Donasi dan Keuangan",
    description: "Area donasi dan ringkasan keuangan tersedia untuk transparansi penuh kepada seluruh jamaah.",
    icon: HandCoins,
    iconBg: "bg-emerald-50 text-emerald-600",
    accent: "from-emerald-50/60 to-transparent",
  },
  {
    title: "Operasional Pengurus",
    description: "Role pengurus, jadwal petugas, dan CMS internal terkelola dari dashboard yang rapi dan efisien.",
    icon: Users,
    iconBg: "bg-violet-50 text-violet-600",
    accent: "from-violet-50/60 to-transparent",
  },
];

const services = [
  {
    icon: Clock3,
    title: "Jadwal Terpusat",
    description: "Jadwal ibadah dan petugas lebih cepat diakses dari satu tempat.",
    iconBg: "bg-primary/8 text-primary",
  },
  {
    icon: HandCoins,
    title: "Donasi Transparan",
    description: "Campaign, donatur, dan progres penghimpunan dana dipantau dari satu modul.",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: MapPin,
    title: "Alamat Resmi",
    description: "Lokasi masjid di Pangkal Pinang terhubung langsung ke Google Maps.",
    iconBg: "bg-teal-50 text-teal-600",
  },
];

const quickLinks = [
  { title: "Lihat Agenda Kegiatan", description: "Tampilkan jadwal kegiatan masjid yang akan datang.", href: ROUTE_PATHS.events, icon: CalendarDays },
  { title: "Buka Pengumuman", description: "Baca informasi terbaru yang dipublikasikan pengurus.", href: ROUTE_PATHS.announcements, icon: BookOpen },
  { title: "Masuk Dashboard Admin", description: "Kelola konten publik dan data operasional dari CMS internal.", href: ROUTE_PATHS.login, icon: TrendingUp },
];

export default async function HomePage() {
  const cms = await getHomepageContent();

  return (
    <div className="space-y-28">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="card-hero hero-surface islamic-grid relative overflow-hidden px-8 py-14 md:px-12 md:py-20">
        <div className="orb -right-20 -top-20 size-80 bg-primary/5" />
        <div className="orb -bottom-16 left-1/4 size-64 bg-amber-100/30" />

        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Left col */}
          <div className="space-y-8">
            <div className="animate-fade-up">
              <div className="badge-shimmer badge-primary">
                <Building2 className="size-3.5" />
                Website Resmi Masjid Nurul Jannah
              </div>
            </div>

            <div className="animate-fade-up delay-100 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/50">
                Pusat Informasi Jamaah & Pengurus
              </p>
              <h1 className="font-heading text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-[4.25rem]">
                <span className="text-gradient-primary">{cms.heroTitle}</span>
              </h1>
              <p className="max-w-lg text-lg leading-8 text-muted-foreground">
                {cms.heroSubtitle}
              </p>
            </div>

            <div className="animate-fade-up delay-200 flex flex-wrap gap-3">
              <Link href={cms.heroPrimaryCtaHref} className="btn-primary">
                {cms.heroPrimaryCtaLabel}
                <ArrowRight className="size-4" />
              </Link>
              <Link href={ROUTE_PATHS.contact} className="btn-outline">
                Lihat Lokasi
              </Link>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-300 grid gap-3 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="glass-card flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-0.5">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
                    <s.icon className={`size-4 ${s.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold leading-none">{s.value}</p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right col */}
          <div className="animate-slide-left delay-200 space-y-4">
            {/* Welcome card */}
            <div className="card-hero overflow-hidden p-0">
              <div className="relative bg-gradient-to-br from-primary/8 via-white to-amber-50/40 p-8">
                <div className="orb -right-6 -top-6 size-28 bg-primary/6" />
                <div className="relative space-y-4">
                  <div className="badge-amber">
                    <Star className="size-3" />
                    Sambutan
                  </div>
                  <h2 className="font-heading text-2xl leading-snug font-semibold">{cms.welcomeTitle}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{cms.welcomeContent}</p>
                </div>
              </div>
            </div>

            {/* Two mini cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card-elevated group cursor-default p-5 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                  <HandCoins className="size-5" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Donasi</p>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug">{cms.donationCtaTitle}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{cms.donationCtaDescription}</p>
              </div>
              <div className="card-elevated group cursor-default p-5 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="size-5" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Lokasi</p>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug">{SITE_CONFIG.contact.city}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{SITE_CONFIG.contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="space-y-10">
        <SectionHeader
          badge="Fitur Utama"
          title="Portal publik yang lebih mudah dipahami"
          description="Dirancang terang, ringan, dan fokus pada informasi yang paling sering dibutuhkan jamaah maupun pengurus."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((f, i) => (
            <article
              key={f.title}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-fade-up card-elevated group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_oklch(0.18_0.018_250_/_0.16)]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative">
                <div className={`inline-flex size-11 items-center justify-center rounded-2xl ${f.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-muted-foreground">{f.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Services + Quick Links ────────────────────────── */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Services */}
        <div className="card-hero p-8 md:p-10">
          <div className="badge-primary mb-4">Layanan Utama</div>
          <h2 className="font-heading text-3xl leading-tight font-semibold md:text-4xl">
            Area publik dan dashboard admin terhubung dalam satu sistem.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Jamaah melihat informasi kegiatan, pengumuman, donasi, dan laporan ringkas.
            Pengurus mengelola seluruh konten dari dashboard internal yang terhubung langsung ke database.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="card-base group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className={`flex size-10 items-center justify-center rounded-xl ${s.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <s.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="card-hero p-8 md:p-10">
          <div className="badge-primary mb-6">Akses Cepat</div>
          <div className="space-y-3">
            {quickLinks.map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                style={{ animationDelay: `${i * 80}ms` }}
                className="animate-fade-up group flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-5 transition-all duration-200 hover:border-primary/20 hover:bg-white hover:shadow-[0_8px_24px_-12px_oklch(0.18_0.018_250_/_0.1)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-tight">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-[oklch(0.22_0.04_175)] px-10 py-16 text-center md:px-16 md:py-20">
        <div className="orb -left-20 -top-20 size-72 bg-primary/20" />
        <div className="orb -bottom-16 right-0 size-56 bg-[oklch(0.68_0.14_82)]/10" />
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.35_0.05_175)] bg-[oklch(0.28_0.05_175)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.68_0.14_82)]">
            <Building2 className="size-3.5" />
            Bergabung Bersama Kami
          </div>
          <h2 className="font-heading text-3xl font-semibold leading-tight text-white md:text-5xl">
            Masjid yang lebih terhubung<br className="hidden md:block" /> dengan jamaahnya.
          </h2>
          <p className="mx-auto max-w-xl text-base leading-8 text-[oklch(0.72_0.03_175)]">
            Akses informasi kegiatan, donasi, dan pengumuman resmi kapan saja dan di mana saja.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={ROUTE_PATHS.events}
              className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.68_0.14_82)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.02_250)] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Lihat Agenda
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={ROUTE_PATHS.donations}
              className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.35_0.05_175)] bg-[oklch(0.28_0.05_175)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[oklch(0.32_0.05_175)]"
            >
              Donasi Sekarang
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
