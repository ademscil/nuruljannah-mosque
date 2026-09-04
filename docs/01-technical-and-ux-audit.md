# 01 — Full Technical & UX Audit Report
**Portal Masjid Nurul Jannah**

---

## 1. Ringkasan Eksekutif & Diagnosis Kesehatan Sistem

Audit menyeluruh terhadap repositori `portalmasjid` dilakukan pada September 2026. Target evaluasi mencakup struktur komponen, keamanan data, alur input pengurus DKM, performa tampilan publik, dan kerapian arsitektur kode.

| Dimensi Evaluasi | Skor (1–10) | Status | Ringkasan Temuan |
|---|:---:|:---:|---|
| **Public Portal UX & Value Delivery** | **4.2 / 10** | ⚠️ Kritis | Terlalu terbebani styling 3D (tilt effect, perspective card) namun tidak memiliki fitur vital: jadwal salat astronomis real-time, transparansi kas berkala, dan flyer kajian terformat rapi. |
| **CMS DKM Accessibility (Non-Tech UX)** | **2.8 / 10** | 🚨 Darurat | Sangat menyulitkan pengurus awam: penggunaan pemisah pipa string (`Label\|/url`) di textarea, input link Google Drive mentah, dan tidak ada proteksi draft/autosave. |
| **Code Architecture & Maintainability** | **3.5 / 10** | ⚠️ Buruk | Ditemukan 10 file form redundan (*dead code*) berukuran >105 KB, abstraksi repositori semu (Server Actions langsung memanggil Prisma ORM), dan copy teks instruksi hantu. |
| **Security & RBAC Enforcement** | **5.5 / 10** | 🟡 Menengah | Otorisasi server-side sudah memeriksa role dasar, tetapi layout navigasi admin belum dipersonalisasi sesuai kebutuhan tugas spesifik pengurus. |
| **Performa & Konsumsi Daya** | **4.0 / 10** | ⚠️ Boros | Penggunaan animasi frame continuous (`useMouse3D`, multiple Framer Motion observers) memicu konsumsi baterai tinggi pada smartphone jamaah. |

---

## 2. Temuan Audit Kritis (Technical & UX Debt)

### A. Delimiter String Parsing pada Input Pengurus (High Severity)
* **File:** `src/features/cms/components/cms-settings-form.tsx:129-158`
* **Gejala:** Pengurus DKM diminta memasukkan data navigasi publik, daftar tautan cepat, dan card fitur menggunakan pemisah pipa mentah:
  ```text
  Menu Publik: Beranda|/
  Tautan Cepat: Laporan Keuangan|Transparansi kas mingguan|/laporan-keuangan
  ```
* **Dampak:** Pengurus awam yang lupa menyertakan karakter pipa (`|`) atau menambahkan spasi berlebih akan memicu string parsing gagal (`split("|")`), menyebabkan link navigasi publik menjadi rusak atau berstatus `undefined`.

### B. Ketergantungan URL Eksternal Google Drive (High Severity)
* **File:**
  * `src/features/events/components/event-form-panel.tsx:214`
  * `src/features/gallery/components/gallery-form-panel.tsx:173`
  * `src/features/finance/components/transaction-form-panel.tsx:275`
* **Gejala:** Tidak ada fitur upload file langsung untuk flyer dan kwitansi pada modul agenda dan keuangan. Input hanya berupa text input bertuliskan *"Tempel link foto dari Google Drive"*.
* **Dampak:** Link share Google Drive bukanlah file gambar langsung (direct binary link). Akibatnya gambar di halaman publik sering mengalami kegagalan render (*broken image*).

### C. Akumulasi Dead Code & Redundansi Form Panel vs Modal (Medium Severity)
* **Temuan:** Ditemukan duplikasi modul form: versi modal (`*-form-modal.tsx`) dan versi panel (`*-form-panel.tsx`). Seluruh file panel (`transaction-form-panel.tsx`, `event-form-panel.tsx`, `announcement-form-panel.tsx`, `gallery-form-panel.tsx`, `donation-campaign-form-panel.tsx`, `donation-entry-form-panel.tsx`, `management-form-panel.tsx`, `schedule-form-panel.tsx`) tidak di-import di mana pun dan berstatus dead code sebesar >105 KB.
* **Dampak:** Menimbulkan ambiguitas kode dan instruksi manual di halaman keuangan (`src/app/(dashboard)/dashboard/keuangan/page.tsx:40-54`) yang masih meminta user menggunakan dropdown form bawah yang sudah ditiadakan.

### D. Mismatch Fitur Jadwal Salat Publik (Medium Severity)
* **File:** `src/app/(public)/jadwal-sholat/page.tsx`
* **Gejala:** Rute `/jadwal-sholat` hanya menampilkan jadwal penugasan imam, khatib, dan muadzin. Tidak ada jadwal waktu azan harian (Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya) berbasis hisab/Kemenag.
* **Dampak:** Jamaah yang membutuhkan jadwal salat harian untuk panduan ibadah tidak menemukan informasi yang dicari.

---

## 3. Matriks Kesenjangan (Competitive Gap Matrix)

| Fitur | Kondisi Eksisting | Standar Istiqlal / Al Jabbar / Jogokariyan | Rekomendasi Solutif |
|---|---|---|---|
| **Jadwal Salat** | Hanya nama imam/petugas | Countdown real-time + waktu 5 waktu harian | Integrasi Aladhan API / Kemenag + countdown widget |
| **Kas DKM** | 8 transaksi statis | Transparansi mutasi per Jumat, laporan saldo kas terperinci | Modul kas mingguan model Jogokariyan + cetak mading |
| **Manajemen Flyer** | Link text manual | Poster 4:5 tajam, auto-crop, CDN teroptimasi | Smart Image Uploader dengan kompresi WebP otomatis |
| **Input Keuangan** | Angka polos `type="number"` | Form kasir cepat, pemisah ribuan, terbilang | `CurrencyInput` + tombol nominal instan |
| **Ketahanan Form** | Reset saat tab tertutup | Auto-save draft lokal | Hook `useAutoSaveDraft` berbasis localStorage |

