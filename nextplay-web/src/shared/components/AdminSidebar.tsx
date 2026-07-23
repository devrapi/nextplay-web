import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { adminNavSections } from './adminNavItems';

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
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
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
        {!collapsed && (
          <span className="text-lg font-bold text-indigo-600 tracking-tight">NextPlay</span>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-indigo-600 mx-auto">N</span>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition hidden lg:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {adminNavSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-5 w-5 shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-3 px-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            NP
          </div>
          {!collapsed && (
            <div className="text-xs text-gray-400">
              <span className="block font-medium text-gray-500">NextPlay v1.0</span>
              <span>Admin Portal</span>
            </div>
          )}
        </div>
      </div>
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
      <aside
        className={[
          'hidden lg:flex flex-col shrink-0 transition-all duration-200',
          collapsed ? 'w-16' : 'w-60',
        ].join(' ')}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-60 lg:hidden shadow-2xl">
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
