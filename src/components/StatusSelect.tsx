import { getStatusDef, STATUS_FLOW, type StatusKey } from '../statuses/statuses';
import { useRecordStatus, useSetRecordStatus } from '../statuses/statusStore';

interface StatusSelectProps {
  recordId: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Yozuv statusini o'zgartirish uchun select.
 * Tanlangan holat darhol localStorage'ga yoziladi.
 */
const StatusSelect = ({ recordId, className = '', ...aria }: StatusSelectProps) => {
  const status = useRecordStatus(recordId);
  const setStatus = useSetRecordStatus();
  const def = getStatusDef(status);

  return (
    <div className={`relative inline-flex ${className}`}>
      <span
        aria-hidden
        className={`pointer-events-none absolute left-3 top-1/2 size-2 -translate-y-1/2 rounded-full ${def.dot}`}
      />
      <select
        aria-label={aria['aria-label'] ?? 'Statusni tanlash'}
        value={status}
        onChange={(e) => setStatus(recordId, e.target.value as StatusKey)}
        className={`w-full cursor-pointer appearance-none rounded-xl border py-2 pr-8 pl-8 text-xs font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-brand-500 ${def.badge}`}
      >
        {STATUS_FLOW.map((s) => (
          <option key={s.key} value={s.key} className="bg-white text-ink">
            {s.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60"
      >
        <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default StatusSelect;
