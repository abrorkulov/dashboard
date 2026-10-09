import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import { DataContext, type AppData, type DataSource } from './dataContext';
import {
  allBusinessRecords,
  allInstagramBusinesses,
  allTeamMembers,
  summaryStats,
  type BusinessRecord,
  type InstagramBusiness,
  type SummaryStats,
  type TeamMember,
} from './teamData';

/**
 * Butun ilova uchun ma'lumot manbasi.
 * Ilova ochilganda backend'dan /api/bootstrap so'raladi. Server
 * javob bermasa — lokal (src/data) ma'lumotlar ko'rsatiladi.
 */
export function DataProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BusinessRecord[]>(allBusinessRecords);
  const [members, setMembers] = useState<TeamMember[]>(allTeamMembers);
  const [stats, setStats] = useState<SummaryStats>(summaryStats);
  const [instagram, setInstagram] = useState<InstagramBusiness[]>(allInstagramBusinesses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource>('local');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    api
      .bootstrap(controller.signal)
      .then((payload) => {
        if (!active) return;
        if (Array.isArray(payload.records)) setRecords(payload.records);
        if (Array.isArray(payload.members)) setMembers(payload.members);
        if (Array.isArray(payload.instagram)) setInstagram(payload.instagram);
        if (payload.stats) setStats(payload.stats);
        setSource('api');
        setError(null);
      })
      .catch(() => {
        if (!active || controller.signal.aborted) return;
        setSource('local');
        setError('Serverga ulanib boʻlmadi — lokal maʼlumotlar koʻrsatilmoqda.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const addRecord = useCallback(async (record: BusinessRecord) => {
    setRecords((prev) => [record, ...prev]);
    try {
      await api.createRecord(record);
    } catch {
      // Server mavjud bo'lmasa yozuv faqat joriy sessiyada ko'rinadi
    }
  }, []);

  const value = useMemo<AppData>(
    () => ({ records, members, stats, instagram, loading, error, source, addRecord }),
    [records, members, stats, instagram, loading, error, source, addRecord]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataProvider;
