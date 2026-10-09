import { useMemo, useState } from 'react';
import {
  AtSign,
  Camera as InstagramIcon,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  Tag,
  UserRound,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAppData } from '../data/dataContext';
import type { InstagramBusiness } from '../data/teamData';

const SOURCE_LABELS: Record<string, string> = {
  Abdulloh: 'Abdulloh',
  Ibrohim: 'Ibrohim',
  Ilyosxoja: 'Ilyosxoja',
  Jahongir: 'Jahongir',
  Mohi: 'Mohi',
  Zohirshoh: 'Zohirshoh',
};

function instagramUrl(username?: string): string | undefined {
  if (!username) return undefined;
  return `https://instagram.com/${username.replace(/^@/, '')}`;
}

function exportInstagramCSV(items: InstagramBusiness[]) {
  const headers = ['ID', 'Manba', 'Nomi', 'Instagram', 'Telefon', 'Manzil', 'Kategoriya', 'Izoh'];
  const rows = items.map((i) => [
    `"${i.id}"`,
    `"${i.source}"`,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    `"${i.username || ''}"`,
    `"${(i.phone || '').replace(/"/g, '""')}"`,
    `"${(i.address || '').replace(/"/g, '""')}"`,
    `"${(i.category || '').replace(/"/g, '""')}"`,
    `"${(i.description || i.contact || '').replace(/"/g, '""')}"`,
  ]);
  const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'instagram-bizneslar.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const Instagram = () => {
  const { instagram, loading } = useAppData();
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const sources = useMemo(
    () => Array.from(new Set(instagram.map((i) => i.source))),
    [instagram]
  );
  const categories = useMemo(
    () => Array.from(new Set(instagram.map((i) => i.category).filter(Boolean) as string[])).sort(),
    [instagram]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return instagram.filter((item) => {
      const matchesSource = source === 'all' || item.source === source;
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        (item.username || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.address || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.owner || '').toLowerCase().includes(q);
      return matchesSource && matchesCategory && matchesSearch;
    });
  }, [instagram, search, source, category]);

  const hasFilters = search !== '' || source !== 'all' || category !== 'all';
  const resetFilters = () => {
    setSearch('');
    setSource('all');
    setCategory('all');
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setToast(`${label} nusxalandi!`);
    window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Instagram Bissnesezz"
        subtitle={`Instagram orqali topilgan ${instagram.length} ta biznes — jamoa aʼzolari yigʻgan maʼlumotlar`}
        searchQuery={search}
        searchPlaceholder="Nomi, username, telefon yoki manzil boʻyicha qidirish..."
        onSearchChange={setSearch}
      />

      {/* Filtrlar paneli */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            className="input !w-auto !py-2 !text-sm"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            aria-label="Manba boʻyicha filtrlash"
          >
            <option value="all">Barcha manbalar ({instagram.length})</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s] || s} ({instagram.filter((i) => i.source === s).length})
              </option>
            ))}
          </select>

          <select
            className="input !w-auto !py-2 !text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Kategoriya boʻyicha filtrlash"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn-ghost !px-2.5 !py-2 !text-xs !text-rose-500 hover:!bg-rose-50"
            >
              <X size={14} />
              Filtrlarni tozalash
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-soft">
            Topildi: <strong className="text-ink">{filtered.length}</strong> ta
          </span>
          <button
            type="button"
            onClick={() => exportInstagramCSV(filtered)}
            className="btn-secondary !py-2 !text-xs"
          >
            CSV yuklab olish
          </button>
        </div>
      </div>

      {loading && instagram.length === 0 && (
        <div className="card p-12 text-center text-sm text-ink-muted">Maʼlumotlar yuklanmoqda...</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((item) => {
          const igUrl = instagramUrl(item.username);
          return (
            <div
              key={item.id}
              className="card flex flex-col p-4 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 px-2 py-1 text-[11px] font-semibold text-white">
                  <InstagramIcon size={12} />
                  {SOURCE_LABELS[item.source] || item.source}
                </span>
                {item.category && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-canvas px-2 py-1 text-[11px] font-medium text-ink-soft">
                    <Tag size={11} />
                    <span className="max-w-[120px] truncate">{item.category}</span>
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm leading-snug font-semibold text-ink">{item.name}</h3>

              {item.username && (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <AtSign size={13} />
                  {item.username}
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              )}

              {item.owner && (
                <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
                  <UserRound size={13} className="text-ink-muted" />
                  {item.owner}
                </span>
              )}

              {item.phone && (
                <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                  <Phone size={13} className="text-emerald-600" />
                  {item.phone}
                </span>
              )}

              {item.address && (
                <span className="mt-1 flex items-start gap-1.5 text-xs text-ink-muted">
                  <MapPin size={13} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{item.address}</span>
                </span>
              )}

              {item.description && (
                <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{item.description}</p>
              )}

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  disabled={!item.phone}
                  onClick={() => item.phone && copy(item.phone, 'Telefon')}
                  className="btn-ghost !px-2 !py-1.5 !text-xs disabled:opacity-40"
                >
                  <Copy size={13} />
                  Telefon
                </button>
                {igUrl && (
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Instagram
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="card p-12 text-center text-sm text-ink-muted">
          Filtrlarga mos Instagram biznes topilmadi.
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-pop">
          <Check size={15} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default Instagram;
