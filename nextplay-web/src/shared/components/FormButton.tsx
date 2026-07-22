import { type ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function FormButton({ loading, children, disabled, className, ...props }: FormButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition',
        'bg-yellow-400 text-gray-900 hover:bg-yellow-300',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className ?? '',
      ]
        .join(' ')
        .trim()}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
