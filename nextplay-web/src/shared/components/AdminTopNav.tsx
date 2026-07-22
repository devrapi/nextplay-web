import UserDropdown from '../../features/auth/components/UserDropdown';

interface AdminTopNavProps {
  onMobileMenuToggle: () => void;
}

export default function AdminTopNav({ onMobileMenuToggle }: AdminTopNavProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-700 bg-gray-900 px-4">
      {/* Left: mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
          className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span className="hidden lg:block text-sm font-semibold text-gray-200">
          Admin Portal
        </span>
      </div>

      {/* Right: user menu */}
      <UserDropdown />
    </header>
  );
}
