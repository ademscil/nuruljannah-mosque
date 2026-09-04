# 00 — Project Charter & System Vision
**Portal Digital & CMS Internal Masjid Nurul Jannah**

---

## 1. Latar Belakang & Visi Proyek

Masjid Nurul Jannah (Kec. Gerunggang, Kota Pangkal Pinang) membutuhkan platform digital yang terintegrasi untuk menjembatani dua kebutuhan utama:
1. **Area Publik Jamaah:** Memberikan akses cepat, kredibel, dan modern terhadap informasi ibadah (jadwal salat real-time), agenda kajian, transparansi mutasi kas masjid, serta kemudahan menyalurkan infaq/shodaqoh secara digital.
2. **CMS Internal Pengurus DKM:** Memfasilitasi jajaran pengurus masjid (yang mayoritas adalah tokoh masyarakat dan relawan non-IT) dalam mencatat keuangan kas, mengunggah flyer kegiatan, dan mengelola pengumuman tanpa beban teknis (*Zero Cognitive Load*).

---

## 2. Target Persona Pengguna

### Persona 1: Jamaah Masjid (Pak Rahmat, 42 tahun / Fikri, 19 tahun)
* **Karakteristik:** Mengakses web melalui smartphone (koneksi 4G/WiFi), membutuhkan informasi cepat tanpa hambatan animasi berlebih.
* **Kebutuhan Utama:**
  - Jam hitung mundur waktu salat terdekat & jadwal waktu salat bulanan.
  - Flyer kajian terbaru untuk dibagikan ke grup WhatsApp keluarga/jamaah.
  - Informasi transparansi saldo kas masjid per Jumat pagi.
  - Barcode QRIS donasi yang jelas dan dapat langsung di-scan dari layar lain atau disimpan ke galeri.

### Persona 2: Bendahara DKM (Haji Marzuki, 58 tahun)
* **Karakteristik:** Pengurus sepuh yang terbiasa mencatat di buku kas manual. Sering cemas saat mengoperasikan software baru karena takut salah klik atau data terhapus.
* **Kebutuhan Utama:**
  - Form pencatatan kas yang semudah kalkulator / nota belanja.
  - Input angka otomatis menampilkan format Rupiah dan teks terbilang bahasa Indonesia.
  - Tombol nominal instan (+50rb, +100rb, +500rb, +1jt) untuk meminimalisasi salah ketik jumlah nol.
  - Rekap kas mingguan yang siap dicetak untuk dibacakan menjelang salat Jumat.

### Persona 3: Sekretaris / Tim Humas (Ustadz Hendra, 34 tahun)
* **Karakteristik:** Mengelola warta masjid dan menerima kiriman poster kajian dari panitia/penceramah lewat WhatsApp.
* **Kebutuhan Utama:**
  - Bisa langsung memilih foto poster kajian dari HP tanpa perlu resize atau kompres manual di aplikasi pihak ketiga.
  - Menulis pengumuman dan berita singkat dengan pratinjau instan.
  - Sistem otomatis menyimpan ketikan secara berkala (*auto-save*) agar tidak hilang jika baterai HP habis atau sinyal terputus.

---

## 3. Prinsip Rekayasa Perangkat Lunak

1. **Simplicity Over Showmanship:** Mengutamakan kecepatan muat (*Core Web Vitals*) dan keterbacaan dibanding efek visual 3D yang membebani daya tahan perangkat jamaah.
2. **Fault-Tolerant UX:** Setiap interaksi penting memiliki konfirmasi ramah, perlindungan draf lokal (*draft restore*), dan mekanisme pembatalan (*undo*).
3. **Clean Architecture Separation:** Menegakkan batas yang jelas antara *Presentation Layer*, *Domain Service*, dan *Data Access Layer (Repository)*.
4. **Accessible & Responsive:** 100% responsif pada perangkat mobile layar kecil hingga layar TV display informasi (Digital Signage) masjid.

