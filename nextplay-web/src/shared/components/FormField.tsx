import { type InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightSlot?: React.ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, rightSlot, id, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={[
            'w-full rounded-md bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400',
            'border outline-none transition',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500'
              : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30',
            rightSlot ? 'pr-10' : '',
            className ?? '',
          ]
            .join(' ')
            .trim()}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
);

FormField.displayName = 'FormField';

export default FormField;
