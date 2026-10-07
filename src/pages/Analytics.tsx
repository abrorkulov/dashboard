import { BadgeCheck, MapPin, PhoneCall, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { STATUS_FLOW } from '../statuses/statuses';
import { countStatuses, useStatusMap } from '../statuses/statusStore';
import { allBusinessRecords, allTeamMembers, summaryStats } from '../data/teamData';

const Analytics = () => {
  const statusMap = useStatusMap();

  // Shaharlar bo'yicha taqsimot
  const cityCounts: Record<string, number> = {};
  allBusinessRecords.forEach((r) => {
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
  });
  const cityList = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  // Kategoriyalar bo'yicha taqsimot (top 6)
  const categoryCounts: Record<string, number> = {};
  allBusinessRecords.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const phoneValidCount = allBusinessRecords.filter((r) => r.phone && r.phone.length > 5).length;

  // Sotuv bosqichlari
  const funnel = countStatuses(
    allBusinessRecords.map((r) => r.id),
    statusMap
  );
  const funnelTotal = allBusinessRecords.length || 1;

  const kpis = [
    {
      label: 'Jami bizneslar',
      value: String(summaryStats.totalRecords),
      note: '100% faol yozuvlar',
      noteColor: 'text-success-700',
      icon: BadgeCheck,
      tint: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Telefon qamrovi',
      value: `${Math.round((phoneValidCount / allBusinessRecords.length) * 100)}%`,
      note: `${phoneValidCount} ta yozuvda aloqa bor`,
      noteColor: 'text-brand-600',
      icon: PhoneCall,
      tint: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Qamrab olingan shaharlar',
      value: String(cityList.length),
      note: 'Toshkent, Buxoro, Qarshi va b.',
      noteColor: 'text-rose-500',
      icon: MapPin,
      tint: 'bg-rose-50 text-rose-500',
    },
    {
      label: 'Jamoa samaradorligi',
      value: `~${Math.round(summaryStats.totalRecords / summaryStats.totalMembers)}`,
      note: 'Har bir aʼzoga oʻrtacha',
      noteColor: 'text-emerald-600',
      icon: Users,
      tint: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Statistika va tahlil"
        subtitle="Bizneslar bazasi boʻyicha toʻliq tahliliy koʻrsatkichlar"
      />

      {/* KPI kartalar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, note, noteColor, icon: Icon, tint }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-ink-soft">{label}</span>
              <span className={`flex size-9 items-center justify-center rounded-xl ${tint}`}>
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
            <p className={`mt-1 text-xs font-medium ${noteColor}`}>{note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sotuv bosqichlari */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="section-title">Sotuv bosqichlari (statuslar boʻyicha)</h2>
          <p className="mt-0.5 text-sm text-ink-soft">
            Jami {funnelTotal} ta biznesning qaysi bosqichda turgani
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STATUS_FLOW.map((s) => {
              const count = funnel[s.key];
              const percent = Math.round((count / funnelTotal) * 100);
              return (
                <div key={s.key} className="rounded-xl border border-line bg-canvas p-4">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${s.dot}`} />
                    <span className="truncate text-xs font-semibold text-ink-soft">{s.label}</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-ink">{count}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full ${s.track}`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-ink-muted">{s.hint}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Shaharlar bo'yicha taqsimot */}
        <section className="card p-5">
          <h2 className="section-title mb-4">Shaharlar boʻyicha taqsimot</h2>
          <div className="flex flex-col gap-3.5">
            {cityList.map(([cityName, count]) => {
              const percent = Math.round((count / allBusinessRecords.length) * 100);
              return (
                <div key={cityName}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{cityName}</span>
                    <span className="text-ink-soft">
                      {count} ta ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Jamoa hissasi */}
        <section className="card p-5">
          <h2 className="section-title mb-4">Jamoa aʼzolari hissasi</h2>
          <div className="flex flex-col gap-3.5">
            {allTeamMembers.map((m) => {
              const percent = Math.round((m.recordsCount / allBusinessRecords.length) * 100);
              return (
                <div key={m.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{m.name}</span>
                    <span className="text-ink-soft">
                      {m.recordsCount} ta ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: m.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ommabop kategoriyalar */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="section-title mb-4">Eng ommabop kategoriyalar</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCategories.map(([category, count]) => (
              <div key={category} className="rounded-xl border border-line bg-canvas p-4">
                <p className="text-sm font-semibold text-ink">{category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                    {count} ta yozuv
                  </span>
                  <span className="text-xs text-ink-muted">
                    {Math.round((count / allBusinessRecords.length) * 100)}% ulush
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
