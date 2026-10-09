/**
 * Ma'lumotlarni normallashtirish (backend tomoni).
 *
 * Bu modul src/data va src/instdata ichidagi xom JS fayllarni o'qib,
 * frontend kutgan bir xil shaklga keltiradi va bitta dataset qaytaradi.
 * build-seed.mjs shu dataset'ni prisma/seed-data.json ga yozadi.
 */
import abdullohData from '../../src/data/Abdulloh.js';
import abdumajidData from '../../src/data/Abdumajid.js';
import asadbekData from '../../src/data/Asadbek.js';
import bibixojarData from '../../src/data/BibiXojar.js';
import bilolData from '../../src/data/Bilol.js';
import ibrohimData from '../../src/data/Ibrohim.js';
import ilyosxojaData from '../../src/data/Ilyosxoja.js';
import javlonData from '../../src/data/Javlon.js';
import kamolData from '../../src/data/Kamol.js';
import mohiData from '../../src/data/Mohi.js';
import zohirshohData from '../../src/data/Zohirshoh.js';

// instdata fayllari endi ES-modul (export default [...]) ko'rinishida.
import ibrohimInst from '../../src/instdata/IbrohimInst.js';
import ilyosxojaInst from '../../src/instdata/Ilyosxojainst.js';
import zohirshohInst from '../../src/instdata/Zohirshohinst.js';

function detectCity(text, fallback) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('jizzax') || lower.includes('жиззах')) return 'Jizzax';
  if (
    lower.includes('toshkent') ||
    lower.includes('ташкент') ||
    lower.includes('chilonzor') ||
    lower.includes('yunusobod') ||
    lower.includes('sergeli') ||
    lower.includes('чиланзар')
  ) {
    return 'Toshkent';
  }
  if (lower.includes('samarqand') || lower.includes('самарканд')) return 'Samarqand';
  if (lower.includes('buxoro') || lower.includes('бухара')) return 'Buxoro';
  if (lower.includes('qarshi') || lower.includes('карши') || lower.includes('qashqadaryo')) return 'Qarshi';
  if (lower.includes('andijon') || lower.includes('андижан')) return 'Andijon';
  if (lower.includes('farg') || lower.includes('ферган')) return 'Fargʻona';
  if (lower.includes('chirchiq')) return 'Chirchiq';
  if (lower.includes('qorgontepa')) return 'Qoʻrgʻontepa';
  if (lower.includes('urganch') || lower.includes('xorazm')) return 'Urganch';
  return fallback;
}

