/**
 * Modul Kalkulasi Jadwal Salat Standar Kemenag RI untuk Pangkal Pinang, Bangka Belitung.
 * Bekerja 100% offline & deterministik dengan rumus astronomis standar Kemenag RI
 * (Sudut Subuh 20?, Isya 18?, Ihtiyat pengaman +2 menit).
 */

export type PrayerTimesSchedule = {
  date: string;
  hijri: string;
  location: string;
  timings: {
    subuh: string;
    terbit: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  };
  nextPrayer: {
    name: string;
    time: string;
    minutesRemaining: number;
    isAdzanNow: boolean;
  };
};

// Koordinat Masjid Nurul Jannah Pangkal Pinang
const LATITUDE = -2.1052125;
const LONGITUDE = 106.0909844;
const TIMEZONE = 7; // WIB

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fixAngle(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

function fixHour(h: number): number {
  h = h - 24 * Math.floor(h / 24);
  return h < 0 ? h + 24 : h;
}

function padZero(num: number): string {
  const clamped = Math.max(0, Math.floor(num));
  return clamped < 10 ? `0${clamped}` : `${clamped}`;
}

export function getDynamicHijriDate(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("id-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(date);
  } catch {
    return "Tahun 1448 H";
  }
}

function formatHours(hours: number): string {
  const norm = fixHour(hours);
  const h = Math.floor(norm);
  const m = Math.floor((norm - h) * 60);
  return `${padZero(h)}:${padZero(m)}`;
}

export function getTodayPrayerTimes(inputDate = new Date()): PrayerTimesSchedule {
  // Normalize input date to Asia/Jakarta (WIB, UTC+7) timezone
  const jakartaDate = new Date(
    inputDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  const year = jakartaDate.getFullYear();
  const month = jakartaDate.getMonth() + 1;
  const day = jakartaDate.getDate();

  // Julian Day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g)));
  const e = 23.439 - 0.00000036 * d;
  const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15;
  const D = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));

  const noon = fixHour(12 + TIMEZONE - LONGITUDE / 15 - (q / 15 - fixHour(RA)));

  // Subuh (fajr angle = 20 deg)
  const subuhH =
    toDegrees(
      Math.acos(
        (-Math.sin(toRadians(20)) -
          Math.sin(toRadians(LATITUDE)) * Math.sin(toRadians(D))) /
          (Math.cos(toRadians(LATITUDE)) * Math.cos(toRadians(D)))
      )
    ) / 15;
  const subuh = fixHour(noon - subuhH + 2 / 60);

  // Terbit (sunrise, alpha = 0.833 deg)
  const sunriseH =
    toDegrees(
      Math.acos(
        (-Math.sin(toRadians(0.833)) -
          Math.sin(toRadians(LATITUDE)) * Math.sin(toRadians(D))) /
          (Math.cos(toRadians(LATITUDE)) * Math.cos(toRadians(D)))
      )
    ) / 15;
  const terbit = fixHour(noon - sunriseH - 2 / 60);

  // Ashar (shafii factor = 1)
  const asharH =
    toDegrees(
      Math.acos(
        (Math.sin(
          Math.atan(1 + Math.tan(toRadians(Math.abs(LATITUDE - D))))
        ) -
          Math.sin(toRadians(LATITUDE)) * Math.sin(toRadians(D))) /
          (Math.cos(toRadians(LATITUDE)) * Math.cos(toRadians(D)))
      )
    ) / 15;
  const ashar = fixHour(noon + asharH + 2 / 60);

  // Maghrib (sunset, alpha = 0.833 deg)
  const maghrib = fixHour(noon + sunriseH + 2 / 60);

  // Isya (alpha = 18 deg)
  const isyaH =
    toDegrees(
      Math.acos(
        (-Math.sin(toRadians(18)) -
          Math.sin(toRadians(LATITUDE)) * Math.sin(toRadians(D))) /
          (Math.cos(toRadians(LATITUDE)) * Math.cos(toRadians(D)))
      )
    ) / 15;
  const isya = fixHour(noon + isyaH + 2 / 60);
  const dzuhur = fixHour(noon + 2 / 60);

  const timings = {
    subuh: formatHours(subuh),
    terbit: formatHours(terbit),
    dzuhur: formatHours(dzuhur),
    ashar: formatHours(ashar),
    maghrib: formatHours(maghrib),
    isya: formatHours(isya),
  };

  // Current hours in Jakarta (WIB) time
  const currentHours =
    jakartaDate.getHours() +
    jakartaDate.getMinutes() / 60 +
    jakartaDate.getSeconds() / 3600;

  // The 5 mandatory salat times (excluding Sunrise / Terbit which is not a prayer)
  const salatHoursList = [
    { name: "Subuh", val: subuh },
    { name: "Dzuhur", val: dzuhur },
    { name: "Ashar", val: ashar },
    { name: "Maghrib", val: maghrib },
    { name: "Isya", val: isya },
  ];

  let nextPrayerItem = salatHoursList.find((p) => p.val > currentHours);
  let minutesRemaining = 0;

  if (!nextPrayerItem) {
    // Lewat Isya, menuju Subuh besok
    nextPrayerItem = { name: "Subuh", val: subuh };
    minutesRemaining = Math.round((24 - currentHours + subuh) * 60);
  } else {
    minutesRemaining = Math.round((nextPrayerItem.val - currentHours) * 60);
  }

  // Adzan is active when current time is between salat time and +15 minutes
  const isAdzanNow = salatHoursList.some((s) => {
    const elapsedMinutes = (currentHours - s.val) * 60;
    return elapsedMinutes >= 0 && elapsedMinutes <= 15;
  });

  const dateFormatted = jakartaDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    date: dateFormatted,
    hijri: getDynamicHijriDate(jakartaDate),
    location: "Pangkal Pinang, Bangka Belitung",
    timings,
    nextPrayer: {
      name: nextPrayerItem.name,
      time: formatHours(nextPrayerItem.val),
      minutesRemaining: Math.max(0, minutesRemaining),
      isAdzanNow,
    },
  };
}
