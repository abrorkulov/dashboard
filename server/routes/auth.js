import { Router } from 'express';
import { createHash, randomBytes } from 'node:crypto';

const router = Router();

/**
 * VAQTINCHALIK oddiy autentifikatsiya (talab bo'yicha sodda qilingan).
 *
 * Login/parol muhit o'zgaruvchilari orqali beriladi:
 *   ADMIN_LOGIN    (default: admin)
 *   ADMIN_PASSWORD (default: admin123)
 *
 * ⚠️ Bu to'liq xavfsizlik emas: token tekshirilmaydi va boshqa API
 * endpointlar hozircha ochiq. Keyinchalik haqiqiy sessiyalar/JWT,
 * parol hash'i va endpointlarni himoyalash kerak.
 */
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

router.post('/login', (req, res) => {
  const username = String(req.body?.username ?? '').trim();
  const password = String(req.body?.password ?? '');

  if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    const token = createHash('sha256')
      .update(`${username}:${Date.now()}:${randomBytes(8).toString('hex')}`)
      .digest('hex');
    return res.json({ ok: true, token, user: { username } });
  }

  return res.status(401).json({ ok: false, error: 'Login yoki parol xato' });
});

export default router;
