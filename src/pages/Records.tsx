import { useMemo, useState } from 'react';
import { LayoutGrid, List, MapPin, Phone, Settings2, Store, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import RecordDetailModal from '../components/RecordDetailModal';
import AddRecordModal from '../components/AddRecordModal';
import StatusManagerModal from '../components/StatusManagerModal';
import StatusSelect from '../components/StatusSelect';
import { useStatusFlow, useStatusMap } from '../statuses/statusStore';
import type { BusinessRecord } from '../data/teamData';
import { useAppData } from '../data/dataContext';

const Records = () => {
  const { records, members, stats, addRecord } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<BusinessRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusManagerOpen, setIsStatusManagerOpen] = useState(false);

  const statusMap = useStatusMap();
  const statusFlow = useStatusFlow();
  const defaultStatusKey = statusFlow[0]?.key ?? 'yangi';
  const pageSize = 24;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.member.toLowerCase().includes(q);

      const matchesCity = selectedCity === 'all' || r.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesMember = selectedMember === 'all' || r.member.toLowerCase() === selectedMember.toLowerCase();
      const matchesStatus = selectedStatus === 'all' || (statusMap[r.id] ?? defaultStatusKey) === selectedStatus;

      return matchesSearch && matchesCity && matchesMember && matchesStatus;
    });
  }, [records, searchQuery, selectedCity, selectedMember, selectedStatus, statusMap, defaultStatusKey]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page]);

  const hasFilters = selectedCity !== 'all' || selectedMember !== 'all' || selectedStatus !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedMember('all');
    setSelectedStatus('all');
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Barcha bizneslar"
        subtitle={`Jami ${records.length} ta biznes yozuvlari roʻyxati`}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        onAddNewClick={() => setIsAddModalOpen(true)}
      />

      {/* Filtrlar paneli */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            className="input !w-auto !py-2 !text-sm"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setPage(1);
            }}
            aria-label="Shahar boʻyicha filtrlash"
          >
            <option value="all">Barcha shaharlar ({records.length})</option>
            {stats.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            className="input !w-auto !py-2 !text-sm"
            value={selectedMember}
            onChange={(e) => {
              setSelectedMember(e.target.value);
              setPage(1);
            }}
            aria-label="Jamoa aʼzosi boʻyicha filtrlash"
          >
            <option value="all">Barcha aʼzolar ({members.length})</option>
            {members.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} ({m.recordsCount})
              </option>
            ))}
          </select>

          <select
            className="input !w-auto !py-2 !text-sm"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Status boʻyicha filtrlash"
          >
            <option value="all">Barcha statuslar</option>
            {statusFlow.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
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
            Topildi: <strong className="text-ink">{filteredRecords.length}</strong> ta
          </span>

          <button
            type="button"
            onClick={() => setIsStatusManagerOpen(true)}
            className="btn-secondary !py-2 !text-xs"
          >
            <Settings2 size={14} />
            Statuslar
          </button>

          <div className="flex overflow-hidden rounded-xl border border-line">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Karta koʻrinishi"
              className={`px-3 py-2 transition-colors ${
                viewMode === 'grid' ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-canvas'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Jadval koʻrinishi"
              className={`border-l border-line px-3 py-2 transition-colors ${
                viewMode === 'table' ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-canvas'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Kartalar koʻrinishi */}
      {viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {paginatedRecords.map((record) => (
              <div
                key={record.id}
                className="card flex cursor-pointer flex-col p-4 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                    {record.city}
                  </span>
                  <span className="rounded-lg bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
                    {record.member}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-soft">
                    <Store size={15} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm leading-snug font-semibold text-ink">{record.name}</h3>
                    <span className="mt-0.5 inline-block rounded-md bg-canvas px-1.5 py-0.5 text-[11px] font-medium text-ink-muted">
                      {record.category}
                    </span>
                  </div>
                </div>

                {record.phone && (
                  <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                    <Phone size={13} className="text-emerald-600" />
                    {record.phone}
                  </span>
                )}
                {record.address && (
                  <span className="mt-1.5 flex items-start gap-1.5 text-xs text-ink-muted">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{record.address}</span>
                  </span>
                )}

                <div
                  className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <StatusSelect recordId={record.id} />
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(record)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Batafsil →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {paginatedRecords.length === 0 && (
            <div className="card p-12 text-center text-sm text-ink-muted">
              Filtrlarga mos biznes topilmadi.
            </div>
          )}
        </>
      ) : (
        /* Jadval koʻrinishi */
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="table-head px-4 py-3 text-left">Biznes nomi</th>
                <th className="table-head px-4 py-3 text-left">Kategoriya</th>
                <th className="table-head px-4 py-3 text-left">Telefon</th>
                <th className="table-head px-4 py-3 text-left">Manzil</th>
                <th className="table-head px-4 py-3 text-left">Aʼzo</th>
                <th className="table-head px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="cursor-pointer border-b border-line last:border-0 transition-colors hover:bg-canvas"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{record.name}</div>
                    <div className="text-xs text-ink-muted">{record.city}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{record.category}</td>
                  <td className="px-4 py-3 font-medium text-ink-soft">
                    {record.phone || '—'}
                  </td>
                  <td className="max-w-[260px] truncate px-4 py-3 text-ink-muted">
                    {record.address || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
                      {record.member}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect recordId={record.id} />
                  </td>
                </tr>
              ))}
              {paginatedRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-muted">
                    Filtrlarga mos biznes topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sahifalash */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-secondary !px-3 !py-2 !text-xs disabled:opacity-40"
          >
            Oldingi
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .map((n, idx, arr) => (
              <span key={n} className="flex items-center gap-1.5">
                {idx > 0 && arr[idx - 1] !== n - 1 && (
                  <span className="px-1 text-xs text-ink-muted">…</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPage(n);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`min-w-9 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    n === page
                      ? 'bg-brand-600 text-white'
                      : 'border border-line bg-surface text-ink-soft hover:bg-canvas'
                  }`}
                >
                  {n}
                </button>
              </span>
            ))}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-secondary !px-3 !py-2 !text-xs disabled:opacity-40"
          >
            Keyingi
          </button>
        </div>
      )}

      {/* Tafsilotlar */}
      <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />

      {/* Yangi yozuv */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRecord}
      />

      {/* Statuslarni boshqarish */}
      <StatusManagerModal
        isOpen={isStatusManagerOpen}
        onClose={() => setIsStatusManagerOpen(false)}
      />
    </div>
  );
};

export default Records;
