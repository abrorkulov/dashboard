# 🚀 Railway'ga joylashtirish — qadam-baqadam qoʻllanma

Bu loyihada endi **backend** bor: `Node.js + Express + Prisma + PostgreSQL`.
Bitta xizmat ham **API** (`/api/...`), ham yigʻilgan **saytni** (`dist/`) beradi —
shuning uchun Railwayʼda bitta servis yetarli.

> Maʼlumotlar `prisma/seed-data.json` faylida (482 biznes, 11 aʼzo, 50 Instagram biznes)
> va birinchi ishga tushishda avtomatik ravishda PostgreSQL bazasiga yoziladi.

---

## 📁 Muhim fayllar

| Fayl | Vazifasi |
|------|----------|
| `server/start.js` | Railway ishga tushadigan asosiy fayl (sxema + seed + server) |
| `server/app.js` | Express ilovasi (API + `dist/` sayt) |
| `server/routes/index.js` | REST endpointlar |
| `prisma/schema.prisma` | Baza sxemasi |
| `prisma/seed-data.json` | Barcha maʼlumotlar (seed) |
| `railway.json` | Railway build/start sozlamalari |
| `.env.example` | Muhit oʻzgaruvchilari namunasi |

---

## 1-qadam. Kodni GitHub'ga yuborish

Agar loyiha hali GitHubʼda boʻlmasa:

```bash
git add .
git commit -m "Backend (Express + Prisma) va Instagram bo'limi qo'shildi"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

> ⚠️ `.env` faylini **hech qachon** GitHub'ga yubormang — u `.gitignore`da.

---

## 2-qadam. Railwayʼda loyiha yaratish

1. [railway.app](https://railway.app) → **Login with GitHub**.
2. **New Project** → **Deploy from GitHub repo**.
3. Repozitoriyni tanlang. Railway `package.json`ni oʻqib, build va start
   buyruqlarini oʻzi aniqlaydi (`railway.json`dagi qiymatlar ishlatiladi):
   - **Build:** `npm install --include=dev && npm run build`
   - **Start:** `npm start` → `node server/start.js`
4. Kod yuklanishi boshlanadi. Hozircha **xato berishi mumkin** — bu normal,
   chunki hali baza yoʻq. Keyingi qadamda tuzatamiz.

---

## 3-qadam. PostgreSQL bazasini qoʻshish

1. Loyiha sahifasida **+ Create** (yoki **New**) → **Database** → **Add PostgreSQL**.
2. Kichik kutib turing — Postgres servisi paydo boʻladi (masalan nomi `Postgres`).

---

## 4-qadam. `DATABASE_URL` ni ulash

1. Ilova (web) servisini bosing → **Variables** boʻlimi.
2. **New Variable** → **Add Reference** (yoki qiymat maydoniga yozing):
   - **Name:** `DATABASE_URL`
   - **Value:** `${{Postgres.DATABASE_URL}}`
     (bu — Postgres servisiga havola; Railway haqiqiy ulanish satrini oʻzi qoʻyadi)
3. Ixtiyoriy: `CORS_ORIGIN=*` (frontend boshqa domenda boʻlsa — oʻsha domen).
4. **Deploy** tugmasini bosing (Railway oʻzgaruvchi oʻzgarganda avtomatik qayta deploy qiladi).

---

## 5-qadam. Birinchi deploy va seed tekshiruvi

Deploy tugagach, **Deploy Logs** ni oching. Quyidagilar chiqishi kerak:

```
[start] Sxema bazaga qo‘llanmoqda (prisma db push)...
🚀  Your database is now in sync with your Prisma schema.
[seed] Tayyor: 11 a'zo, 482 biznes yozuvi, 50 Instagram biznes
[start] Server <PORT>-portda ishga tushdi
```

Agar `[seed] Baza allaqachon toʻldirilgan` chiqsa — hammasi joyida,
qayta seed ishlamaydi (maʼlumotlar saqlanib qoladi).

---

## 6-qadam. Ommaviy domen (URL) yaratish

1. Ilova servisi → **Settings** → **Networking**.
2. **Public Networking** → **Generate Domain**.
3. Sizga shunga oʻxshash manzil beriladi:
   `https://your-app-production.up.railway.app`