function buildMembers() {
  // Abdulloh
  const abdullohRecords = (abdullohData || []).map((item, idx) => ({
    id: `abdulloh-${idx + 1}`,
    member: 'Abdulloh',
    name: item.business || 'Nomsiz biznes',
    category: 'Savdo va Xizmatlar',
    phone: item.phone || '',
    address: item.location || '',
    city: detectCity(item.location, 'Toshkent'),
    status: 'verified',
    raw: item,
  }));

  // Abdumajid (Jizzax)
  const abdumajidRecords = (abdumajidData || []).map((item, idx) => {
    const n = (item.name || '').toLowerCase();
    const category =
      n.includes('salon') || n.includes('barber')
        ? 'Goʻzallik & Saloni'
        : n.includes('clinic') || n.includes('dental') || n.includes('dantist')
          ? 'Tibbiyot & Klinika'
          : n.includes('restoran') || n.includes('kafe') || n.includes('oshxona')
            ? 'Restoran & Umumiy Ovqatlanish'
            : 'Savdo & Xizmatlar';
    return {
      id: `abdumajid-${item.id || idx + 1}`,
      member: 'Abdumajid',
      name: item.name || 'Nomsiz biznes',
      category,
      phone: item.phone || '',
      address: item.address || 'Jizzax shahri',
      city: 'Jizzax',
      link: item.site || '',
      note: [item.telegram ? `Telegram: ${item.telegram}` : '', item.instagram ? `Instagram: ${item.instagram}` : '']
        .filter(Boolean)
        .join(' • '),
      status: item.phone ? 'verified' : 'pending',
      raw: item,
    };
  });

  // Asadbek
  const asadbekRecords = (asadbekData || []).map((item, idx) => ({
    id: `asadbek-${item.id || idx + 1}`,
    member: 'Asadbek',
    name: item.name || 'Nomsiz biznes',
    category: item.sphere || 'Restoran va Xizmatlar',
    phone: item.phone || '',
    address: item.address || '',
    city: detectCity(item.address, 'Toshkent'),
    link: item.site || item.photo || '',
    note: [item.digital_status, item.offer].filter(Boolean).join(' • '),
    status: item.verification === 'confirmed' ? 'verified' : 'pending',
    priority: item.priority || 'Oʻrta',
    raw: item,
  }));

  // BibiXojar
  const bibixojarRecords = (bibixojarData || []).map((item, idx) => ({
    id: `bibixojar-${item.id || idx + 1}`,
    member: 'BibiXojar',
    name: item.name || 'Nomsiz biznes',
    category: item.category || 'Savdo & Xizmatlar',
    phone: item.phone || '',
    address: item.address || '',
    city: detectCity(item.address, 'Toshkent'),
    link: item.instagram || item.telegram || '',
    note: [item.instagram, item.telegram, item.workingHours ? `Ish vaqti: ${item.workingHours}` : '']
      .filter(Boolean)
      .join(' • '),
    status: item.phone ? 'verified' : 'pending',
    raw: item,
  }));

  // Bilol
  const bilolRecords = (bilolData || []).map((item, idx) => ({
    id: `bilol-${item.id || idx + 1}`,
    member: 'Bilol',
    name: item.business || 'Nomsiz biznes',
    category: /hotel|mehmonxona/i.test(item.business || '')
      ? 'Mehmonxona'
      : /restaurant|restoran|cafe|kafe|qozon|taom|food/i.test(item.business || '')
        ? 'Restoran & Kafe'
        : /fitness|spa/i.test(item.business || '')
          ? 'Sport & SPA'
          : /shop|store|market|mall|bazaar/i.test(item.business || '')
            ? 'Savdo & Doʻkon'
            : 'Biznes & Xizmatlar',
    phone: item.phone || '',
    address: item.region || '',
    city: /region/i.test(item.region || '') ? 'Toshkent viloyati' : detectCity(item.region, 'Toshkent'),
    note: [item.email, item.instagram].filter(Boolean).join(' • '),
    status: item.phone ? 'verified' : 'pending',
    raw: item,
  }));

  // Ibrohim
  const ibrohimRecords = (ibrohimData || []).map((item, idx) => ({
    id: `ibrohim-${item.id || idx + 1}`,
    member: 'Ibrohim',
    name: item.name || 'Nomsiz biznes',
    category: item.type === 'market' ? 'Supermarket' : 'Restoran va Kafe',
    phone: item.phone || '',
    address: item.address || '',
    city: detectCity(item.address, 'Qarshi'),
    status: item.phone ? 'verified' : 'pending',
    raw: item,
  }));

  // Ilyosxoja (kategoriyalar obyekti)
  const ilyosxojaRecords = [];
  if (ilyosxojaData && typeof ilyosxojaData === 'object') {
    Object.entries(ilyosxojaData).forEach(([categoryKey, list]) => {
      const formattedCategory = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      (list || []).forEach((item, idx) => {
        ilyosxojaRecords.push({
          id: `ilyos-${item.id || idx + 1}-${categoryKey}`,
          member: 'Ilyosxoja',
          name: item.biznes_nomi || 'Nomsiz biznes',
          category: item.faoiliyat_turi || formattedCategory,
          phone: item.telefon || '',
          address: [item.manzil, item.mojal ? `Moʻljal: ${item.mojal}` : ''].filter(Boolean).join(', '),
          city: detectCity(item.manzil || item.mojal, 'Toshkent'),
          link: item.link || '',
          status: 'verified',
          raw: item,
        });
      });
    });
  }

  // Javlon (kategoriyalar obyekti)
  const javlonRecords = [];
  if (javlonData && typeof javlonData === 'object') {
    Object.entries(javlonData).forEach(([categoryKey, list]) => {
      const formattedCategory =
        categoryKey === 'choyxona_kafe'
          ? 'Choyxona va Kafe'
          : categoryKey === 'mexmonxonalar'
            ? 'Mehmonxonalar'
            : categoryKey === 'sport_majmualari'
              ? 'Sport Majmualari'
              : categoryKey.replace(/_/g, ' ');
      (list || []).forEach((item, idx) => {
        javlonRecords.push({
          id: `javlon-${idx + 1}-${categoryKey}`,
          member: 'Javlon',
          name: item.name || 'Nomsiz biznes',
          category: formattedCategory,
          phone: item.phone || '',
          address: 'Buxoro shahri',
          city: 'Buxoro',
          status: 'verified',
          raw: item,
        });
      });
    });
  }

  // Kamol
  const kamolRecords = (kamolData || []).map((item, idx) => ({
    id: `kamol-${idx + 1}`,
    member: 'Kamol',
    name: item.name || 'Nomsiz biznes',
    category:
      item.category === 'restaurant' ? 'Restoran' : item.category === 'education' ? 'Taʼlim' : item.category || 'Biznes',
    phone: Array.isArray(item.contacts) ? item.contacts.join(', ') : item.contacts || '',
    address: item.city || 'Samarqand',
    city: item.city || 'Samarqand',
    link: item.link || '',
    status: 'verified',
    raw: item,
  }));

  // Mohi
  const mohiRecords = (mohiData || []).map((item, idx) => ({
    id: `mohi-${idx + 1}`,
    member: 'Mohi',
    name: item.name || 'Nomsiz biznes',
    category: item.category || 'Boshqa',
    phone: item.phone || '',
    address: '',
    city: detectCity(item.name, 'Toshkent'),
    status: item.phone ? 'verified' : 'pending',
    raw: item,
  }));

  // Zohirshoh
  const zohirshohRecords = (zohirshohData || []).map((item, idx) => ({
    id: `zohir-${idx + 1}`,
    member: 'Zohirshoh',
    name: item.name || 'Nomsiz biznes',
    category: 'Xizmat koʻrsatish va Savdo',
    phone: item.phone || '',
    address: item.location || '',
    city: detectCity(item.location, 'Toshkent'),
    status: 'verified',
    raw: item,
  }));

  return [
    {
      id: 'abdulloh',
      name: 'Abdulloh',
      role: 'Toshkent Savdo & Xizmatlar',
      initials: 'AB',
      color: '#3b82f6',
      city: 'Toshkent',
      sortOrder: 1,
      records: abdullohRecords,
    },
    {
      id: 'abdumajid',
      name: 'Abdumajid',
      role: 'Jizzax Saloni & Tibbiyot',
      initials: 'AM',
      color: '#06b6d4',
      city: 'Jizzax',
      sortOrder: 2,
      records: abdumajidRecords,
    },
    {
      id: 'asadbek',
      name: 'Asadbek',
      role: 'Digital Audit & Restoranlar',
      initials: 'AS',
      color: '#8b5cf6',
      city: 'Toshkent',
      sortOrder: 3,
      records: asadbekRecords,
    },
    {
      id: 'bibixojar',
      name: 'BibiXojar',
      role: 'Toshkent Brendlar & Savdo',
      initials: 'BX',
      color: '#e11d48',
      city: 'Toshkent',
      sortOrder: 4,
      records: bibixojarRecords,
    },
    {
      id: 'bilol',
      name: 'Bilol',
      role: 'Toshkent Restoran & Mehmonxona',
      initials: 'BI',
      color: '#f97316',
      city: 'Toshkent',
      sortOrder: 5,
      records: bilolRecords,
    },
    {
      id: 'ibrohim',
      name: 'Ibrohim',
      role: 'Qarshi Bozor & Restoranlar',
      initials: 'IB',
      color: '#ec4899',
      city: 'Qarshi',
      sortOrder: 6,
      records: ibrohimRecords,
    },
    {
      id: 'ilyosxoja',
      name: 'Ilyosxoja',
      role: 'Taʼlim, Klinika & Servis',
      initials: 'IL',
      color: '#14b8a6',
      city: 'Toshkent',
      sortOrder: 7,
      records: ilyosxojaRecords,
    },
    {
      id: 'javlon',
      name: 'Javlon',
      role: 'Buxoro Mehmonxona & Kafe',
      initials: 'JA',
      color: '#f59e0b',
      city: 'Buxoro',
      sortOrder: 8,
      records: javlonRecords,
    },
    {
      id: 'kamol',
      name: 'Kamol',
      role: 'Samarqand Restoran & Taʼlim',
      initials: 'KA',
      color: '#ef4444',
      city: 'Samarqand',
      sortOrder: 9,
      records: kamolRecords,
    },
    {
      id: 'mohi',
      name: 'Mohi',
      role: 'Onlayn Savdo & Xizmatlar',
      initials: 'MO',
      color: '#a855f7',
      city: 'Toshkent',
      sortOrder: 10,
      records: mohiRecords,
    },
    {
      id: 'zohirshoh',
      name: 'Zohirshoh',
      role: 'Toshkent Klinika & Mebel',
      initials: 'ZO',
      color: '#10b981',
      city: 'Toshkent',
      sortOrder: 11,
      records: zohirshohRecords,
    },
  ];
}

