import { DEFAULT_STATUSES, type StatusDef, type StatusKey } from './statuses';

/**
 * Statuslarni saqlash xizmati (service) sathidagi abstraksiya.
 *
 * Hozircha localStorage ishlatiladi, lekin interfeys orqali kelajakda
 * Express backend'ni qo'shish uchun shu yerni almashtirish kifoya.
 */
export type StatusMap = Record<string, StatusKey>;

const RECORD_MAP_KEY = 'biznes-baza.statuslar.v1';
const DEFS_KEY = 'biznes-baza.status-defs.v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    // JSON buzilgan bo'lsa — xatosiz fallback bilan davom etamiz
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Saqlash imkoni bo'lmasa (masalan private mode) — jim o'tamiz
  }
}

function isStatusDef(value: unknown): value is StatusDef {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.key === 'string' && typeof v.label === 'string' && v.key.length > 0;
}

/** Status ta'riflarini oʻqish (buzilgan boʻlsa — standartlar) */
export function loadStatusDefs(): StatusDef[] {
  const raw = readJson<unknown>(DEFS_KEY, null);
  if (!Array.isArray(raw)) return DEFAULT_STATUSES.map((d) => ({ ...d }));
  const defs = raw.filter(isStatusDef).map((d) => ({
    key: d.key,
    label: d.label,
    short: typeof d.short === 'string' && d.short ? d.short : d.label,
    hint: typeof d.hint === 'string' ? d.hint : '',
    color: typeof d.color === 'string' && d.color ? d.color : 'slate',
  }));
  return defs.length > 0 ? defs : DEFAULT_STATUSES.map((d) => ({ ...d }));
}

export function saveStatusDefs(defs: StatusDef[]): void {
  writeJson(DEFS_KEY, defs);
}

export function loadStatusMap(): StatusMap {
  const raw = readJson<unknown>(RECORD_MAP_KEY, {});
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: StatusMap = {};
  for (const [id, key] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof key === 'string') out[id] = key;
  }
  return out;
}

export function saveStatusMap(map: StatusMap): void {
  writeJson(RECORD_MAP_KEY, map);
}
