import { CalendarDays, Trophy, Users, User, ArrowUpRight } from 'lucide-react';
import Breadcrumb from '../../shared/components/Breadcrumb';

const stats = [
  { label: 'Seasons', value: '—', icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Tournaments', value: '—', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Teams', value: '—', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Players', value: '—', icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome to NextPlay Admin Portal</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">
                <span>View details</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Overview</h2>
        </div>
        <p className="text-gray-500 text-center py-8">
          Select a module from the sidebar to manage your league data.
        </p>
      </div>
    </div>
  );
}
