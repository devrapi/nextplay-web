interface BadgeProps {
  children: string;
  color?: 'emerald' | 'gray' | 'blue' | 'amber' | 'rose' | 'indigo';
}

const colorMap = {
  emerald: 'bg-emerald-100 text-emerald-700',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

export default function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${colorMap[color]}`}>
      {children}
    </span>
  );
}
