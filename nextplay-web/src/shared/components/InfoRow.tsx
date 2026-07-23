import type { ReactNode } from 'react';

interface InfoRowProps {
  label: string;
  value: ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-gray-50 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900 text-right">{value ?? <span className="text-gray-400">—</span>}</dd>
    </div>
  );
}
