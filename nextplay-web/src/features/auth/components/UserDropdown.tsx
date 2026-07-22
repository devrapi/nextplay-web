import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
          className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition"
        >
          {/* Avatar */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-gray-900">
            {initials}
          </span>
          <span className="hidden sm:block max-w-[120px] truncate">{user?.name}</span>
          {/* Chevron */}
          <svg
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-48 rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black/20 z-40">
            {/* User info */}
            <div className="border-b border-gray-600 px-4 py-2">
              <p className="truncate text-xs font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() => { setOpen(false); setConfirming(true); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Sign out
            </button>
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
