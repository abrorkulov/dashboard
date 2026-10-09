import { useState } from 'react';
import { Download, MapPin, Phone, Search, Store } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import RecordDetailModal from '../components/RecordDetailModal';
import StatusBadge from '../components/StatusBadge';
import MemberAvatar from '../components/MemberAvatar';
import { useStatusFlow, useStatusMap } from '../statuses/statusStore';
import type { TeamMember, BusinessRecord } from '../data/teamData';
import { exportToCSV } from '../data/teamData';
import { useAppData } from '../data/dataContext';

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [modalSearch, setModalSearch] = useState('');
  const [detailRecord, setDetailRecord] = useState<BusinessRecord | null>(null);

  const statusMap = useStatusMap();
  const statusFlow = useStatusFlow();
  const defaultStatusKey = statusFlow[0]?.key ?? 'yangi';
  const { members } = useAppData();

  const openMember = (member: TeamMember) => {
    setSelectedMember(member);
    setModalSearch('');
    setIsModalOpen(true);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.city.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredMemberRecords = selectedMember
    ? selectedMember.records.filter((rec) => {
        const q = modalSearch.toLowerCase();
        return (
          rec.name.toLowerCase().includes(q) ||
          rec.category.toLowerCase().includes(q) ||
          rec.phone.toLowerCase().includes(q) ||
          rec.address.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div>
      <PageHeader
        title="Jamoa aʼzolari"
        subtitle={`${members.length} nafar aʼzo tomonidan toʻplangan barcha biznes maʼlumotlari`}
        searchQuery={memberSearch}
        onSearchChange={setMemberSearch}
        searchPlaceholder="Aʼzo, shahar yoki lavozim boʻyicha qidirish..."
      />

      <p className="mb-5 text-sm text-ink-soft">
        Jamoa aʼzosini tanlang va uning kiritgan bizneslari, telefon raqamlari va manzillarini
        koʻring.
      </p>

      {/* Aʼzolar kartalari */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="card flex flex-col p-5 transition-all hover:-translate-y-1 hover:shadow-pop"
          >
            <div className="flex flex-col items-center text-center">
              <MemberAvatar name={member.name} color={member.color} size={56} fontSize="1.1rem" />
              <h2 className="mt-3 text-base font-bold text-ink">{member.name}</h2>
              <p className="mt-0.5 text-xs text-ink-muted">{member.role}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: member.color }}>
                  {member.recordsCount} ta biznes
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-ink-soft">
                  <MapPin size={12} />
                  {member.city}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {member.categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat}
                    className="rounded-lg bg-canvas px-2 py-0.5 text-[11px] text-ink-muted"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-2 border-t border-line pt-4">
              <button type="button" onClick={() => openMember(member)} className="btn-primary flex-1 !py-2 !text-xs">
                <Store size={14} />
                Bazasini ochish
              </button>
              <button
                type="button"
                onClick={() => exportToCSV(member.records, `${member.name}-bizneslar.csv`)}
                className="btn-secondary !px-3 !py-2"
                title="CSV ga yuklash"
                aria-label="CSV ga yuklash"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full card p-10 text-center text-sm text-ink-muted">
            Aʼzo topilmadi.
          </div>
        )}
      </div>

      {/* Aʼzo bazasi modali */}
      {selectedMember && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            <>
              {selectedMember.name} tomonidan kiritilgan bizneslar
              <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                {selectedMember.role} • {selectedMember.city}
              </span>
            </>
          }
          subtitle={`Jami ${selectedMember.recordsCount} ta biznes yozuvi`}
        >
          {/* Qidiruv va eksport paneli */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas p-3">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder={`${selectedMember.name} bazasidan qidirish...`}
                className="input !py-2 !pl-9 !text-sm"
                aria-label="Bazadan qidirish"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-soft">
                Topildi: <strong className="text-ink">{filteredMemberRecords.length}</strong> ta
              </span>
              <button
                type="button"
                onClick={() => exportToCSV(selectedMember.records, `${selectedMember.name}-bizneslar.csv`)}
                className="btn-primary !py-2 !text-xs"
              >
                <Download size={14} />
                CSV ga yuklash
              </button>
            </div>
          </div>

          {filteredMemberRecords.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-muted">Hech qanday biznes topilmadi.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMemberRecords.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDetailRecord(item)}
                  className="rounded-xl border border-line bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{item.name}</span>
                    <StatusBadge status={statusMap[item.id] ?? defaultStatusKey} size="sm" />
                  </div>
                  <span className="mt-1 block text-xs font-medium text-brand-600">
                    {item.category}
                  </span>

                  {item.phone && (
                    <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
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

                  <span className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-[11px] font-semibold">
                    <span className="text-ink-muted">Batafsil</span>
                    <span className="text-brand-600">Ochish →</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Biznes tafsilotlari */}
      <RecordDetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />
    </div>
  );
};

export default Team;
