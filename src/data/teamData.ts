import abdullohData from './Abdulloh.js';
import abdumajidData from './Abdumajid.js';
import asadbekData from './Asadbek.js';
import bibixojarData from './BibiXojar.js';
import bilolData from './Bilol.js';
import ibrohimData from './Ibrohim.js';
import ilyosxojaData from './Ilyosxoja.js';
import javlonData from './Javlon.js';
import kamolData from './Kamol.js';
import mohiData from './Mohi.js';
import zohirshohData from './Zohirshoh.js';

import ibrohimInstData from '../instdata/IbrohimInst.js';
import ilyosxojaInstData from '../instdata/Ilyosxojainst.js';
import zohirshohInstData from '../instdata/Zohirshohinst.js';

export interface BusinessRecord {
  id: string;
  member: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  city: string;
  link?: string;
  note?: string;
  status?: 'verified' | 'pending' | 'active';
  priority?: string;
  raw: Record<string, any>;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  city: string;
  recordsCount: number;
  categories: string[];
  records: BusinessRecord[];
}

/** Instagram orqali topilgan biznes (src/instdata ma'lumotlari) */
export interface InstagramBusiness {
  id: string;
  source: string;
  name: string;
  username?: string;
  phone?: string;
  address?: string;
  category?: string;
  contact?: string;
  description?: string;
  owner?: string;
}

function normalizeUsername(value: unknown): string | undefined {
  if (!value) return undefined;
  let s = String(value).trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  if (m) s = m[1];
  s = s.replace(/^@+/, '').replace(/\/+$/, '').trim();
  return s || undefined;
}

function looksLikePhone(value: unknown): boolean {
  if (!value) return false;
  return /\+?\d[\d\s()-]{6,}/.test(String(value)) && !/telegram|instagram|профиль/i.test(String(value));
}

function buildInstagramBusinesses(): InstagramBusiness[] {
  const out: InstagramBusiness[] = [];

  (ibrohimInstData || []).forEach((item: any, idx: number) => {
    out.push({
      id: `ibrohim-inst-${item.id ?? idx + 1}`,
      source: 'Ibrohim',
      name: (item.biznesNomi || '').trim() || 'Instagram biznes',
      username: normalizeUsername(item.instagramUsername),
      phone: (item.telefon || '').trim() || undefined,
      address: (item.manzil || '').trim() || undefined,
      category: 'Instagram biznes',
      owner: [item.ism, item.familiya].filter(Boolean).join(' ').trim() || undefined,
    });
  });

  (ilyosxojaInstData || []).forEach((item: any, idx: number) => {
    out.push({
      id: `ilyosxoja-inst-${item.id ?? idx + 1}`,
      source: 'Ilyosxoja',
      name: (item.business_name || '').trim() || 'Instagram biznes',
      username: normalizeUsername(item.instagram_username),
      phone: looksLikePhone(item.contact) ? String(item.contact).trim() : undefined,
      category: (item.category || '').trim() || undefined,
      contact: (item.contact || '').trim() || undefined,
      description: (item.description || '').trim() || undefined,
    });
  });

  (zohirshohInstData || []).forEach((item: any, idx: number) => {
    const m = /\(([^)]+)\)/.exec(item.name || '');
    const rawPhone = (item.phone || '').trim();
    out.push({
      id: `zohirshoh-inst-${idx + 1}`,
      source: 'Zohirshoh',
      name: (item.name || '').replace(/\s*\([^)]*\)\s*/, ' ').trim() || 'Instagram biznes',
      username: normalizeUsername(m ? m[1] : undefined),
      phone: /не указан/i.test(rawPhone) ? undefined : rawPhone || undefined,
      address: (item.location || '').trim() || undefined,
      category: (item.category || '').trim() || undefined,
      contact: rawPhone || undefined,
    });
  });

  return out;
}

