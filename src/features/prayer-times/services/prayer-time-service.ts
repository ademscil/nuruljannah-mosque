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
const LATITUDE = -2.1298;
const LONGITUDE = 106.1139;
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

export function getTodayPrayerTimes(baseDate = new Date()): PrayerTimesSchedule {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;
  const day = baseDate.getDate();

  // Julian Day
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
  const L = fixAngle(
    q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g))
  );
  const e = 23.439 - 0.00000036 * d;

  let RA =
    toDegrees(
      Math.atan2(
        Math.cos(toRadians(e)) * Math.sin(toRadians(L)),
        Math.cos(toRadians(L))
      )
    ) / 15;
  RA = fixHour(RA);

  const D = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
  let EqT = q / 15 - RA;
  EqT = EqT - 24 * Math.round(EqT / 24);

  // Transit (Dzuhur)
  const noon = fixHour(12 + TIMEZONE - LONGITUDE / 15 - EqT);

  // Subuh (alpha = 20 deg)
  const subuhH =
    toDegrees(
      Math.acos(
        (-Math.sin(toRadians(20)) -
          Math.sin(toRadians(LATITUDE)) * Math.sin(toRadians(D))) /
          (Math.cos(toRadians(LATITUDE)) * Math.cos(toRadians(D)))
      )
    ) / 15;
  const subuh = fixHour(noon - subuhH + 2 / 60); // +2 menit Ihtiyat

  // Terbit (alpha = 0.833 deg)
  const sunriseH =
    toDegrees(
      Math.acos(
        (-Math.sin(toRadians(0.833)) -
          Math.sin(toRadians(LATITUDE)) * Math.sin(toRadians(D))) /
          (Math.cos(toRadians(LATITUDE)) * Math.cos(toRadians(D)))
      )
    ) / 15;
  const terbit = fixHour(noon - sunriseH);

  // Ashar (Shafi'i: shadow length = object height + noon shadow)
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

  // Tentukan salat berikutnya berdasarkan waktu sekarang
  const currentHours = baseDate.getHours() + baseDate.getMinutes() / 60;
  const prayerHoursList = [
    { name: "Subuh", val: subuh },
    { name: "Terbit", val: terbit },
    { name: "Dzuhur", val: dzuhur },
    { name: "Ashar", val: ashar },
    { name: "Maghrib", val: maghrib },
    { name: "Isya", val: isya },
  ];

  let nextPrayerItem = prayerHoursList.find((p) => p.val > currentHours);
  let minutesRemaining = 0;

  if (!nextPrayerItem) {
    // Lewat Isya, menuju Subuh besok
    nextPrayerItem = { name: "Subuh", val: subuh };
    minutesRemaining = Math.round((24 - currentHours + subuh) * 60);
  } else {
    minutesRemaining = Math.round((nextPrayerItem.val - currentHours) * 60);
  }

  const isAdzanNow = minutesRemaining >= -5 && minutesRemaining <= 5;

  const dateFormatted = baseDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    date: dateFormatted,
    hijri: getDynamicHijriDate(baseDate),
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
