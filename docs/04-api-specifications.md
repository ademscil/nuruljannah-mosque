# 04 — Public API Specifications & Contracts
**RESTful Endpoints untuk Layar Informasi Masjid (Digital Signage) & Integrasi Publik**

---

## 1. Jadwal Salat Real-time
* **Route:** `GET /api/v1/public/prayer-times`
* **Deskripsi:** Mengembalikan jadwal waktu salat 5 waktu untuk hari ini, tanggal Hijriyah, dan hitung mundur menuju waktu salat berikutnya.
* **Query Parameters:**
  - `city` (opsional): Nama kota (default: *Pangkal Pinang*).
* **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "date": "2026-09-04",
    "hijri": "20 Rabiul Awwal 1448 H",
    "location": "Pangkal Pinang, Bangka Belitung",
    "timings": {
      "subuh": "04:38",
      "terbit": "05:51",
      "dzuhur": "11:59",
      "ashar": "15:15",
      "maghrib": "18:02",
      "isya": "19:11"
    },
    "nextPrayer": {
      "name": "Dzuhur",
      "time": "11:59",
      "countdownSeconds": 12840
    }
  }
}
```

---

## 2. Transparansi Kas Mingguan (Model Jogokariyan)
* **Route:** `GET /api/v1/public/finance/weekly-summary`
* **Deskripsi:** Menyajikan rekap mutasi kas pekan berjalan (Jumat ke Jumat) untuk tampilan TV masjid dan ringkasan portal publik.
* **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "period": {
      "label": "Pekan ke-1 September 2026",
      "startDate": "2026-08-29",
      "endDate": "2026-09-04"
    },
    "summary": {
      "startingBalance": 14250000,
      "weeklyIncome": 6800000,
      "weeklyExpense": 4500000,
      "currentBalance": 16550000
    },
    "recentTransactions": [
      {
        "id": "tx_1",
        "type": "INCOME",
        "category": "Infaq Tromol Jumat",
        "amount": 4200000,
        "date": "2026-09-04T12:45:00Z",
        "description": "Perolehan tromol jumat pekan ke-1"
      }
    ]
  }
}
```

---

## 3. Agenda Kajian Terdekat
* **Route:** `GET /api/v1/public/events`
* **Deskripsi:** Mengembalikan daftar agenda kajian dan kegiatan masjid yang sedang aktif dan dipublikasikan.
* **Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt_1",
      "name": "Kajian Ahad Pagi",
      "speaker": "Ustadz Dr. Abdullah Salim, M.A.",
      "date": "2026-09-06T08:30:00Z",
      "timeLabel": "08.30 - 10.00 WIB",
      "location": "Ruang Sholat Utama",
      "flyerUrl": "https://.../flyer-kajian.webp"
    }
  ]
}
```

