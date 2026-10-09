import { PrismaClient } from '@prisma/client';

/**
 * Prisma mijozini faqat kerak bo'lganda (lazy) yaratamiz.
 * DATABASE_URL bo'lmasa ham server ishga tushaveradi — u holda
 * seed-data.json fallback sifatida ishlatiladi (lib/dataset.js).
 */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

let client = null;

export function getPrisma() {
  if (!hasDatabase) {
    throw new Error('DATABASE_URL o‘rnatilmagan — Prisma mavjud emas');
  }
  if (!client) {
    client = new PrismaClient();
  }
  return client;
}
