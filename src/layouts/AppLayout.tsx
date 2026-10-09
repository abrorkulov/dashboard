import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

/**
 * Butun ilovaning umumiy qoliplari (layout):
 * chapda doimiy yon panel (katta ekranda), kichik ekranda — hamburger orqali ochiladigan panel.
 */
const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Esc — mobil menyuni ham yopadi (modallar kabi)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // Har bir sahifaga o'tganda mobil panelni yopamiz (render davomida yangilash)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Katta ekran uchun doimiy yon panel */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>

      {/* Asosiy kontent */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobil sarlavha */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <span className="text-sm font-bold tracking-tight text-ink">Biznes Baza</span>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="btn-ghost !px-2.5 !py-2"
            aria-label="Menyuni ochish"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      {/* Mobil panel (drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-surface shadow-pop">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="btn-ghost absolute top-4 right-3 !px-2 !py-2"
              aria-label="Menyuni yopish"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
