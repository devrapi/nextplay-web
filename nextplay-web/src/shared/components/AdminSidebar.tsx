import { NavLink } from 'react-router-dom';
import { adminNavItems } from './adminNavItems';

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapsed,
  onClose,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-gray-800 text-white">
      {/* Brand + collapse toggle */}
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-3">
        {!collapsed && (
          <span className="text-sm font-bold text-yellow-400 tracking-wide">NextPlay</span>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ml-auto rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1 overflow-y-auto">
        {adminNavItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition',
                isActive
                  ? 'bg-yellow-500 text-gray-900 font-semibold'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              ].join(' ')
            }
          >
            <NavIcon d={icon} />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          'hidden lg:flex flex-col shrink-0 transition-all duration-200',
          collapsed ? 'w-14' : 'w-56',
        ].join(' ')}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-40 w-56 lg:hidden">
            <SidebarContent
              collapsed={false}
              onToggleCollapsed={onCloseMobile}
              onClose={onCloseMobile}
            />
          </aside>
        </>
      )}
    </>
  );
}
