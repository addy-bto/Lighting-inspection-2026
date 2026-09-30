export interface MonthOption {
  value: number;
  labelEn: string;
  labelMs: string;
  code: string;
}

export const MONTHS: MonthOption[] = [
  { value: 1, labelEn: 'January', labelMs: 'Januari', code: '01' },
  { value: 2, labelEn: 'February', labelMs: 'Februari', code: '02' },
  { value: 3, labelEn: 'March', labelMs: 'Mac', code: '03' },
  { value: 4, labelEn: 'April', labelMs: 'April', code: '04' },
  { value: 5, labelEn: 'May', labelMs: 'Mei', code: '05' },
  { value: 6, labelEn: 'June', labelMs: 'Jun', code: '06' },
  { value: 7, labelEn: 'July', labelMs: 'Julai', code: '07' },
  { value: 8, labelEn: 'August', labelMs: 'Ogos', code: '08' },
  { value: 9, labelEn: 'September', labelMs: 'September', code: '09' },
  { value: 10, labelEn: 'October', labelMs: 'Oktober', code: '10' },
  { value: 11, labelEn: 'November', labelMs: 'November', code: '11' },
  { value: 12, labelEn: 'December', labelMs: 'Disember', code: '12' },
];

export const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export interface MonthInfo {
  year: number;
  month: number;
  monthObj: MonthOption;
  lastDay: number;
  docId: string;
  docPrefix: string;
  periodText: string;
  periodTextMs: string;
  week1Range: string;
  week2Range: string;
  week3Range: string;
  week4Range: string;
  week2FormalRange: string;
  week2FormalRangeMs: string;
  week4FormalRange: string;
  week4FormalRangeMs: string;
  week1DefaultDate: string;
  week2DefaultDate: string;
  week3DefaultDate: string;
  week4DefaultDate: string;
  monthLabel: string;
  monthLabelEn: string;
  monthLabelMs: string;
  monthCode: string;
}

export function getMonthInfo(year: number, month: number): MonthInfo {
  const monthObj = MONTHS.find((m) => m.value === month) || MONTHS[7]; // Default August
  const lastDay = new Date(year, month, 0).getDate();
  const docId = `BT-LI-${year}${monthObj.code}`;
  const periodText = `1 ${monthObj.labelEn} - ${lastDay} ${monthObj.labelEn} ${year}`;
  const periodTextMs = `1 ${monthObj.labelMs} - ${lastDay} ${monthObj.labelMs} ${year}`;
  const week1Range = `01/${monthObj.code} - 07/${monthObj.code}`;
  const week2Range = `08/${monthObj.code} - 15/${monthObj.code}`;
  const week3Range = `16/${monthObj.code} - 22/${monthObj.code}`;
  const week4Range = `23/${monthObj.code} - ${lastDay}/${monthObj.code}`;
  const week2FormalRange = `08 - 14 ${monthObj.labelEn} ${year}`;
  const week2FormalRangeMs = `08 - 14 ${monthObj.labelMs} ${year}`;
  const week4FormalRange = `22 - 28 ${monthObj.labelEn} ${year}`;
  const week4FormalRangeMs = `22 - 28 ${monthObj.labelMs} ${year}`;
  const week1DefaultDate = `${year}-${monthObj.code}-05`;
  const week2DefaultDate = `${year}-${monthObj.code}-10`;
  const week3DefaultDate = `${year}-${monthObj.code}-19`;
  const week4DefaultDate = `${year}-${monthObj.code}-24`;

  return {
    year,
    month,
    monthObj,
    lastDay,
    docId,
    docPrefix: docId,
    periodText,
    periodTextMs,
    week1Range,
    week2Range,
    week3Range,
    week4Range,
    week2FormalRange,
    week2FormalRangeMs,
    week4FormalRange,
    week4FormalRangeMs,
    week1DefaultDate,
    week2DefaultDate,
    week3DefaultDate,
    week4DefaultDate,
    monthLabel: monthObj.labelEn,
    monthLabelEn: monthObj.labelEn,
    monthLabelMs: monthObj.labelMs,
    monthCode: monthObj.code,
  };
}
