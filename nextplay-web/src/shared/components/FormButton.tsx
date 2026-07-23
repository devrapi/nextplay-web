import { type ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
}

export default function FormButton({ loading, children, disabled, className, variant = 'primary', ...props }: FormButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
    danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 shadow-sm',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className ?? ''}`.trim()}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
