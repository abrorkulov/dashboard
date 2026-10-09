import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Building2,
  Camera,
  ChartColumn,
  Database,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { useAppData } from '../data/dataContext';
import type { SummaryStats } from '../data/teamData';

function buildNavItems(stats: SummaryStats) {
  return [
    { path: '/', label: 'Asosiy panel', icon: LayoutDashboard },
    { path: '/team', label: 'Jamoa aʼzolari', icon: Users, badge: String(stats.totalMembers) },
    { path: '/records', label: 'Barcha bizneslar', icon: Building2, badge: String(stats.totalRecords) },
    { path: '/instagram', label: 'Instagram Bissnesezz', icon: Camera, badge: String(stats.instagramCount) },
    { path: '/analytics', label: 'Statistika va tahlil', icon: ChartColumn },
  ];
}

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const location = useLocation();
  const { stats, source, loading } = useAppData();
  const navItems = buildNavItems(stats);

  return (
    <div className="flex h-full flex-col">
      {/* Brend */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[0_4px_12px_rgba(31,90,224,0.35)]">
          <Building2 size={20} />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-ink">Biznes Baza</div>
          <div className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">
            CRM boshqaruv
          </div>
        </div>
      </div>

      {/* Navigatsiya */}
      <nav className="flex-1 overflow-y-auto px-3">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
          Navigatsiya
        </div>
        <ul className="space-y-1">
          {navItems.map(({ path, label, icon: Icon, badge }) => {
            const active = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={onNavigate}
                  className={`nav-link ${active ? 'nav-link-active' : ''}`}
                >
                  <Icon size={18} className={active ? 'text-brand-600' : 'text-ink-muted'} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        active ? 'bg-white text-brand-700' : 'bg-canvas text-ink-muted'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tizim holati */}
        <div className="mt-6 rounded-2xl border border-line bg-canvas p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-soft">Tizim holati</span>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                source === 'api' ? 'text-success-700' : 'text-warning-700'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${source === 'api' ? 'bg-success-500' : 'bg-warning-500'}`}
              />
              {loading ? 'YUKLANMOQDA' : source === 'api' ? 'SERVER' : 'LOKAL'}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">
            {stats.totalRecords} ta biznes bazada
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {stats.citiesCount} ta shahar • {stats.instagramCount} ta Instagram biznes
          </p>
          <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-[11px] text-ink-muted">
            <Database size={12} />
            {source === 'api' ? 'Backend (Express + Prisma)' : 'Lokal zaxira maʼlumotlar'}
          </div>
        </div>
      </nav>

      {/* Profil */}
      <div className="flex items-center gap-3 border-t border-line px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          B
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">Boshqaruvchi</div>
          <div className="flex items-center gap-1 text-xs text-ink-muted">
            <Activity size={12} className="text-success-500" />
            Administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
