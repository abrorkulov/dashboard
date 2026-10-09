import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  DEFAULT_STATUS,
  DEFAULT_STATUSES,
  makeStatusKey,
  resolveStatus,
  shortLabel,
  type ResolvedStatusDef,
  type StatusDef,
  type StatusKey,
} from './statuses';
import {
  loadStatusDefs,
  loadStatusMap,
  saveStatusDefs,
  saveStatusMap,
  type StatusMap,
} from './statusStorage';

/**
 * Global status holati (store): status ta'riflari + yozuv statuslari xaritasi.
 * Context'siz ishlaydi: useSyncExternalStore + localStorage.
 * Sahifa qayta yuklansa ham hammasi saqlanib qoladi.
 */

let defs: StatusDef[] = loadStatusDefs();
let map: StatusMap = loadStatusMap();

interface StoreSnapshot {
  defs: StatusDef[];
  flow: ResolvedStatusDef[];
  map: StatusMap;
}

function makeSnapshot(): StoreSnapshot {
  return { defs, flow: defs.map(resolveStatus), map };
}

let snapshot: StoreSnapshot = makeSnapshot();

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreSnapshot {
  return snapshot;
}

function commit(): void {
  snapshot = makeSnapshot();
  listeners.forEach((listener) => listener());
}

function firstKey(): StatusKey {
  return defs[0]?.key ?? DEFAULT_STATUS;
}

/* ------------------------------------------------------------------ */
/*  Yozuv statusi                                                      */
/* ------------------------------------------------------------------ */

export function setRecordStatus(recordId: string, status: StatusKey): void {
  if (map[recordId] === status) return;
  map = { ...map, [recordId]: status };
  saveStatusMap(map);
  commit();
}

/** Barcha statuslar xaritasi: { [recordId]: StatusKey } */
export function useStatusMap(): StatusMap {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).map;
}

/** Joriy status ta'riflari (rang klasslari bilan) */
export function useStatusFlow(): ResolvedStatusDef[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).flow;
}

/** Bitta status ta'rifi (topilmasa — birinchisi) */
export function useStatusDef(key: StatusKey | undefined | null): ResolvedStatusDef {
  const flow = useStatusFlow();
  return flow.find((s) => s.key === key) ?? flow[0];
}

/** Bitta yozuvning statusi (topilmasa — birinchi status) */
export function useRecordStatus(recordId: string): StatusKey {
  const current = useStatusMap();
  return current[recordId] ?? firstKey();
}

/** Yozuv statusini o'zgartirish funksiyasi (barqaror reference) */
export function useSetRecordStatus(): (recordId: string, status: StatusKey) => void {
  return useCallback((recordId: string, status: StatusKey) => {
    setRecordStatus(recordId, status);
  }, []);
}

/** Yozuvlar ro'yxati bo'yicha sotuv bosqichlari statistikasi */
export function countStatuses(ids: string[], map_: StatusMap, keys: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const key of keys) counts[key] = 0;
  const fallback = keys[0] ?? DEFAULT_STATUS;
  for (const id of ids) {
    const key = map_[id] ?? fallback;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/*  Statuslarni boshqarish (CRUD)                                      */
/* ------------------------------------------------------------------ */

export interface StatusActions {
  add: (input: { label: string; color?: string; hint?: string }) => StatusDef;
  update: (key: StatusKey, patch: Partial<Pick<StatusDef, 'label' | 'hint' | 'short' | 'color'>>) => void;
  rename: (key: StatusKey, label: string) => void;
  remove: (key: StatusKey) => void;
  move: (key: StatusKey, direction: -1 | 1) => void;
  reset: () => void;
}

export function addStatus(input: { label: string; color?: string; hint?: string }): StatusDef {
  const label = (input.label || '').trim() || 'Yangi bosqich';
  const key = makeStatusKey(label, defs.map((d) => d.key));
  const def: StatusDef = {
    key,
    label,
    short: shortLabel(label),
    hint: (input.hint || '').trim() || 'Yangi sotuv bosqichi',
    color: input.color || 'violet',
  };
  defs = [...defs, def];
  saveStatusDefs(defs);
  commit();
  return def;
}

export function updateStatus(
  key: StatusKey,
  patch: Partial<Pick<StatusDef, 'label' | 'hint' | 'short' | 'color'>>
): void {
  defs = defs.map((d) => {
    if (d.key !== key) return d;
    const label = (patch.label ?? d.label).trim() || d.label;
    return {
      ...d,
      ...patch,
      label,
      short: patch.label !== undefined ? shortLabel(label) : d.short,
    };
  });
  saveStatusDefs(defs);
  commit();
}

export function renameStatus(key: StatusKey, label: string): void {
  updateStatus(key, { label });
}

/** Statusni o'chiradi; unda turgan yozuvlar birinchi statusga o'tadi. */
export function removeStatus(key: StatusKey): void {
  if (defs.length <= 1) return; // oxirgi statusni o'chirib bo'lmaydi
  const fallback = defs.find((d) => d.key !== key)?.key ?? DEFAULT_STATUS;
  defs = defs.filter((d) => d.key !== key);
  map = Object.fromEntries(
    Object.entries(map).map(([id, status]) => [id, status === key ? fallback : status])
  );
  saveStatusDefs(defs);
  saveStatusMap(map);
  commit();
}

export function moveStatus(key: StatusKey, direction: -1 | 1): void {
  const index = defs.findIndex((d) => d.key === key);
  if (index < 0) return;
  const target = index + direction;
  if (target < 0 || target >= defs.length) return;
  const next = [...defs];
  [next[index], next[target]] = [next[target], next[index]];
  defs = next;
  saveStatusDefs(defs);
  commit();
}

export function resetStatuses(): void {
  defs = DEFAULT_STATUSES.map((d) => ({ ...d }));
  saveStatusDefs(defs);
  commit();
}

/** Barqaror amallar to'plami (komponentlarda ishlatish uchun) */
export function useStatusActions(): StatusActions {
  return useMemo<StatusActions>(
    () => ({
      add: addStatus,
      update: updateStatus,
      rename: renameStatus,
      remove: removeStatus,
      move: moveStatus,
      reset: resetStatuses,
    }),
    []
  );
}
