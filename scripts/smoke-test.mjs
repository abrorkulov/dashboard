/**
 * Qo'lda ishga tushiriladigan smoke-test:
 *   node scripts/smoke-test.mjs
 * Xususiyatlarni tekshiradi: sahifalar ochiladi, xato yo'q,
 * status o'zgaradi va reload'dan keyin saqlanib qoladi.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://localhost:4173';
const SHOTS = new URL('../screenshots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

mkdirSync(SHOTS, { recursive: true });

const failures = [];
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const pageErrors = [];
page.on('pageerror', (err) => pageErrors.push(String(err)));
page.on('console', (msg) => {
  if (msg.type() === 'error') pageErrors.push(msg.text());
});

// 1. Barcha sahifalar ochiladi va render bo'ladi
const routes = [
  ['/', 'Asosiy panel'],
  ['/records', 'Barcha bizneslar'],
  ['/team', 'Jamoa aʼzolari'],
  ['/analytics', 'Statistika va tahlil'],
];
for (const [path, heading] of routes) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const h1 = await page.locator('h1').first().textContent();
  check(`Sahifa ochiladi: ${path}`, (h1 || '').includes(heading), `h1="${h1}"`);
  await page.screenshot({ path: `${SHOTS}${path === '/' ? 'home' : path.slice(1)}.png`, fullPage: false });
}

// 2. Statusni o'zgartirish va saqlanishi
await page.goto(BASE + '/records', { waitUntil: 'networkidle' });
const firstSelect = page.locator('select[aria-label="Statusni tanlash"]').first();
const before = await firstSelect.inputValue();
await firstSelect.selectOption('kelishildi');
check("Status o'zgaradi (yangi -> kelishildi)", (await firstSelect.inputValue()) === 'kelishildi', `old=${before}`);

await page.reload({ waitUntil: 'networkidle' });
const afterReload = await page.locator('select[aria-label="Statusni tanlash"]').first().inputValue();
check("Status reload'dan keyin saqlanadi", afterReload === 'kelishildi', `value=${afterReload}`);

// 3. Status filtri ishlaydi
await page.selectOption('select[aria-label="Status boʻyicha filtrlash"]', 'kelishildi');
await page.waitForTimeout(300);
const cards = await page.locator('text=Batafsil →').count();
const found = await page.locator('text=Topildi:').first().textContent();
check('Status filtri ishlaydi', cards >= 1 && cards < 24, `kartalar=${cards}, ${found?.trim()}`);

// 4. Filtr tozalanadi
await page.click('text=Filtrlarni tozalash');
await page.waitForTimeout(300);
const foundAll = await page.locator('text=Topildi:').first().textContent();
check('Filtrlar tozalanadi', /Topildi:\s*\d+ ta/.test(foundAll || ''), foundAll?.trim());

// 5. Biznes tafsilotlari ochiladi
await page.locator('.card').filter({ hasText: 'Batafsil →' }).first().click();
await page.waitForTimeout(400);
const dialog = await page.locator('[role="dialog"]').count();
check('Tafsilotlar modali ochiladi', dialog === 1);

// 6. Konsolda xato yo'q
check('Konsolda xato yo\'q', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} ta test yetmadi.`);
  process.exit(1);
}
console.log('\nBarcha testlar o\'tdi.');
