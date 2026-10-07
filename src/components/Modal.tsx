import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const widths: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

/** Umumiy modallar oynasi (dialog) */
const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg' }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fon */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Oyna */}
      <div className="relative flex min-h-full items-start justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={`relative w-full ${widths[maxWidth]} rounded-2xl border border-line bg-surface shadow-pop`}
        >
          {/* Sarlavha */}
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="min-w-0">
              <div className="text-base font-bold tracking-tight text-ink sm:text-lg">{title}</div>
              {subtitle && <div className="mt-0.5 text-sm text-ink-soft">{subtitle}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost shrink-0 !p-2"
              aria-label="Yopish"
            >
              <X size={18} />
            </button>
          </div>

          {/* Kontent */}
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
