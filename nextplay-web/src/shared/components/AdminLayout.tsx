import { NavLink, Outlet } from 'react-router-dom';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-800 text-white flex flex-col">
        <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">
          NextPlay Admin
        </div>
        <nav className="flex flex-col gap-1 px-2 py-4">
          {sidebarLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded ${isActive ? 'bg-yellow-500 text-gray-900 font-semibold' : 'hover:bg-gray-700'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
