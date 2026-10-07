import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, MapPin, Phone, UserRound } from 'lucide-react';
import Modal from './Modal';
import StatusSelect from './StatusSelect';
import StatusBadge from './StatusBadge';
import { useRecordStatus } from '../statuses/statusStore';
import { getStatusDef } from '../statuses/statuses';
import type { BusinessRecord } from '../data/teamData';

interface RecordDetailModalProps {
  record: BusinessRecord | null;
  onClose: () => void;
}

/** Bitta biznes yozuvi bo'yicha to'liq maʼlumot oynasi */
const RecordDetailModal = ({ record, onClose }: RecordDetailModalProps) => {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast(`${label} nusxalandi!`);
  };

  // Early return dan oldin — barcha hooklar shartlabsiz chaqirilishi shart
  const recordStatus = useRecordStatus(record?.id ?? '');

  if (!record) return null;

  const cleanPhone = record.phone.replace(/[^\d+]/g, '');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${record.name} ${record.address} ${record.city}`
  )}`;

  const statusDef = getStatusDef(recordStatus);

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={record.name}
        subtitle={
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
              {record.category}
            </span>
            <span className="text-ink-muted">•</span>
            <span>{record.city}</span>
          </span>
        }
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4">
          {/* Sotuv statusi */}
          <div className="rounded-2xl border border-line bg-canvas p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Sotuv holati
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={recordStatus} />
                  <span className="text-xs text-ink-muted">{statusDef.hint}</span>
                </div>
              </div>
              <StatusSelect recordId={record.id} aria-label="Statusni oʻzgartirish" />
            </div>
          </div>

          {/* Kim kiritgan */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <UserRound size={18} />
              </span>
              <div>
                <div className="text-xs text-ink-muted">Maʼlumot qoʻshgan aʼzo</div>
                <div className="text-sm font-semibold text-ink">{record.member}</div>
              </div>
            </div>
            <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-ink-soft">
              Jamoa aʼzosi
            </span>
          </div>

          {/* Telefon */}
          <div className="rounded-2xl border border-line p-4">
            <div className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
              Aloqa
            </div>
            {record.phone ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone size={17} />
                  </span>
                  <span className="text-[15px] font-semibold tracking-wide text-ink">
                    {record.phone}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(record.phone, 'Telefon raqami')}
                    className="btn-secondary !py-2 !text-xs"
                  >
                    <Copy size={14} />
                    Nusxalash
                  </button>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="btn !bg-emerald-600 !px-3 !py-2 !text-xs !text-white hover:!bg-emerald-700"
                  >
                    <Phone size={14} />
                    Qoʻngʻiroq
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-muted italic">Telefon koʻrsatilmagan</p>
            )}

            <hr className="my-4 border-line" />

            {/* Manzil */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <MapPin size={17} />
                </span>
                <div>
                  <div className="text-xs text-ink-muted">Manzil</div>
                  <div className="text-sm font-medium text-ink-soft">
                    {record.address || `${record.city} shahri`}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copy(record.address || record.city, 'Manzil')}
                  className="btn-secondary !py-2 !text-xs"
                >
                  <Copy size={14} />
                  Nusxalash
                </button>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2 !text-xs"
                >
                  <ExternalLink size={14} />
                  Xaritada
                </a>
              </div>
            </div>
          </div>

          {/* Havola */}
          {record.link && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4">
              <span className="text-sm font-medium text-ink-soft">Veb-sayt / ijtimoiy tarmoq</span>
              <a
                href={record.link.startsWith('http') ? record.link : `https://${record.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !py-2 !text-xs"
              >
                <ExternalLink size={14} />
                Saytga oʻtish
              </a>
            </div>
          )}

          {/* Izoh */}
          {record.note && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="text-xs font-semibold text-amber-700">Izoh / taklif</div>
              <p className="mt-1 text-sm text-amber-900">{record.note}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Nusxalash haqida xabar */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-pop">
          <Check size={15} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </>
  );
};

export default RecordDetailModal;
