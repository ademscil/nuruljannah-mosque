import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  CirclePlay,
  HandCoins,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { SectionHeader } from "@/components/shared/section-header";
import { ROUTE_PATHS } from "@/constants/routes";
import { SITE_CONFIG } from "@/constants/site";
import { getHomepageContent } from "@/features/cms/services/homepage-content-service";

const highlights = [
  {
    title: "Agenda kegiatan terkelola",
    description:
      "Agenda publik dan agenda internal pengurus dipersiapkan dari satu fondasi CMS yang rapi.",
    icon: CalendarRange,
  },
  {
    title: "Pengumuman terpublikasi rapi",
    description:
      "Informasi penting jamaah bisa dipublikasikan dengan kontrol status dan kurasi konten.",
    icon: Megaphone,
  },
  {
    title: "Donasi dan keuangan transparan",
    description:
      "Data pemasukan dan pengeluaran bisa dibaca jamaah dan dikelola pengurus secara lebih tertata.",
    icon: HandCoins,
  },
  {
    title: "Akses pengurus lebih aman",
    description:
      "Login admin, proteksi route dashboard, dan role dasar sudah aktif untuk operasional harian.",
    icon: ShieldCheck,
  },
];

const serviceBlocks = [
  {
    title: "Informasi Jamaah",
    description:
      "Jadwal, pengumuman, agenda, dan info masjid disusun agar mudah dipahami semua kalangan.",
  },
  {
    title: "Program & Kegiatan",
    description:
      "Kegiatan dakwah, sosial, pendidikan, dan layanan masjid bisa tampil lebih tertata dan mudah dicari.",
  },
  {
    title: "Infaq & Transparansi",
    description:
      "Pendekatan konten donasi dan laporan dibuat lebih jelas agar membangun kepercayaan jamaah.",
  },
];

export default async function HomePage() {
  const homepageContent = await getHomepageContent();

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-[2.8rem] border border-white/40 px-8 py-12 shadow-[0_45px_120px_-60px_rgba(15,23,42,0.45)] md:px-12 md:py-16">
        <div className="gradient-emerald absolute inset-0 opacity-[0.08]" />
        <div className="glass-panel absolute inset-0" />
        <div className="absolute -left-14 top-16 size-48 rounded-full bg-emerald-500/20 blur-3xl animate-pulse-glow" />
        <div className="absolute right-8 top-6 size-72 rounded-full bg-teal-400/14 blur-3xl animate-float-gentle" />
        <div className="absolute bottom-0 left-1/3 size-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-7">
            <div className="animate-slide-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
              <Sparkles className="size-4" />
              Website Resmi Masjid Nurul Jannah
            </div>

            <div className="animate-slide-fade-up-delay space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700/80 dark:text-emerald-300">
                Pusat Informasi Jamaah dan Pengurus
              </p>
              <h1 className="max-w-4xl font-heading text-5xl leading-[1.02] tracking-tight text-foreground md:text-7xl">
                {homepageContent.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                {homepageContent.heroSubtitle}
              </p>
            </div>

            <div className="animate-slide-fade-up-delay-2 flex flex-wrap gap-3">
              <Link
                href={homepageContent.heroPrimaryCtaHref}
                className="gradient-emerald inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-[0_20px_60px_-25px_rgba(5,150,105,0.8)] transition hover:scale-[1.02]"
              >
                {homepageContent.heroPrimaryCtaLabel}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={ROUTE_PATHS.login}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/60 bg-white/70 px-6 text-sm font-semibold text-foreground shadow-[0_14px_40px_-24px_rgba(15,23,42,0.35)] transition hover:bg-white dark:border-white/10 dark:bg-white/5"
              >
                <CirclePlay className="size-4" />
                Masuk Admin
              </Link>
            </div>

            <div className="grid animate-slide-fade-up-delay-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Informasi", value: "Terpusat" },
                { label: "Operasional", value: "Efisien" },
                { label: "Keuangan", value: "Transparan" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.6rem] border border-white/50 bg-white/65 p-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] dark:bg-white/5"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative grid gap-4">
            <div className="animate-float-gentle absolute -right-5 top-8 hidden rounded-full border border-emerald-400/20 bg-white/60 px-4 py-2 text-sm font-medium text-emerald-700 shadow-[0_15px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur md:block dark:bg-white/5 dark:text-emerald-300">
              Terhubung dengan Supabase
            </div>
            <ContentPreviewCard
              eyebrow="Sambutan"
              title={homepageContent.welcomeTitle}
              description={homepageContent.welcomeContent}
            />
            <ContentPreviewCard
              eyebrow="Infaq & Dukungan"
              title={homepageContent.donationCtaTitle}
              description={homepageContent.donationCtaDescription}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2.5rem] bg-[#10332d] p-8 text-white shadow-[0_35px_100px_-60px_rgba(15,23,42,0.6)]">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-200/85">
            Nuansa Baru
          </p>
          <h2 className="mt-4 font-heading text-4xl leading-tight">
            Lebih tenang, lebih modern, dan terasa lebih kredibel.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/75">
            Saya ambil pelajaran dari struktur situs referensi: sambutan yang jelas,
            fokus pada layanan/program, penekanan infaq, dan informasi lokasi. Lalu
            saya terjemahkan ke visual yang lebih modern dan lebih rapi.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Komposisi hero yang lebih kuat dan editorial",
              "Panel transparan dengan depth yang lebih terasa",
              "Animasi halus untuk mempercantik halaman",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <ArrowUpRight className="size-4 text-emerald-300" />
                <p className="text-sm text-emerald-50/80">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="glass-panel aurora-border rounded-[2rem] p-6 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)] transition duration-500 hover:translate-y-[-6px]"
            >
              <div className="inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <item.icon className="size-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          title="Layanan Masjid dalam satu portal"
          description="Saya satukan pola sambutan, layanan, infaq, berita, dan lokasi seperti referensi, tetapi dengan ritme visual yang lebih modern."
        />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel aurora-border rounded-[2.25rem] p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Fokus Pengalaman
            </p>
            <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
              Satu portal untuk informasi jamaah, satu dashboard untuk pengurus.
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              Dengan arah ini, publik mendapat tampilan yang lebih jelas dan
              terpercaya, sementara pengurus tetap punya fondasi CMS internal yang
              modular dan production-minded.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {serviceBlocks.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.6rem] border border-white/50 bg-white/55 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] dark:bg-white/5"
                >
                  <h4 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <ContentPreviewCard
              eyebrow="Lokasi Masjid"
              title={SITE_CONFIG.contact.city}
              description={SITE_CONFIG.contact.address}
            />
            <ContentPreviewCard
              eyebrow="Akses Cepat"
              title="Kontak, Maps, dan informasi publik"
              description="Halaman kontak kini sudah memakai alamat resmi Masjid Nurul Jannah di Pangkal Pinang dan terhubung ke Google Maps."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
