import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import { useSidebar } from '../hooks/useSidebar';

export default function AdminLayout() {
  const { collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <AdminTopNav onMobileMenuToggle={toggleMobile} />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapsed={toggleCollapsed}
          onCloseMobile={closeMobile}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
