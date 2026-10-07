import { getStatusDef, type StatusKey } from '../statuses/statuses';

interface StatusBadgeProps {
  status: StatusKey;
  size?: 'sm' | 'md';
  withDot?: boolean;
}

/** Statusning rangli pill ko'rinishi */
const StatusBadge = ({ status, size = 'md', withDot = true }: StatusBadgeProps) => {
  const def = getStatusDef(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${def.badge}`}
    >
      {withDot && <span className={`size-1.5 rounded-full ${def.dot}`} />}
      {size === 'sm' ? def.short : def.label}
    </span>
  );
};

export default StatusBadge;
