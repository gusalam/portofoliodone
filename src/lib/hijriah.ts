/**
 * Simple Hijriah Calendar Utilities
 * Approximate conversion for Islamic date detection
 */

interface HijriahDate {
  year: number;
  month: number;
  day: number;
}

// Islamic months
export const ISLAMIC_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Syaban",
  "Ramadhan",
  "Syawal",
  "Dzulqadah",
  "Dzulhijjah",
];

// Approximate conversion from Gregorian to Hijriah
// This is a simplified algorithm - for production, consider using a proper library
export function gregorianToHijriah(date: Date): HijriahDate {
  const gregorianEpoch = 1721425.5;
  const islamicEpoch = 1948439.5;
  
  const jd = Math.floor((1461 * (date.getFullYear() + 4800 + Math.floor((date.getMonth() + 1 - 14) / 12))) / 4) +
    Math.floor((367 * (date.getMonth() + 1 - 2 - 12 * Math.floor((date.getMonth() + 1 - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((date.getFullYear() + 4900 + Math.floor((date.getMonth() + 1 - 14) / 12)) / 100)) / 4) +
    date.getDate() - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remaining = l - 10631 * n + 354;
  const j = Math.floor((10985 - remaining) / 5316) * Math.floor((50 * remaining) / 17719) +
    Math.floor(remaining / 5670) * Math.floor((43 * remaining) / 15238);
  const adjustedRemaining = remaining - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;

  const month = Math.floor((24 * adjustedRemaining) / 709);
  const day = adjustedRemaining - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day };
}

// Check if current date is within Ramadan
export function isRamadan(date: Date = new Date()): boolean {
  const hijri = gregorianToHijriah(date);
  return hijri.month === 9; // Ramadan is month 9
}

// Check if current date is Eid al-Fitr (1-3 Syawal)
export function isEidAlFitr(date: Date = new Date()): boolean {
  const hijri = gregorianToHijriah(date);
  return hijri.month === 10 && hijri.day >= 1 && hijri.day <= 3;
}

// Check if current date is Eid al-Adha (10-13 Dzulhijjah)
export function isEidAlAdha(date: Date = new Date()): boolean {
  const hijri = gregorianToHijriah(date);
  return hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13;
}

// Check if current date is Maulid Nabi (12 Rabiul Awal)
export function isMaulidNabi(date: Date = new Date()): boolean {
  const hijri = gregorianToHijriah(date);
  return hijri.month === 3 && hijri.day >= 11 && hijri.day <= 13;
}

// Check if current date is Isra Miraj (27 Rajab)
export function isIsraMiraj(date: Date = new Date()): boolean {
  const hijri = gregorianToHijriah(date);
  return hijri.month === 7 && hijri.day >= 26 && hijri.day <= 28;
}

// Check if current date is Islamic New Year (1 Muharram)
export function isIslamicNewYear(date: Date = new Date()): boolean {
  const hijri = gregorianToHijriah(date);
  return hijri.month === 1 && hijri.day >= 1 && hijri.day <= 3;
}

export function getCurrentHijriahDate(): HijriahDate {
  return gregorianToHijriah(new Date());
}

export function formatHijriahDate(date: HijriahDate): string {
  return `${date.day} ${ISLAMIC_MONTHS[date.month - 1]} ${date.year}H`;
}
