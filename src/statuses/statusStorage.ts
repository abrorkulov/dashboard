import type { StatusKey } from './statuses';

/**
 * Statuslarni saqlash uchun xizmat (service) sathidagi abstraksiya.
 *
 * Hozircha localStorage ishlatiladi, lekin interfeys orqali kelajakda
 * Supabase / Express backend'ni qo'shish uchun shu yerni almashtirish
 * kifoya — UI kodiga tegish shart emas.
 */
export type StatusMap = Record<string, StatusKey>;

export interface StatusStorage {
  read(): StatusMap;
  write(map: StatusMap): void;
}

const STORAGE_KEY = 'biznes-baza.statuslar.v1';

function createLocalStorageStatusStorage(): StatusStorage {
  return {
    read() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? (parsed as StatusMap) : {};
      } catch {
        // JSON buzilgan bo'lsa — xatosiz bo'sh baza bilan davom etamiz
        return {};
      }
    },
    write(map) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch {
        // Saqlash imkoni bo'lmasa (masalan private mode) — jim o'tamiz
      }
    },
  };
}

/**
 * Hozircha localStorage. Kelajakda backend ulash uchun shu qatorni
 * masalan: createSupabaseStatusStorage() bilan almashtiring.
 */
export const statusStorage: StatusStorage = createLocalStorageStatusStorage();
