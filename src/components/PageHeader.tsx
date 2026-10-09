import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download, Plus, Search } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../data/teamData';
import { useAppData } from '../data/dataContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  searchPlaceholder?: string;
  onSearchChange?: (q: string) => void;
  onAddNewClick?: () => void;
  /** Qo'shimcha tugmalar (masalan filtrlar) */
  actions?: React.ReactNode;
}

/**
 * Har bir sahifaning yuqori qismi: sarlavha, qidiruv va amallar paneli.
 */
const PageHeader = ({
  title,
  subtitle,
  searchQuery = '',
  searchPlaceholder = 'Biznes, telefon yoki manzil boʻyicha qidirish...',
  onSearchChange,
  onAddNewClick,
  actions,
}: PageHeaderProps) => {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const { records } = useAppData();

  // Tasharida bosilganda eksport menyusini yopamiz
  useEffect(() => {
    if (!exportOpen) return;
    const onClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [exportOpen]);

  const download = (fn: () => void) => {
    fn();
    setExportOpen(false);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Sarlavha */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h1>
          <span className="rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
            CRM
          </span>
        </div>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>

      {/* Amallar paneli */}
      <div className="flex flex-wrap items-center gap-2.5">
        {onSearchChange && (
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="input !py-2 !pl-9"
              aria-label="Qidirish"
            />
          </div>
        )}

        {actions}

        {/* Eksport */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => setExportOpen((v) => !v)}
            className="btn-secondary"
            aria-expanded={exportOpen}
          >
            <Download size={16} />
            Eksport
            <ChevronDown size={14} className="opacity-60" />
          </button>

          {exportOpen && (
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-pop">
              <button
                type="button"
                onClick={() => download(() => exportToCSV(records, 'barcha-bizneslar.csv'))}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-canvas hover:text-ink"
              >
                <span className="size-2 rounded-sm bg-success-500" />
                CSV fayl (Excel uchun)
              </button>
              <button
                type="button"
                onClick={() => download(() => exportToJSON(records, 'barcha-bizneslar.json'))}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-canvas hover:text-ink"
              >
                <span className="size-2 rounded-sm bg-brand-500" />
                JSON format
              </button>
            </div>
          )}
        </div>

        {onAddNewClick && (
          <button type="button" onClick={onAddNewClick} className="btn-primary">
            <Plus size={16} />
            Yangi biznes
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
