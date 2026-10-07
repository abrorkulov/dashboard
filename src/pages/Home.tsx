import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Download,
  MapPin,
  Phone,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import RecordDetailModal from '../components/RecordDetailModal';
import AddRecordModal from '../components/AddRecordModal';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import StatusSelect from '../components/StatusSelect';
import MemberAvatar from '../components/MemberAvatar';
import { STATUS_FLOW } from '../statuses/statuses';
import { countStatuses, useStatusMap } from '../statuses/statusStore';
import type { BusinessRecord, TeamMember } from '../data/teamData';
import {
  allBusinessRecords,
  allTeamMembers,
  summaryStats,
  exportToCSV,
} from '../data/teamData';

const Home = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BusinessRecord[]>(allBusinessRecords);
  const [selectedRecord, setSelectedRecord] = useState<BusinessRecord | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState<string>('all');

  const statusMap = useStatusMap();
  const funnel = countStatuses(records.map((r) => r.id), statusMap);

  const stats = [
    {
      title: 'Jami bizneslar',
      value: String(records.length),
      sub: 'Baza toʻliq yuklandi',
      icon: Building2,
      tint: 'bg-brand-50 text-brand-600',
    },
    {
      title: 'Jamoa aʼzolari',
      value: `${allTeamMembers.length} kishi`,
      sub: 'Barcha aʼzolar faol',
      icon: Users,
      tint: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Qamrab olingan shaharlar',
      value: String(summaryStats.citiesCount),
      sub: 'Toshkent, Buxoro, Qarshi...',
      icon: MapPin,
      tint: 'bg-rose-50 text-rose-500',
    },
    {
      title: 'Aloqa aniqligi',
      value: `${summaryStats.verifiedPercentage}%`,
      sub: 'Telefon raqamlar tasdiqlangan',
      icon: TrendingUp,
      tint: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const quickActions = [
    { label: 'Yangi biznes qoʻshish', icon: Plus, onClick: () => setIsAddModalOpen(true), primary: true },
    { label: 'CSV / Excel eksport', icon: Download, onClick: () => exportToCSV(records, 'bizneslar-eksport.csv') },
    { label: 'Barcha bizneslar', icon: Building2, onClick: () => navigate('/records') },
    { label: 'Jamoa maʼlumotlari', icon: Users, onClick: () => navigate('/team') },
  ];

  const filteredRecent = records
    .filter((r) => cityFilter === 'all' || r.city.toLowerCase() === cityFilter.toLowerCase())
    .slice(0, 10);

  const funnelTotal = records.length || 1;

  return (
    <div>
      <PageHeader
        title="Asosiy panel"
        subtitle="Bizneslar bazasi va jamoa faoliyati boʻyicha umumiy koʻrinish"
        onAddNewClick={() => setIsAddModalOpen(true)}
      />

      {/* KPI kartalar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, sub, icon: Icon, tint }) => (
          <div key={title} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-soft">{title}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">{value}</p>
              </div>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-3 text-xs text-ink-muted">{sub}</p>
          </div>
        ))}
      </div>

      {/* Sotuv bosqichlari (statuslar) */}
      <section className="mt-6 card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="section-title">Sotuv bosqichlari</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              Har bir biznesning hozirgi statusi — batafsil oynadan oʻzgartirsa boʻladi
            </p>
          </div>
          <span className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink-soft">
            Jami {records.length} ta
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATUS_FLOW.map((s) => {
            const count = funnel[s.key];
            const percent = Math.round((count / funnelTotal) * 100);
            return (
              <div key={s.key} className="rounded-xl border border-line bg-canvas p-3.5">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${s.dot}`} />
                  <span className="truncate text-xs font-semibold text-ink-soft">{s.label}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-ink">{count}</span>
                  <span className="text-xs text-ink-muted">{percent}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full ${s.track}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tezkor amallar */}
      <section className="mt-6">
        <h2 className="section-title mb-3">Tezkor amallar</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ label, icon: Icon, onClick, primary }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={`card flex items-center gap-3 p-4 text-left text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-pop ${
                primary ? 'text-brand-700' : 'text-ink'
              }`}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-xl ${
                  primary ? 'bg-brand-600 text-white' : 'bg-canvas text-ink-soft'
                }`}
              >
                <Icon size={17} />
              </span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Jamoa jadvali */}
      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="section-title">Jamoa aʼzolari va yozuvlar</h2>
            <p className="text-sm text-ink-soft">
              Istalgan aʼzoga bosib, uning barcha yozuvlarini oching
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/team')}
            className="btn-ghost !px-2 !py-1.5 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          >
            Jamoa sahifasi
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="table-head px-4 py-3 text-left">Jamoa aʼzosi</th>
                <th className="table-head px-4 py-3 text-left">Hudud</th>
                <th className="table-head px-4 py-3 text-left">Yozuvlar soni</th>
                <th className="table-head px-4 py-3 text-left">Hissasi</th>
                <th className="table-head px-4 py-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody>
              {allTeamMembers.map((member) => {
                const share = Math.round((member.recordsCount / allBusinessRecords.length) * 100);
                return (
                  <tr
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="cursor-pointer border-b border-line last:border-0 transition-colors hover:bg-canvas"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={member.name} color={member.color} size={36} fontSize="0.75rem" />
                        <div>
                          <div className="font-semibold text-ink">{member.name}</div>
                          <div className="text-xs text-ink-muted">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
                        {member.city}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                        {member.recordsCount} ta biznes
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-[140px] items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full bg-brand-500"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-ink-soft">{share}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-brand-600">Bazasini ochish →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Soʻnggi qoʻshilgan bizneslar */}
      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Soʻnggi qoʻshilgan bizneslar</h2>
            <p className="text-sm text-ink-soft">
              Bosib — telefon raqamini nusxalash, xaritada koʻrish yoki statusni oʻzgartirish mumkin
            </p>
          </div>

          {/* Shahar filtri */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCityFilter('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                cityFilter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'border border-line bg-surface text-ink-soft hover:bg-canvas'
              }`}
            >
              Barchasi
            </button>
            {summaryStats.cities.slice(0, 4).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  cityFilter === city
                    ? 'bg-brand-600 text-white'
                    : 'border border-line bg-surface text-ink-soft hover:bg-canvas'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="table-head px-4 py-3 text-left">Biznes nomi</th>
                <th className="table-head px-4 py-3 text-left">Kategoriya</th>
                <th className="table-head px-4 py-3 text-left">Telefon</th>
                <th className="table-head px-4 py-3 text-left">Shahar / manzil</th>
                <th className="table-head px-4 py-3 text-left">Masʼul aʼzo</th>
                <th className="table-head px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecent.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedRecord(item)}
                  className="cursor-pointer border-b border-line last:border-0 transition-colors hover:bg-canvas"
                >
                  <td className="px-4 py-3 font-semibold text-ink">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.phone ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                        <Phone size={14} />
                        {item.phone}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-muted">Mavjud emas</span>
                    )}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-ink-soft">
                    {item.address || item.city}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-canvas px-2 py-1 text-xs font-medium text-ink-soft">
                      {item.member}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect recordId={item.id} />
                  </td>
                </tr>
              ))}
              {filteredRecent.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-muted">
                    Bu shahar boʻyicha yozuv topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => navigate('/records')} className="btn-secondary">
            Barcha {records.length} ta biznesni koʻrish
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Biznes tafsilotlari */}
      <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />

      {/* Aʼzo bazasi */}
      {selectedMember && (
        <Modal
          isOpen
          onClose={() => setSelectedMember(null)}
          title={`${selectedMember.name} — barcha bizneslar`}
          subtitle={`${selectedMember.city} • Jami ${selectedMember.records.length} ta biznes roʻyxati`}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-ink-soft">
              Istalgan kartochkaga bosib, aloqa yoki xaritani koʻring
            </p>
            <button
              type="button"
              onClick={() =>
                exportToCSV(selectedMember.records, `${selectedMember.name}-bizneslar.csv`)
              }
              className="btn-secondary !py-2 !text-xs"
            >
              <Download size={14} />
              CSV yuklab olish
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedMember.records.map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => setSelectedRecord(rec)}
                className="rounded-xl border border-line bg-surface p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{rec.name}</span>
                  <StatusBadge status={statusMap[rec.id] ?? 'yangi'} size="sm" />
                </div>
                <span className="mt-1 block text-xs font-medium text-brand-600">
                  {rec.category}
                </span>
                {rec.phone && (
                  <span className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft">
                    <Phone size={12} />
                    {rec.phone}
                  </span>
                )}
                {rec.address && (
                  <span className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin size={12} />
                    <span className="truncate">{rec.address}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Yangi biznes qoʻshish */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newRecord) => setRecords((prev) => [newRecord, ...prev])}
      />

    </div>
  );
};

export default Home;
