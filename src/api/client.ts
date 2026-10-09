import type {
  BusinessRecord,
  InstagramBusiness,
  SummaryStats,
  TeamMember,
} from '../data/teamData';

export interface BootstrapPayload {
  stats: SummaryStats;
  members: TeamMember[];
  records: BusinessRecord[];
  instagram: InstagramBusiness[];
  source?: string;
}

/**
 * Backend manzili.
 *  - VITE_API_URL berilmasa: '/api' (server o'zi dist/ va API'ni birga beradi)
 *  - alohida API serveri bo'lsa: VITE_API_URL=https://<domen>/api
 */
const rawBase = (import.meta.env.VITE_API_URL as string | undefined) || '';
export const API_BASE = rawBase.replace(/\/+$/, '') || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API xatosi ${res.status} (${res.statusText})`);
  }
  return (await res.json()) as T;
}

export const api = {
  base: API_BASE,
  health: (signal?: AbortSignal) =>
    request<{ status: string; database: string }>('/health', { signal }),
  bootstrap: (signal?: AbortSignal) => request<BootstrapPayload>('/bootstrap', { signal }),
  createRecord: (record: Partial<BusinessRecord>) =>
    request<BusinessRecord>('/records', { method: 'POST', body: JSON.stringify(record) }),
};
