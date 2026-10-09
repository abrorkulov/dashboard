import { createContext, useContext } from 'react';
import type {
  BusinessRecord,
  InstagramBusiness,
  SummaryStats,
  TeamMember,
} from './teamData';

export type DataSource = 'api' | 'local';

export interface AppData {
  records: BusinessRecord[];
  members: TeamMember[];
  stats: SummaryStats;
  instagram: InstagramBusiness[];
  loading: boolean;
  error: string | null;
  source: DataSource;
  addRecord: (record: BusinessRecord) => Promise<void>;
}

export const DataContext = createContext<AppData | null>(null);

export function useAppData(): AppData {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useAppData faqat <DataProvider> ichida ishlatiladi');
  }
  return ctx;
}