/** Instagram bizneslar (nolbop holat uchun frontend zaxirasi) */
export const allInstagramBusinesses: InstagramBusiness[] = buildInstagramBusinesses();

export const instagramSources: string[] = Array.from(
  new Set(allInstagramBusinesses.map((b) => b.source))
);

function detectCity(text: string, fallback: string): string {
  const lower = (text || '').toLowerCase();
  if (lower.includes('jizzax') || lower.includes('жиззах')) return 'Jizzax';
  if (lower.includes('toshkent') || lower.includes('ташкент') || lower.includes('chilonzor') || lower.includes('yunusobod') || lower.includes('sergeli')) return 'Toshkent';
  if (lower.includes('samarqand') || lower.includes('самарканд')) return 'Samarqand';
  if (lower.includes('buxoro') || lower.includes('бухара')) return 'Buxoro';
  if (lower.includes('qarshi') || lower.includes('карши') || lower.includes('qashqadaryo')) return 'Qarshi';
  if (lower.includes('andijon') || lower.includes('андижан')) return 'Andijon';
  if (lower.includes('farg') || lower.includes('ферган')) return 'Fargʻona';
  if (lower.includes('chirchiq')) return 'Chirchiq';
  if (lower.includes('qorgontepa')) return 'Qoʻrgʻontepa';
  if (lower.includes('urganch') || lower.includes('xorazm')) return 'Urganch';
  return fallback;
}

// Normalize Abdulloh
const abdullohRecords: BusinessRecord[] = (abdullohData || []).map((item: any, idx: number) => ({
  id: `abdulloh-${idx + 1}`,
  member: 'Abdulloh',
  name: item.business || 'Nomsiz biznes',
  category: 'Savdo va Xizmatlar',
  phone: item.phone || '',
  address: item.location || '',
  city: detectCity(item.location, 'Toshkent'),
  status: 'verified',
  raw: item,
}));

// Normalize Abdumajid (Jizzax - 50 ta biznes)
const abdumajidRecords: BusinessRecord[] = (abdumajidData || []).map((item: any, idx: number) => ({
  id: `abdumajid-${item.id || idx + 1}`,
  member: 'Abdumajid',
  name: item.name || 'Nomsiz biznes',
  category: item.name.toLowerCase().includes('salon') || item.name.toLowerCase().includes('barber')
    ? 'Goʻzallik & Saloni'
    : item.name.toLowerCase().includes('clinic') || item.name.toLowerCase().includes('dental') || item.name.toLowerCase().includes('dantist')
    ? 'Tibbiyot & Klinika'
    : item.name.toLowerCase().includes('restoran') || item.name.toLowerCase().includes('kafe') || item.name.toLowerCase().includes('oshxona')
    ? 'Restoran & Umumiy Ovqatlanish'
    : 'Savdo & Xizmatlar',
  phone: item.phone || '',
  address: item.address || 'Jizzax shahri',
  city: 'Jizzax',
  link: item.site || '',
  note: [
    item.telegram ? `Telegram: ${item.telegram}` : '',
    item.instagram ? `Instagram: ${item.instagram}` : '',
  ].filter(Boolean).join(' • '),
  status: item.phone ? 'verified' : 'pending',
  raw: item,
}));

// Normalize Asadbek
const asadbekRecords: BusinessRecord[] = (asadbekData || []).map((item: any, idx: number) => ({
  id: `asadbek-${item.id || idx + 1}`,
  member: 'Asadbek',
  name: item.name || 'Nomsiz biznes',
  category: item.sphere || 'Restoran va Xizmatlar',
  phone: item.phone || '',
  address: item.address || '',
  city: detectCity(item.address, 'Toshkent'),
  link: item.site || item.photo || '',
  note: [item.digital_status, item.offer].filter(Boolean).join(' • '),
  status: item.verification === 'confirmed' ? 'verified' : 'pending',
  priority: item.priority || 'Oʻrta',
  raw: item,
}));

