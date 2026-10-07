import { useCallback, useSyncExternalStore } from 'react';
import { DEFAULT_STATUS, type StatusKey } from './statuses';
import { statusStorage, type StatusMap } from './statusStorage';

/**
 * Global status holati (store).
 * Context'siz ishlaydi: useSyncExternalStore + localStorage.
 * Sahifa qayta yuklansa ham statuslar saqlanib qoladi.
 */

let statusMap: StatusMap = statusStorage.read();

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): StatusMap {
  return statusMap;
}

export function setRecordStatus(recordId: string, status: StatusKey): void {
  if (statusMap[recordId] === status) return;
  statusMap = { ...statusMap, [recordId]: status };
  statusStorage.write(statusMap);
  emit();
}

/** Barcha statuslar xaritasi: { [recordId]: StatusKey } */
export function useStatusMap(): StatusMap {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Bitta yozuvning statusi (topilmasa — 'yangi') */
export function useRecordStatus(recordId: string): StatusKey {
  const map = useStatusMap();
  return map[recordId] ?? DEFAULT_STATUS;
}

/** Yozuvni o'zgartirish funksiyasi (barqaror reference — qayta render uchun) */
export function useSetRecordStatus(): (recordId: string, status: StatusKey) => void {
  return useCallback((recordId: string, status: StatusKey) => {
    setRecordStatus(recordId, status);
  }, []);
}

/** Yozuvlar ro'yxati bo'yicha sotuv bosqichlari statistikasi */
export function countStatuses(ids: string[], map: StatusMap): Record<StatusKey, number> {
  const counts: Record<StatusKey, number> = {
    yangi: 0,
    qongiroq: 0,
    suhbat: 0,
    kelishildi: 0,
    rad_etildi: 0,
  };
  for (const id of ids) {
    const key = map[id] ?? DEFAULT_STATUS;
    counts[key] += 1;
  }
  return counts;
}
