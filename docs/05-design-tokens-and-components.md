# 05 — Design Tokens & Component Library Guide
**Sistem Desain Islami Kontemporer & Komponen Antarmuka Reusable**

---

## 1. Desain Token (Warna & Tipografi)

Sistem menggunakan palet bernuansa *Deep Teal & Warm Gold* yang mencerminkan ketenangan, keagungan, dan keramahan masjid nusantara.

### Palet Warna Inti
* **Primary (Deep Teal):** `oklch(0.38 0.1 175)` — Dipakai untuk header, tombol utama, aksen masjid.
* **Secondary / Accent (Warm Sand/Gold):** `oklch(0.68 0.14 82)` — Dipakai untuk highlight, badge penting, dan countdown azan.
* **Background:** `oklch(0.982 0.004 80)` — Latar belakang lembut yang nyaman di mata jamaah.
* **Success (Kas Masuk):** `oklch(0.62 0.17 145)` — Hijau terang untuk pemasukan infaq.
* **Destructive (Kas Keluar):** `oklch(0.62 0.22 28)` — Merah lembut untuk pengeluaran dan aksi hapus.

### Tipografi
* **Font Sans (Antarmuka & Teks):** `Plus Jakarta Sans` — Jelas dan mudah dibaca pada layar kecil.
* **Font Heading (Judul & Aksen):** `Source Serif / Amiri` — Memberikan sentuhan kaligrafi dan nuansa sakral pada judul artikel dan ayat.

---

## 2. Komponen Antarmuka Inti (Atomic Components)

### `CurrencyInput`
Input angka dengan pemisah ribuan otomatis (`Rp 1.500.000`), didukung:
- Teks bacaan terbilang bahasa Indonesia (*"Satu juta lima ratus ribu rupiah"*).
- Quick Amount Chips: `+50.000`, `+100.000`, `+500.000`, `+1.000.000`.

### `SmartImageUploader`
Komponen unggah berkas cerdas untuk pengurus DKM:
- **Client-Side Auto-Resize & Compression:** Mengonversi file gambar berukuran besar (5–10 MB dari kamera HP) menjadi WebP ringan (<150 KB) sebelum diunggah.
- **Aspect Ratio Enforcer:** Menjaga rasio poster 4:5 (kajian) atau 16:9 (berita) agar tampilan web selalu rapi dan simetris.

### `FriendlyConfirmDialog`
Dialog konfirmasi aksi destruktif:
- Menggunakan bahasa Indonesia yang santun dan jelas.
- Menyediakan jeda waktu pembatalan (*Undo Window*) untuk mencegah insiden terhapusnya data akibat salah klik.

