/**
 * Utility untuk mengonversi angka nominal uang menjadi teks terbilang bahasa Indonesia.
 * Contoh: 1500000 -> "Satu juta lima ratus ribu rupiah"
 */

const SATUAN = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
];

function convertToWords(num: number): string {
  if (num < 12) {
    return SATUAN[num];
  }
  if (num < 20) {
    return `${convertToWords(num - 10)} belas`;
  }
  if (num < 100) {
    const sisa = num % 10;
    return `${convertToWords(Math.floor(num / 10))} puluh ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  if (num < 200) {
    const sisa = num - 100;
    return `seratus ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  if (num < 1000) {
    const sisa = num % 100;
    return `${convertToWords(Math.floor(num / 100))} ratus ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  if (num < 2000) {
    const sisa = num - 1000;
    return `seribu ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  if (num < 1000000) {
    const sisa = num % 1000;
    return `${convertToWords(Math.floor(num / 1000))} ribu ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  if (num < 1000000000) {
    const sisa = num % 1000000;
    return `${convertToWords(Math.floor(num / 1000000))} juta ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  if (num < 1000000000000) {
    const sisa = num % 1000000000;
    return `${convertToWords(Math.floor(num / 1000000000))} milyar ${sisa ? convertToWords(sisa) : ""}`.trim();
  }
  const sisa = num % 1000000000000;
  return `${convertToWords(Math.floor(num / 1000000000000))} triliun ${sisa ? convertToWords(sisa) : ""}`.trim();
}

export function terbilangRupiah(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) {
    return "Nol rupiah";
  }

  const rawWords = convertToWords(Math.floor(amount));
  const capitalized = rawWords.charAt(0).toUpperCase() + rawWords.slice(1);
  return `${capitalized} rupiah`;
}

