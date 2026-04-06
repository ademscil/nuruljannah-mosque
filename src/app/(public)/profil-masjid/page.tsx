import { Target, Heart, Building2, CheckCircle2 } from "lucide-react";

import { PublicPageTemplate } from "@/features/public/components/public-page-template";
import { ManagementPublicGrid } from "@/features/management/components/management-public-grid";
import { getManagementMembers } from "@/features/management/services/management-service";

const facilities = [
  "Ruang utama sholat berjamaah berkapasitas besar",
  "Area tempat wudhu jamaah putra dan putri",
  "Ruang kegiatan pembinaan dan kajian",
  "Area koordinasi pengurus dan kegiatan sosial",
  "Perpustakaan mini koleksi buku Islam",
  "Area parkir kendaraan jamaah",
];

export default async function ProfilMasjidPage() {
  const members = await getManagementMembers();

  return (
    <PublicPageTemplate
      title="Profil Masjid"
      description="Sejarah singkat, visi misi, fasilitas, dan struktur pengurus Masjid Nurul Jannah."
      sidebarTitle="Masjid Nurul Jannah"
      sidebarDescription="Masjid Nurul Jannah hadir sebagai ruang ibadah, pembinaan, dan kebersamaan jamaah di Pangkal Pinang."
      sidebarItems={[
        "Alamat resmi terhubung ke Google Maps",
        "Pengurus dan informasi publik dikelola dari CMS internal",
        "Konten profil dapat diperbarui langsung dari dashboard admin",
      ]}
    >
      {/* About */}
      <div className="card-hero p-8">
        <div className="badge-primary mb-4">Tentang Masjid</div>
        <h2 className="font-heading text-3xl font-semibold leading-snug">
          Pusat ibadah dan pemberdayaan jamaah di lingkungan Taman Bunga.
        </h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Website ini disusun untuk memudahkan jamaah mendapatkan informasi kegiatan, pengumuman,
          jadwal petugas, donasi, dan transparansi keuangan. Di saat yang sama, pengurus memiliki
          area admin khusus untuk mengelola seluruh konten publik dari satu dashboard.
        </p>
      </div>

      {/* Visi Misi */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-elevated group p-6 transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110">
            <Target className="size-5" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">Visi</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Menjadi masjid yang ramah, tertib, aktif dalam pembinaan umat, dan terbuka dalam
            pelayanan kepada jamaah.
          </p>
        </div>
        <div className="card-elevated group p-6 transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
            <Heart className="size-5" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">Misi</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Menghadirkan kegiatan ibadah, dakwah, sosial, dan pendidikan yang terkelola baik serta
            mudah diakses oleh seluruh jamaah.
          </p>
        </div>
      </div>

      {/* Fasilitas */}
      <div className="card-elevated p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Fasilitas</p>
            <h3 className="text-lg font-semibold">Fasilitas Utama Masjid</h3>
          </div>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {facilities.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm transition-colors hover:bg-white">
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pengurus */}
      <div className="space-y-5">
        <div>
          <div className="badge-primary mb-3">Struktur Pengurus</div>
          <h3 className="font-heading text-2xl font-semibold">Pengurus Masjid Nurul Jannah</h3>
        </div>
        <ManagementPublicGrid members={members} />
      </div>
    </PublicPageTemplate>
  );
}
