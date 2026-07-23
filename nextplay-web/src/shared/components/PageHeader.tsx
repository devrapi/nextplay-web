import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; to?: string }[];
  actions?: React.ReactNode;
  backTo?: string;
}

export default function PageHeader({ title, breadcrumbs, actions, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {backTo && (
            <button
              type="button"
              onClick={() => navigate(backTo)}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