// Normalize BibiXojar (Toshkent brendlar, doʻkonlar va kafelar)
const bibixojarRecords: BusinessRecord[] = (bibixojarData || []).map((item: any, idx: number) => ({
  id: `bibixojar-${item.id || idx + 1}`,
  member: 'BibiXojar',
  name: item.name || 'Nomsiz biznes',
  category: item.category || 'Savdo & Xizmatlar',
  phone: item.phone || '',
  address: item.address || '',
  city: detectCity(item.address, 'Toshkent'),
  link: item.instagram || item.telegram || '',
  note: [item.instagram, item.telegram, item.workingHours ? `Ish vaqti: ${item.workingHours}` : ''].filter(Boolean).join(' • '),
  status: item.phone ? 'verified' : 'pending',
  raw: item,
}));

// Normalize Bilol (Toshkent restoran, mehmonxona va bizneslar)
const bilolRecords: BusinessRecord[] = (bilolData || []).map((item: any, idx: number) => ({
  id: `bilol-${item.id || idx + 1}`,
  member: 'Bilol',
  name: item.business || 'Nomsiz biznes',
  category: /hotel|mehmonxona/i.test(item.business || '')
    ? 'Mehmonxona'
    : /restaurant|restoran|cafe|kafe|qozon|taom|food/i.test(item.business || '')
    ? 'Restoran & Kafe'
    : /fitness|spa/i.test(item.business || '')
    ? 'Sport & SPA'
    : /shop|store|market|mall|bazaar/i.test(item.business || '')
    ? 'Savdo & Doʻkon'
    : 'Biznes & Xizmatlar',
  phone: item.phone || '',
  address: item.region || '',
  city: /region/i.test(item.region || '') ? 'Toshkent viloyati' : detectCity(item.region, 'Toshkent'),
  note: [item.email, item.instagram].filter(Boolean).join(' • '),
  status: item.phone ? 'verified' : 'pending',
  raw: item,
}));

// Normalize Ibrohim
const ibrohimRecords: BusinessRecord[] = (ibrohimData || []).map((item: any, idx: number) => ({
  id: `ibrohim-${item.id || idx + 1}`,
  member: 'Ibrohim',
  name: item.name || 'Nomsiz biznes',
  category: item.type === 'market' ? 'Supermarket' : 'Restoran va Kafe',
  phone: item.phone || '',
  address: item.address || '',
  city: detectCity(item.address, 'Qarshi'),
  status: item.phone ? 'verified' : 'pending',
  raw: item,
}));

// Normalize Ilyosxoja
const ilyosxojaRecords: BusinessRecord[] = [];
if (ilyosxojaData && typeof ilyosxojaData === 'object') {
  Object.entries(ilyosxojaData).forEach(([categoryKey, list]) => {
    const formattedCategory = categoryKey
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    (list as any[]).forEach((item: any, idx: number) => {
      ilyosxojaRecords.push({
        id: `ilyos-${item.id || idx + 1}-${categoryKey}`,
        member: 'Ilyosxoja',
        name: item.biznes_nomi || 'Nomsiz biznes',
        category: item.faoiliyat_turi || formattedCategory,
        phone: item.telefon || '',
        address: [item.manzil, item.mojal ? `Moʻljal: ${item.mojal}` : ''].filter(Boolean).join(', '),
        city: detectCity(item.manzil || item.mojal, 'Toshkent'),
        link: item.link || '',
        status: 'verified',
        raw: item,
      });
    });
  });
}

