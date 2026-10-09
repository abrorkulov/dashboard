import 'dotenv/config';
import { execSync } from 'node:child_process';

/**
 * Railway uchun ishga tushirish nuqtasi:
 *   1) DATABASE_URL bo'lsa — sxemani bazaga qo'llaydi (prisma db push)
 *   2) Baza bo'sh bo'lsa — seed-data.json bilan to'ldiradi
 *   3) Express serverni ishga tushiradi (API + dist/ sayt)
 */
async function main() {
  const port = Number(process.env.PORT) || 4000;

  if (!process.env.DATABASE_URL) {
    console.warn('[start] DATABASE_URL topilmadi — JSON fallback rejimida ishlaydi');
  } else {
    try {
      console.log('[start] Sxema bazaga qo‘llanmoqda (prisma db push)...');
      execSync('npx prisma db push --skip-generate --accept-data-loss --schema prisma/schema.prisma', {
        stdio: 'inherit',
      });
      const { runSeed } = await import('./seed.js');
      await runSeed();
    } catch (err) {
      console.error('[start] Bazani tayyorlashda xatolik:', err.message);
      console.error('[start] Server JSON fallback bilan davom etadi');
    }
  }

  const { createApp } = await import('./app.js');
  const app = createApp();

  app.listen(port, () => {
    console.log(`[start] Server ${port}-portda ishga tushdi`);
  });
}

main().catch((err) => {
  console.error('[start] Kritik xato:', err);
  process.exit(1);
});