Shu manzilni brauzerda oching — sayt ochilishi kerak.

---

## 7-qadam. Tekshirish ✅

| Nima | Qanday tekshirish |
|------|-------------------|
| Server tirik | `https://<domen>/api/health` → `{"status":"ok","database":"connected"}` |
| Baza ulangan | yuqoridagi javobda `"database":"connected"` |
| Maʼlumot bor | `https://<domen>/api/stats` → `totalRecords: 482` |
| Instagram boʻlimi | `https://<domen>/api/instagram` → `count: 50` |
| Sayt ishlaydi | `https://<domen>/` va `https://<domen>/instagram` |

Chap paneldagi «Tizim holati» yozuvida **SERVER** koʻrinsa — sayt bazaga ulangan.

---

## 🧩 API endpointlar

| Metod | Yoʻl | Tavsif |
|-------|------|--------|
| GET | `/api/health` | Server va baza holati |
| GET | `/api/bootstrap` | Hammasi birdan (frontend shuni chaqiradi) |
| GET | `/api/stats` | Umumiy statistika |
| GET | `/api/members` | Jamoa aʼzolari (yozuvlari bilan) |
| GET | `/api/records` | Bizneslar (filtr: `?city=&member=&category=&search=`) |
| POST | `/api/records` | Yangi biznes qoʻshish |
| GET | `/api/instagram` | Instagram bizneslar (filtr: `?source=&category=&search=`) |

---

## 💻 Lokal kompyuterda ishga tushirish

```bash
# 1) Bogʻliqliklarni oʻrnatish
npm install

# 2) Muhit faylini yaratish
cp .env.example .env
#   .env ichida DATABASE_URL ni lokal PostgreSQL manziliga oʻzgartiring

# 3) Bazani tayyorlash + seed
npx prisma db push
npm run seed -- --force

# 4) Backend'ni ishga tushirish  (http://localhost:4000)
npm run server

# Boshqa terminalda — frontend (Vite dev server, /api ni 4000 ga proksi qiladi)
npm run dev
```

> **Baza boʻlmasa ham ishlaydi:** `DATABASE_URL` berilmasa, server
> `prisma/seed-data.json` faylidan oʻqiydi (`/api/health` da `"database":"fallback"`).
> Bu lokal sinov uchun qulay.

---

## 🔁 Maʼlumotlarni yangilash (qayta seed)

`src/data` yoki `src/instdata` ichidagi maʼlumotlarni oʻzgartirganingizdan keyin:

```bash
npm run seed:build     # prisma/seed-data.json ni qayta yasaydi
git add prisma/seed-data.json && git commit -m "Ma'lumotlar yangilandi" && git push
```

Railway'da bazani toʻliq qayta yozish uchun servis **Shell**ʼida:

```bash
npm run seed -- --force
```

---

## 🛠 Muammolar va yechimlar

| Muammo | Yechim |
|--------|--------|
| `Environment variable not found: DATABASE_URL` | 4-qadam: `DATABASE_URL` reference qoʻshilmagan |
| Log'da `P1001: Can't reach database server` | Postgres servisi hali tayyor emas — 1-2 daqiqa kutib, **Redeploy** qiling |
| Sayt ochiladi, lekin «LOKAL» koʻrinadi | `/api/health` ni tekshiring; API ishlamayapti — deploy loglarni koʻring |
| `npm run build` xatosi (tsc/vite topilmadi) | Build buyrugʻida `--include=dev` boʻlishi shart (railway.json'da bor) |
| Baza boʻsh | Servis Shell'da: `npm run seed -- --force` |

---

## 🌐 (Ixtiyoriy) Frontendni alohida joylashtirish

Agar saytni Railway'dan boshqa joyda (masalan Vercel) joylashtirmoqchi boʻlsangiz:

1. Vercel'da `VITE_API_URL=https://<railway-domen>/api` qilib build qiling.
2. Railway'dagi ilova servisida `CORS_ORIGIN=https://<vercel-domen>` qoʻying.

Standart holatda esa buni qilish **shart emas** — bitta Railway servisi
ham saytni, ham API'ni beradi.
