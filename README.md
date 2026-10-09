# Biznes Baza — CRM boshqaruv paneli

Biznes maʼlumotlari bazasi va jamoa faoliyati uchun CRM dashboard.

## Tuzilma

- **Frontend** — React 19 + Vite + TypeScript + Tailwind 4 (`src/`)
- **Backend** — Node.js + Express + Prisma + PostgreSQL (`server/`, `prisma/`)

Backend bitta xizmat sifatida ham REST API (`/api/...`), ham yigʻilgan frontend'ni
(`dist/`) beradi — Railway'ga bitta servis bilan joylashtiriladi.

## Sahifalar

| Yoʻl | Sahifa |
|------|--------|
| `/` | Asosiy panel |
| `/team` | Jamoa aʼzolari |
| `/records` | Barcha bizneslar |
| `/instagram` | **Instagram Bissnesezz** (src/instdata maʼlumotlari) |
| `/analytics` | Statistika va tahlil |

## Ishga tushirish

```bash
npm install
npm run build      # frontend + prisma generate
npm start          # API + sayt (http://localhost:4000)
```

Batafsil (Railway'ga joylashtirish, seed, endpointlar) — [RAILWAY.md](RAILWAY.md).
Railway limiti tugasa yoki boshqa hosting kerak bo'lsa — [DEPLOY.md](DEPLOY.md)
(Northflank, Render, Neon, Tiger Cloud va boshqalar).

> Kirish sahifasi: `/login` — vaqtinchalik hisob `admin` / `admin123`
> (backend ishga tushgach `ADMIN_LOGIN` / `ADMIN_PASSWORD` orqali tekshiriladi).

## Buyruqlar

| Buyruq | Vazifasi |
|--------|----------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Frontend'ni yigʻish |
| `npm start` | Backend'ni ishga tushirish (Railway uchun) |
| `npm run server` | Backend'ni lokal ishga tushirish |
| `npm run db:push` | Prisma sxemasini bazaga qoʻllash |
| `npm run seed` | Bazani seed qilish (`-- --force` bilan qayta yozish) |
| `npm run seed:build` | `prisma/seed-data.json` ni qayta yasash |
| `npm run lint` | Oxlint |

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
