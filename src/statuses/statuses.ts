/**
 * Biznes yozuvlari uchun sotuv bosqichlari (funnel) statuslari.
 * Statuslar data-fayllarda SAQLANMAYDI — ular faqat UI darajasida,
 * localStorage orqali (keyinroq backend/Supabase ulash oson bo'lishi uchun).
 */

export type StatusKey = 'yangi' | 'qongiroq' | 'suhbat' | 'kelishildi' | 'rad_etildi';

export interface StatusDef {
  key: StatusKey;
  /** To'liq nom (ro'yxatlar, selectlar uchun) */
  label: string;
  /** Qisqa nom (jadvallar, kartochkalar uchun) */
  short: string;
  /** Izoh / bosqich izohi */
  hint: string;
  /** Pill (chip) uchun Tailwind klasslari */
  badge: string;
  /** Nuqta uchun Tailwind klasslari */
  dot: string;
  /** Sarflanayotgan ustun (progress bar) uchun fon */
  track: string;
}

export const STATUS_FLOW: StatusDef[] = [
  {
    key: 'yangi',
    label: 'Yangi',
    short: 'Yangi',
    hint: 'Hali aloqa qilinmagan',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    track: 'bg-slate-400',
  },
  {
    key: 'qongiroq',
    label: 'Qoʻngʻiroq qilindi',
    short: 'Qoʻngʻiroq',
    hint: 'Biznesga qoʻngʻiroq qilindi',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    dot: 'bg-blue-500',
    track: 'bg-blue-500',
  },
  {
    key: 'suhbat',
    label: 'Suhbatlashildi',
    short: 'Suhbat',
    hint: 'Muzokara boʻlib oʻtdi',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500',
    track: 'bg-amber-500',
  },
  {
    key: 'kelishildi',
    label: 'Kelishildi',
    short: 'Kelishildi',
    hint: 'Shartnoma boʻyicha kelishildi',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-500',
    track: 'bg-emerald-500',
  },
  {
    key: 'rad_etildi',
    label: 'Rad etildi',
    short: 'Rad etildi',
    hint: 'Rad etildi yoki javob bermadi',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
    dot: 'bg-rose-500',
    track: 'bg-rose-500',
  },
];

export const DEFAULT_STATUS: StatusKey = 'yangi';

const STATUS_MAP = new Map<StatusKey, StatusDef>(STATUS_FLOW.map((s) => [s.key, s]));

export function getStatusDef(key: StatusKey | undefined | null): StatusDef {
  return STATUS_MAP.get(key ?? DEFAULT_STATUS) ?? STATUS_MAP.get(DEFAULT_STATUS)!;
}
