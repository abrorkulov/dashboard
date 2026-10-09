import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash } from 'lucide-react';
import Modal from './Modal';
import { STATUS_COLORS } from '../statuses/statuses';
import {
  countStatuses,
  useStatusActions,
  useStatusFlow,
  useStatusMap,
  type StatusActions,
} from '../statuses/statusStore';
import { useAppData } from '../data/dataContext';

interface StatusManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RowProps {
  def: ReturnType<typeof useStatusFlow>[number];
  count: number;
  isFirst: boolean;
  isLast: boolean;
  canDelete: boolean;
  actions: StatusActions;
  onRequestDelete: (key: string) => void;
}

const StatusRow = ({
  def,
  count,
  isFirst,
  isLast,
  canDelete,
  actions,
  onRequestDelete,
}: RowProps) => (
  <div className="rounded-xl border border-line bg-surface p-3">
    <div className="flex items-center gap-2">
      <span className={`size-2.5 shrink-0 rounded-full ${def.dot}`} />
      <input
        defaultValue={def.label}
        aria-label="Status nomi"
        key={`label-${def.key}-${def.label}`}
        className="input !py-1.5 !text-sm"
        onBlur={(e) => {
          const value = e.target.value.trim();
          if (value && value !== def.label) actions.rename(def.key, value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
      />

      <span className="shrink-0 rounded-lg bg-canvas px-2 py-1 text-[11px] font-semibold text-ink-soft">
        {count} ta
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => actions.move(def.key, -1)}
          disabled={isFirst}
          aria-label="Yuqoriga"
          title="Yuqoriga"
          className="btn-ghost !px-2 !py-1.5 disabled:opacity-30"
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => actions.move(def.key, 1)}
          disabled={isLast}
          aria-label="Pastga"
          title="Pastga"
          className="btn-ghost !px-2 !py-1.5 disabled:opacity-30"
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={() => onRequestDelete(def.key)}
          disabled={!canDelete}
          aria-label="Oʻchirish"
          title={canDelete ? 'Oʻchirish' : 'Kamida bitta status qolishi kerak'}
          className="btn-ghost !px-2 !py-1.5 !text-rose-500 hover:!bg-rose-50 disabled:opacity-30"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>

    <div className="mt-2 flex flex-wrap items-center gap-2">
      <select
        value={def.color}
        aria-label="Status rangi"
        onChange={(e) => actions.update(def.key, { color: e.target.value })}
        className="input !w-auto !py-1.5 !text-xs"
      >
        {STATUS_COLORS.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>

      <input
        defaultValue={def.hint}
        aria-label="Status izohi"
        key={`hint-${def.key}-${def.hint}`}
        placeholder="Izoh (masalan: hali aloqa qilinmagan)"
        className="input !min-w-[180px] !flex-1 !py-1.5 !text-xs"
        onBlur={(e) => {
          const value = e.target.value.trim();
          if (value !== def.hint) actions.update(def.key, { hint: value });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
      />

      <span
        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${def.badge}`}
        aria-hidden
      >
        {def.label}
      </span>
    </div>
  </div>
);

/** Sotuv bosqichlarini boshqarish oynasi: qoʻshish, nomlash, rang, tartib, oʻchirish */
const StatusManagerModal = ({ isOpen, onClose }: StatusManagerModalProps) => {
  const flow = useStatusFlow();
  const statusMap = useStatusMap();
  const actions = useStatusActions();
  const { records } = useAppData();

  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('violet');
  const [newHint, setNewHint] = useState('');
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const counts = useMemo(
    () => countStatuses(records.map((r) => r.id), statusMap, flow.map((s) => s.key)),
    [records, statusMap, flow]
  );

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    actions.add({ label: newLabel, color: newColor, hint: newHint });
    setNewLabel('');
    setNewHint('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sotuv bosqichlari (statuslar)"
      subtitle="Statuslarni qoʻshish, nomlash, rangini tanlash, tartibini oʻzgartirish va oʻchirish"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-3">
        {flow.map((def, index) => (
          <div key={def.key}>
            <StatusRow
              def={def}
              count={counts[def.key] ?? 0}
              isFirst={index === 0}
              isLast={index === flow.length - 1}
              canDelete={flow.length > 1}
              actions={actions}
              onRequestDelete={(key) => setConfirmKey(key)}
            />
            {confirmKey === def.key && (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                <p className="text-xs text-rose-700">
                  «{def.label}» oʻchirilsinmi? Unda turgan {counts[def.key] ?? 0} ta yozuv birinchi
                  bosqichga oʻtadi.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmKey(null)}
                    className="btn-ghost !px-2.5 !py-1.5 !text-xs"
                  >
                    Bekor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      actions.remove(def.key);
                      setConfirmKey(null);
                    }}
                    className="btn !bg-rose-600 !px-3 !py-1.5 !text-xs !text-white hover:!bg-rose-700"
                  >
                    <Trash size={13} />
                    Oʻchirish
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Yangi status qo'shish */}
        <div className="mt-2 rounded-xl border border-dashed border-line-strong bg-canvas p-3">
          <div className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Yangi status qoʻshish
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
              placeholder="Nomi (masalan: Taklif yuborildi)"
              className="input !min-w-[180px] !flex-1 !py-2 !text-sm"
              aria-label="Yangi status nomi"
            />
            <select
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="input !w-auto !py-2 !text-sm"
              aria-label="Yangi status rangi"
            >
              {STATUS_COLORS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              value={newHint}
              onChange={(e) => setNewHint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
              placeholder="Izoh (ixtiyoriy)"
              className="input !min-w-[160px] !flex-1 !py-2 !text-sm"
              aria-label="Yangi status izohi"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newLabel.trim()}
              className="btn-primary !py-2 !text-sm disabled:opacity-50"
            >
              <Plus size={15} />
              Qoʻshish
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-soft">
                Barcha statuslar standart holatga qaytarilsinmi?
              </span>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="btn-ghost !px-2.5 !py-1.5 !text-xs"
              >
                Bekor
              </button>
              <button
                type="button"
                onClick={() => {
                  actions.reset();
                  setConfirmReset(false);
                }}
                className="btn-secondary !px-3 !py-1.5 !text-xs"
              >
                Ha, qaytarish
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn-ghost !px-2.5 !py-2 !text-xs"
            >
              <RotateCcw size={14} />
              Standart holatga qaytarish
            </button>
          )}

          <button type="button" onClick={onClose} className="btn-primary !py-2 !text-sm">
            Tayyor
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusManagerModal;
