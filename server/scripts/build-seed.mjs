/**
 * Xom ma'lumotlardan (src/data, src/instdata) seed JSON yasaydi:
 *   npm run seed:build   →   prisma/seed-data.json
 *
 * Bu fayl repoga commit qilinadi, shuning uchun Railway'da server
 * src papkasiga muhtoj bo'lmaydi — faqat prisma/seed-data.json yetarli.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDataset } from './normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, '../../prisma/seed-data.json');

const dataset = buildDataset();

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(dataset, null, 2) + '\n', 'utf8');

const { stats } = dataset;
console.log(`seed-data.json yozildi: ${outPath}`);
console.log(
  `  Jamoa a'zolari: ${stats.totalMembers} | Biznes yozuvlari: ${stats.totalRecords} | ` +
    `Shaharlar: ${stats.citiesCount} | Instagram bizneslar: ${stats.instagramCount}`
);
