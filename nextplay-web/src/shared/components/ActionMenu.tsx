import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';

interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleAction = (onClick: () => void) => {
    setOpen(false);
    onClick();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        aria-label="Row actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAction(item.onClick)}
              className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition ${
                item.destructive
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

ActionMenu.ViewIcon = function ViewIcon() {
  return <Eye className="h-4 w-4" />;
};

ActionMenu.EditIcon = function EditIcon() {
  return <Pencil className="h-4 w-4" />;
};

ActionMenu.DeleteIcon = function DeleteIcon() {
  return <Trash2 className="h-4 w-4" />;
};