// Normalize Javlon
const javlonRecords: BusinessRecord[] = [];
if (javlonData && typeof javlonData === 'object') {
  Object.entries(javlonData).forEach(([categoryKey, list]) => {
    const formattedCategory = categoryKey === 'choyxona_kafe'
      ? 'Choyxona va Kafe'
      : categoryKey === 'mexmonxonalar'
      ? 'Mehmonxonalar'
      : categoryKey === 'sport_majmualari'
      ? 'Sport Majmualari'
      : categoryKey.replace(/_/g, ' ');

    (list as any[]).forEach((item: any, idx: number) => {
      javlonRecords.push({
        id: `javlon-${idx + 1}-${categoryKey}`,
        member: 'Javlon',
        name: item.name || 'Nomsiz biznes',
        category: formattedCategory,
        phone: item.phone || '',
        address: 'Buxoro shahri',
        city: 'Buxoro',
        status: 'verified',
        raw: item,
      });
    });
  });
}

// Normalize Kamol
const kamolRecords: BusinessRecord[] = (kamolData || []).map((item: any, idx: number) => ({
  id: `kamol-${idx + 1}`,
  member: 'Kamol',
  name: item.name || 'Nomsiz biznes',
  category: item.category === 'restaurant' ? 'Restoran' : item.category === 'education' ? 'Taʼlim' : (item.category || 'Biznes'),
  phone: Array.isArray(item.contacts) ? item.contacts.join(', ') : (item.contacts || ''),
  address: item.city || 'Samarqand',
  city: item.city || 'Samarqand',
  link: item.link || '',
  status: 'verified',
  raw: item,
}));

// Normalize Mohi (onlayn / ijtimoiy tarmoq bizneslari)
const mohiRecords: BusinessRecord[] = (mohiData || []).map((item: any, idx: number) => ({
  id: `mohi-${idx + 1}`,
  member: 'Mohi',
  name: item.name || 'Nomsiz biznes',
  category: item.category || 'Boshqa',
  phone: item.phone || '',
  address: '',
  city: detectCity(item.name, 'Toshkent'),
  status: item.phone ? 'verified' : 'pending',
  raw: item,
}));

// Normalize Zohirshoh
const zohirshohRecords: BusinessRecord[] = (zohirshohData || []).map((item: any, idx: number) => ({
  id: `zohir-${idx + 1}`,
  member: 'Zohirshoh',
  name: item.name || 'Nomsiz biznes',
  category: 'Xizmat koʻrsatish va Savdo',
  phone: item.phone || '',
  address: item.location || '',
  city: detectCity(item.location, 'Toshkent'),
  status: 'verified',
  raw: item,
}));

export const allBusinessRecords: BusinessRecord[] = [
  ...abdullohRecords,
  ...abdumajidRecords,
  ...asadbekRecords,
  ...bibixojarRecords,
  ...bilolRecords,
  ...ibrohimRecords,
  ...ilyosxojaRecords,
  ...javlonRecords,
  ...kamolRecords,
  ...mohiRecords,
  ...zohirshohRecords,
];

function getCategories(records: BusinessRecord[]): string[] {
  return Array.from(new Set(records.map(r => r.category))).slice(0, 4);
}

