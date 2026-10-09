/**
 * Sotuv bosqichlari (status) ta'riflari va rang palitrasi.
 *
 * Statuslar endi DINAMIK — foydalanuvchi qo'shishi, nomini o'zgartirishi,
 * rangini tanlashi va o'chirishi mumkin (statusStore.ts ga qarang).
 * Saqlash joyi: localStorage. Keyinchalik backend'ga ko'chirish oson —
 * faqat statusStorage.ts ni almashtirish kifoya.
 */

/** Status identifikatori (endi erkin matn, slug ko'rinishida) */
export type StatusKey = string;

/** Rang varianti — Tailwind klasslari to'plami */
export interface StatusColor {
  key: string;
  label: string;
  /** Pill (chip) uchun klasslar */
  badge: string;
  /** Nuqta uchun klasslar */
  dot: string;
  /** Progress bar uchun klasslar */
  track: string;
}

export const STATUS_COLORS: StatusColor[] = [
  {
    key: 'slate',
    label: 'Kulrang',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    track: 'bg-slate-400',
  },
  {
    key: 'blue',
    label: 'Koʻk',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    dot: 'bg-blue-500',
    track: 'bg-blue-500',
  },
  {
    key: 'amber',
    label: 'Sariq',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500',
    track: 'bg-amber-500',
  },
  {
    key: 'emerald',
    label: 'Yashil',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-500',
    track: 'bg-emerald-500',
  },
  {
    key: 'rose',
    label: 'Qizil',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
    dot: 'bg-rose-500',
    track: 'bg-rose-500',
  },
  {
    key: 'violet',
    label: 'Binafsha',
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
    dot: 'bg-violet-500',
    track: 'bg-violet-500',
  },
  {
    key: 'cyan',
    label: 'Moviy',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    dot: 'bg-cyan-500',
    track: 'bg-cyan-500',
  },
  {
    key: 'orange',
    label: 'Olovrang',
    badge: 'bg-orange-50 text-orange-700 border-orange-100',
    dot: 'bg-orange-500',
    track: 'bg-orange-500',
  },
];

const COLOR_MAP = new Map<string, StatusColor>(STATUS_COLORS.map((c) => [c.key, c]));

export function getStatusColor(key: string | undefined): StatusColor {
  return COLOR_MAP.get(key ?? '') ?? STATUS_COLORS[0];
}

/** Status ta'rifi (saqlanadigan ma'lumot) */
export interface StatusDef {
  key: StatusKey;
  label: string;
  short: string;
  hint: string;
  /** STATUS_COLORS dagi rang kaliti */
  color: string;
}

/** Rang klasslari qo'shilgan (hisoblab chiqarilgan) status */
export interface ResolvedStatusDef extends StatusDef {
  badge: string;
  dot: string;
  track: string;
}

export function resolveStatus(def: StatusDef): ResolvedStatusDef {
  const color = getStatusColor(def.color);
  return { ...def, badge: color.badge, dot: color.dot, track: color.track };
}

/** Standart (boshlangʻich) sotuv bosqichlari */
export const DEFAULT_STATUSES: StatusDef[] = [
  {
    key: 'yangi',
    label: 'Yangi',
    short: 'Yangi',
    hint: 'Hali aloqa qilinmagan',
    color: 'slate',
  },
  {
    key: 'qongiroq',
    label: 'Qoʻngʻiroq qilindi',
    short: 'Qoʻngʻiroq',
    hint: 'Biznesga qoʻngʻiroq qilindi',
    color: 'blue',
  },
  {
    key: 'suhbat',
    label: 'Suhbatlashildi',
    short: 'Suhbat',
    hint: 'Muzokara boʻlib oʻtdi',
    color: 'amber',
  },
  {
    key: 'kelishildi',
    label: 'Kelishildi',
    short: 'Kelishildi',
    hint: 'Shartnoma boʻyicha kelishildi',
    color: 'emerald',
  },
  {
    key: 'rad_etildi',
    label: 'Rad etildi',
    short: 'Rad etildi',
    hint: 'Rad etildi yoki javob bermadi',
    color: 'rose',
  },
];

export const DEFAULT_STATUS: StatusKey = 'yangi';

/** Yorliqdan yagona kalit yasaydi (masalan "Yangi bosqich" -> "yangi_bosqich") */
export function makeStatusKey(label: string, existing: string[]): string {
  const base =
    String(label || '')
      .toLowerCase()
      .replace(/[‘’ʻ'`]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 32) || 'status';

  if (!existing.includes(base)) return base;
  let n = 2;
  while (existing.includes(`${base}_${n}`)) n += 1;
  return `${base}_${n}`;
}

/** Toast / xabar uchun qisqa nom */
export function shortLabel(label: string): string {
  const trimmed = String(label || '').trim();
  return trimmed.length > 14 ? `${trimmed.slice(0, 13)}…` : trimmed;
}
