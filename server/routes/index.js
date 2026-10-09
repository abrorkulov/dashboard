import { Router } from 'express';
import authRouter from './auth.js';
import {
  createRecord,
  getBootstrap,
  getDbStatus,
  getInstagram,
  getMembers,
  getRecords,
  getStats,
} from '../lib/dataset.js';

const router = Router();

// Autentifikatsiya (login)
router.use('/auth', authRouter);

router.get('/health', async (_req, res) => {
  res.json({
    status: 'ok',
    database: await getDbStatus(),
    time: new Date().toISOString(),
  });
});

/** Frontend bir marta chaqiradigan to'liq ma'lumot to'plami */
router.get('/bootstrap', async (_req, res) => {
  res.json(await getBootstrap());
});

router.get('/stats', async (_req, res) => {
  res.json(await getStats());
});

router.get('/members', async (_req, res) => {
  res.json(await getMembers());
});

router.get('/records', async (req, res) => {
  const { city, member, category, search } = req.query;
  let records = await getRecords();

  if (city) records = records.filter((r) => r.city.toLowerCase() === String(city).toLowerCase());
  if (member) records = records.filter((r) => r.member.toLowerCase() === String(member).toLowerCase());
  if (category) records = records.filter((r) => r.category.toLowerCase() === String(category).toLowerCase());
  if (search) {
    const q = String(search).toLowerCase();
    records = records.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.member.toLowerCase().includes(q)
    );
  }

  res.json({ count: records.length, records });
});

router.post('/records', async (req, res) => {
  const body = req.body || {};
  if (!body.name || !String(body.name).trim()) {
    return res.status(400).json({ error: 'name maydoni majburiy' });
  }
  try {
    const record = await createRecord(body);
    res.status(201).json(record);
  } catch (err) {
    console.error('[records] yozishda xato:', err);
    res.status(500).json({ error: 'Yozuvni saqlashda xatolik' });
  }
});

router.get('/instagram', async (req, res) => {
  const { source, category, search } = req.query;
  let items = await getInstagram();

  if (source) items = items.filter((i) => i.source.toLowerCase() === String(source).toLowerCase());
  if (category) items = items.filter((i) => (i.category || '').toLowerCase() === String(category).toLowerCase());
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.username || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q) ||
        (i.address || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q) ||
        (i.owner || '').toLowerCase().includes(q)
    );
  }

  res.json({ count: items.length, instagram: items });
});

export default router;
