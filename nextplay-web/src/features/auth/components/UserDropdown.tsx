import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
      setConfirming(false);
    }
  };

  const initials = useMemo(
    () => user?.name
      ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
      : '?',
    [user?.name],
  );

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
            {initials}
          </span>
          <span className="hidden md:block max-w-[100px] truncate font-medium">{user?.name}</span>
          <ChevronDown className={`hidden md:block h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white py-1 shadow-lg ring-1 ring-gray-200 z-40 animate-fade-in">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="truncate text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>

            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500">
                <Shield className="h-3.5 w-3.5 text-indigo-500" />
                <span>{(user?.roles ?? ['User']).join(', ')}</span>
              </div>
            </div>

            <div className="py-1">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <User className="h-4 w-4 text-gray-400" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => { setOpen(false); setConfirming(true); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {confirming && (
        <ConfirmDialog
          title="Sign out"
          message="Are you sure you want to sign out?"
          confirmLabel="Sign out"
          cancelLabel="Cancel"
          isLoading={isLoggingOut}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
