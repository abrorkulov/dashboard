import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getPrisma, hasDatabase } from './prisma.js';

const SEED_URL = new URL('../../prisma/seed-data.json', import.meta.url);

let fallbackCache = null;
function loadFallback() {
  if (!fallbackCache) {
    fallbackCache = JSON.parse(readFileSync(fileURLToPath(SEED_URL), 'utf8'));
  }
  return fallbackCache;
}

function mapRecord(r) {
  return {
    id: r.id,
    member: r.member,
    name: r.name,
    category: r.category,
    phone: r.phone ?? '',
    address: r.address ?? '',
    city: r.city,
    link: r.link ?? undefined,
    note: r.note ?? undefined,
    status: r.status ?? undefined,
    priority: r.priority ?? undefined,
    raw: r.raw ?? {},
  };
}

function shapeMember(m, records) {
  const recs = records.map(mapRecord);
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    initials: m.initials,
    color: m.color,
    city: m.city,
    recordsCount: recs.length,
    categories: Array.from(new Set(recs.map((r) => r.category))).slice(0, 4),
    records: recs,
  };
}

function shapeInstagram(row) {
  return {
    id: String(row.id),
    source: row.source,
    name: row.name,
    username: row.username ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    category: row.category ?? undefined,
    contact: row.contact ?? undefined,
    description: row.description ?? undefined,
    owner: row.owner ?? undefined,
  };
}

function computeStats(members, records, instagram) {
  const cities = Array.from(new Set(records.map((r) => r.city)));
  return {
    totalRecords: records.length,
    totalMembers: members.length,
    citiesCount: cities.length,
    verifiedPercentage: records.length
      ? Math.round((records.filter((r) => r.phone && r.phone.length > 5).length / records.length) * 100)
      : 0,
    cities,
    instagramCount: instagram.length,
  };
}

async function fromDb() {
  const prisma = getPrisma();
  const [dbMembers, dbInstagram] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { records: { orderBy: { createdAt: 'asc' } } },
    }),
    prisma.instagramBusiness.findMany({ orderBy: { id: 'asc' } }),
  ]);

  const members = dbMembers.map((m) => shapeMember(m, m.records));
  return { members, instagram: dbInstagram.map(shapeInstagram) };
}

function fromFallback() {
  const data = loadFallback();
  const members = (data.members || []).map((m) => shapeMember(m, m.records || []));
  const instagram = (data.instagram || []).map((row, idx) => shapeInstagram({ id: row.id ?? idx + 1, ...row }));
  return { members, instagram };
}

let lastSource = 'fallback';

/** Ma'lumotlarni (a'zolar + instagram) DB yoki JSON fayldan oladi. */
export async function resolveDataset() {
  if (hasDatabase) {
    try {
      const result = await fromDb();
      lastSource = 'database';
      return result;
    } catch (err) {
      console.warn(`[dataset] DB o'qishda xato, JSON fallback ishlatiladi: ${err.message}`);
    }
  }
  lastSource = 'fallback';
  return fromFallback();
}

export async function getMembers() {
  const { members } = await resolveDataset();
  return members;
}

export async function getRecords() {
  const { members } = await resolveDataset();
  return members.flatMap((m) => m.records);
}

export async function getInstagram() {
  const { instagram } = await resolveDataset();
  return instagram;
}

export async function getStats() {
  const { members, instagram } = await resolveDataset();
  const records = members.flatMap((m) => m.records);
  return computeStats(members, records, instagram);
}

export async function getBootstrap() {
  const { members, instagram } = await resolveDataset();
  const records = members.flatMap((m) => m.records);
  return {
    stats: computeStats(members, records, instagram),
    members,
    records,
    instagram,
    source: lastSource,
  };
}

export async function getDbStatus() {
  if (!hasDatabase) return 'fallback';
  try {
    await getPrisma().teamMember.count();
    return 'connected';
  } catch {
    return 'fallback';
  }
}

/** Yangi biznes yozuvini qo'shadi (DB yoki in-memory fallback). */
export async function createRecord(input) {
  const payload = {
    id: input.id || `custom-${Date.now()}`,
    member: input.member || 'Boshqa',
    name: (input.name || '').trim(),
    category: (input.category || 'Xizmatlar').trim(),
    phone: (input.phone || '').trim(),
    address: (input.address || '').trim(),
    city: input.city || 'Toshkent',
    link: input.link || null,
    note: input.note || null,
    status: input.status || 'verified',
    priority: input.priority || null,
    raw: input.raw || {},
  };

  if (hasDatabase) {
    try {
      const prisma = getPrisma();
      const member = await prisma.teamMember.findUnique({ where: { name: payload.member } });
      const created = await prisma.businessRecord.create({
        data: { ...payload, memberId: member ? member.id : null },
      });
      return mapRecord(created);
    } catch (err) {
      console.warn(`[dataset] DB'ga yozishda xato, faqat xotirada saqlanadi: ${err.message}`);
    }
  }

  const data = loadFallback();
  const record = mapRecord(payload);
  let member = (data.members || []).find((m) => m.name === payload.member);
  if (!member) {
    member = {
      id: `custom-${payload.member.toLowerCase()}`,
      name: payload.member,
      role: 'Qo‘shimcha',
      initials: payload.member.slice(0, 2).toUpperCase(),
      color: '#64748b',
      city: payload.city,
      records: [],
    };
    data.members = data.members || [];
    data.members.push(member);
  }
  member.records = member.records || [];
  member.records.push(record);
  return record;
}
