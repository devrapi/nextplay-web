import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  href?: string;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
};

export default function StatsCard({ label, value, icon: Icon, color, href }: StatsCardProps) {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href, className: 'block' } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorMap[color].bg}`}>
          <Icon className={`h-6 w-6 ${colorMap[color].icon}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Wrapper>
  );
}
