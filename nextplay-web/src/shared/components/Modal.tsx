import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import Spinner from './Spinner';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

interface ModalFooterProps {
  children: ReactNode;
}

function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
      {children}
    </div>
  );
}

function ModalLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner className="h-6 w-6 text-indigo-600" />
    </div>
  );
}

function ModalEmpty({ icon: Icon, message, subtext }: { icon: React.ComponentType<{ className?: string }>; message: string; subtext?: string }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Icon className="h-10 w-10 text-gray-300 mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

Modal.Footer = ModalFooter;
Modal.Loading = ModalLoading;
Modal.Empty = ModalEmpty;
