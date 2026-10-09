import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getPrisma, hasDatabase } from './lib/prisma.js';

const SEED_URL = new URL('../prisma/seed-data.json', import.meta.url);

function loadSeedData() {
  return JSON.parse(readFileSync(fileURLToPath(SEED_URL), 'utf8'));
}

/**
 * Bazani to'ldiradi.
 *  - baza bo'sh bo'lsa: to'ldiradi
 *  - force = true: avval hammasini o'chirib, qaytadan to'ldiradi
 */
export async function runSeed({ force = false, log = console.log } = {}) {
  if (!hasDatabase) {
    log('[seed] DATABASE_URL yo‘q — seed o‘tkazib yuborildi (JSON fallback ishlaydi)');
    return { skipped: true };
  }

  const data = loadSeedData();
  const prisma = getPrisma();

  const existing = await prisma.teamMember.count();
  if (existing > 0 && !force) {
    log(`[seed] Baza allaqachon to‘ldirilgan (${existing} a'zo) — seed o‘tkazib yuborildi`);
    return { skipped: true, members: existing };
  }

  if (force) {
    log('[seed] Eski ma’lumotlar o‘chirilmoqda...');
    await prisma.instagramBusiness.deleteMany();
    await prisma.businessRecord.deleteMany();
    await prisma.teamMember.deleteMany();
  }

  let records = 0;
  for (const m of data.members || []) {
    await prisma.teamMember.upsert({
      where: { id: m.id },
      create: {
        id: m.id,
        name: m.name,
        role: m.role,
        initials: m.initials,
        color: m.color,
        city: m.city,
        sortOrder: m.sortOrder || 0,
      },
      update: {
        name: m.name,
        role: m.role,
        initials: m.initials,
        color: m.color,
        city: m.city,
        sortOrder: m.sortOrder || 0,
      },
    });

    const rows = (m.records || []).map((r) => ({
      id: r.id,
      memberId: m.id,
      member: r.member,
      name: r.name,
      category: r.category,
      phone: r.phone || '',
      address: r.address || '',
      city: r.city,
      link: r.link || null,
      note: r.note || null,
      status: r.status || null,
      priority: r.priority || null,
      raw: r.raw ?? {},
    }));

    if (rows.length) {
      await prisma.businessRecord.createMany({ data: rows, skipDuplicates: true });
      records += rows.length;
    }
  }

  const instaRows = (data.instagram || []).map((i) => ({
    source: i.source,
    name: i.name,
    username: i.username || null,
    phone: i.phone || null,
    address: i.address || null,
    category: i.category || null,
    contact: i.contact || null,
    description: i.description || null,
    owner: i.owner || null,
    raw: i.raw ?? {},
  }));
  if (instaRows.length) {
    await prisma.instagramBusiness.createMany({ data: instaRows });
  }

  log(
    `[seed] Tayyor: ${(data.members || []).length} a'zo, ${records} biznes yozuvi, ` +
      `${instaRows.length} Instagram biznes`
  );
  return { skipped: false, members: (data.members || []).length, records, instagram: instaRows.length };
}

// CLI: node server/seed.js [--force]
const invokedDirectly = process.argv[1] && process.argv[1].endsWith('seed.js');

if (invokedDirectly) {
  const force = process.argv.includes('--force');
  runSeed({ force })
    .catch((err) => {
      console.error('[seed] Xato:', err);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (hasDatabase) await getPrisma().$disconnect();
    });
}