export const allTeamMembers: TeamMember[] = [
  {
    id: 'abdulloh',
    name: 'Abdulloh',
    role: 'Toshkent Savdo & Xizmatlar',
    initials: 'AB',
    color: '#3b82f6',
    city: 'Toshkent',
    recordsCount: abdullohRecords.length,
    categories: getCategories(abdullohRecords),
    records: abdullohRecords,
  },
  {
    id: 'abdumajid',
    name: 'Abdumajid',
    role: 'Jizzax Saloni & Tibbiyot',
    initials: 'AM',
    color: '#06b6d4',
    city: 'Jizzax',
    recordsCount: abdumajidRecords.length,
    categories: getCategories(abdumajidRecords),
    records: abdumajidRecords,
  },
  {
    id: 'asadbek',
    name: 'Asadbek',
    role: 'Digital Audit & Restoranlar',
    initials: 'AS',
    color: '#8b5cf6',
    city: 'Toshkent',
    recordsCount: asadbekRecords.length,
    categories: getCategories(asadbekRecords),
    records: asadbekRecords,
  },
  {
    id: 'bibixojar',
    name: 'BibiXojar',
    role: 'Toshkent Brendlar & Savdo',
    initials: 'BX',
    color: '#e11d48',
    city: 'Toshkent',
    recordsCount: bibixojarRecords.length,
    categories: getCategories(bibixojarRecords),
    records: bibixojarRecords,
  },
  {
    id: 'bilol',
    name: 'Bilol',
    role: 'Toshkent Restoran & Mehmonxona',
    initials: 'BI',
    color: '#f97316',
    city: 'Toshkent',
    recordsCount: bilolRecords.length,
    categories: getCategories(bilolRecords),
    records: bilolRecords,
  },
  {
    id: 'ibrohim',
    name: 'Ibrohim',
    role: 'Qarshi Bozor & Restoranlar',
    initials: 'IB',
    color: '#ec4899',
    city: 'Qarshi',
    recordsCount: ibrohimRecords.length,
    categories: getCategories(ibrohimRecords),
    records: ibrohimRecords,
  },
  {
    id: 'ilyosxoja',
    name: 'Ilyosxoja',
    role: 'Taʼlim, Klinika & Servis',
    initials: 'IL',
    color: '#14b8a6',
    city: 'Toshkent',
    recordsCount: ilyosxojaRecords.length,
    categories: getCategories(ilyosxojaRecords),
    records: ilyosxojaRecords,
  },
  {
    id: 'javlon',
    name: 'Javlon',
    role: 'Buxoro Mehmonxona & Kafe',
    initials: 'JA',
    color: '#f59e0b',
    city: 'Buxoro',
    recordsCount: javlonRecords.length,
    categories: getCategories(javlonRecords),
    records: javlonRecords,
  },
  {
    id: 'kamol',
    name: 'Kamol',
    role: 'Samarqand Restoran & Taʼlim',
    initials: 'KA',
    color: '#ef4444',
    city: 'Samarqand',
    recordsCount: kamolRecords.length,
    categories: getCategories(kamolRecords),
    records: kamolRecords,
  },
  {
    id: 'mohi',
    name: 'Mohi',
    role: 'Onlayn Savdo & Xizmatlar',
    initials: 'MO',
    color: '#a855f7',
    city: 'Toshkent',
    recordsCount: mohiRecords.length,
    categories: getCategories(mohiRecords),
    records: mohiRecords,
  },
  {
    id: 'zohirshoh',
    name: 'Zohirshoh',
    role: 'Toshkent Klinika & Mebel',
    initials: 'ZO',
    color: '#10b981',
    city: 'Toshkent',
    recordsCount: zohirshohRecords.length,
    categories: getCategories(zohirshohRecords),
    records: zohirshohRecords,
  },
];

export interface SummaryStats {
  totalRecords: number;
  totalMembers: number;
  citiesCount: number;
  verifiedPercentage: number;
  cities: string[];
  instagramCount: number;
}

export const summaryStats: SummaryStats = {
  totalRecords: allBusinessRecords.length,
  totalMembers: allTeamMembers.length,
  citiesCount: new Set(allBusinessRecords.map(r => r.city)).size,
  verifiedPercentage: Math.round(
    (allBusinessRecords.filter(r => r.phone && r.phone.length > 5).length / allBusinessRecords.length) * 100
  ),
  cities: Array.from(new Set(allBusinessRecords.map(r => r.city))),
  instagramCount: allInstagramBusinesses.length,
};

export function exportToCSV(records: BusinessRecord[], filename = 'business-data.csv') {
  const headers = ['ID', 'Aʼzo', 'Biznes Nomi', 'Kategoriya', 'Telefon', 'Shahar', 'Manzil', 'Havola'];
  const rows = records.map(r => [
    `"${r.id}"`,
    `"${r.member}"`,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.city || '').replace(/"/g, '""')}"`,
    `"${(r.address || '').replace(/"/g, '""')}"`,
    `"${(r.link || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(records: BusinessRecord[], filename = 'business-data.json') {
  const jsonContent = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