function normalizeUsername(value) {
  if (!value) return undefined;
  let s = String(value).trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  if (m) s = m[1];
  s = s.replace(/^@+/, '').replace(/\/+$/, '').trim();
  return s || undefined;
}

function looksLikePhone(value) {
  if (!value) return false;
  return /\+?\d[\d\s()-]{6,}/.test(value) && !/telegram|instagram|профиль/i.test(value);
}

function buildInstagram() {
  const out = [];

  (ibrohimInst || []).forEach((item, idx) => {
    out.push({
      source: 'Ibrohim',
      name: (item.biznesNomi || '').trim() || 'Instagram biznes',
      username: normalizeUsername(item.instagramUsername),
      phone: (item.telefon || '').trim(),
      address: (item.manzil || '').trim(),
      category: 'Instagram biznes',
      contact: undefined,
      description: undefined,
      owner: [item.ism, item.familiya].filter(Boolean).join(' ').trim() || undefined,
      raw: { ...item, __order: idx + 1 },
    });
  });

  (ilyosxojaInst || []).forEach((item, idx) => {
    out.push({
      source: 'Ilyosxoja',
      name: (item.business_name || '').trim(),
      username: normalizeUsername(item.instagram_username),
      phone: looksLikePhone(item.contact) ? String(item.contact).trim() : undefined,
      address: undefined,
      category: (item.category || '').trim() || undefined,
      contact: (item.contact || '').trim() || undefined,
      description: (item.description || '').trim() || undefined,
      owner: undefined,
      raw: { ...item, __order: idx + 1 },
    });
  });

  (zohirshohInst || []).forEach((item, idx) => {
    const m = /\(([^)]+)\)/.exec(item.name || '');
    const rawPhone = (item.phone || '').trim();
    out.push({
      source: 'Zohirshoh',
      name: (item.name || '').replace(/\s*\([^)]*\)\s*/, ' ').trim(),
      username: normalizeUsername(m ? m[1] : undefined),
      phone: /не указан/i.test(rawPhone) ? undefined : rawPhone || undefined,
      address: (item.location || '').trim() || undefined,
      category: (item.category || '').trim() || undefined,
      contact: rawPhone || undefined,
      description: undefined,
      owner: undefined,
      raw: { ...item, __order: idx + 1 },
    });
  });

  return out;
}

export function buildDataset() {
  const members = buildMembers();
  const instagram = buildInstagram();
  const allRecords = members.flatMap((m) => m.records);

  const cities = Array.from(new Set(allRecords.map((r) => r.city)));
  const stats = {
    totalRecords: allRecords.length,
    totalMembers: members.length,
    citiesCount: cities.length,
    verifiedPercentage: allRecords.length
      ? Math.round((allRecords.filter((r) => r.phone && r.phone.length > 5).length / allRecords.length) * 100)
      : 0,
    cities,
    instagramCount: instagram.length,
  };

  return {
    generatedAt: new Date().toISOString(),
    stats,
    members,
    instagram,
  };
}
