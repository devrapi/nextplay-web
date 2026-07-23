import type { ReactNode } from 'react';

interface DetailCardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function DetailCard({ title, children, actions }: DetailCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
