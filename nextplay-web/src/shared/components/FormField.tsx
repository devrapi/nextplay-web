import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface SelectOption {
  value: number | string;
  label: string;
}

type FormFieldAsInput = InputHTMLAttributes<HTMLInputElement> & { type?: 'text' | 'email' | 'number' | 'date' | 'tel' | 'url' | 'password' };
type FormFieldAsSelect = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'type'> & { type: 'select'; options: SelectOption[]; placeholder?: string };
type FormFieldAsTextarea = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'type'> & { type: 'textarea' };

type FormFieldProps = {
  label: string;
  error?: string;
  rightSlot?: React.ReactNode;
} & (FormFieldAsInput | FormFieldAsSelect | FormFieldAsTextarea);

const inputClasses = (error: string | undefined, rightSlot: React.ReactNode | undefined, isSelect = false) =>
  [
    'w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white',
    'outline-none transition-all duration-150',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
      : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15',
    'hover:border-gray-400',
    rightSlot ? 'pr-10' : '',
    isSelect ? 'appearance-none' : '',
  ].join(' ').trim();

const FormField = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, rightSlot, id, className, ...props }, ref) => {
    const type = (props as Record<string, unknown>).type as string | undefined;

    const renderInput = () => {
      const baseProps = {
        id,
        className: [inputClasses(error, rightSlot), className ?? ''].join(' ').trim(),
        'aria-invalid': !!error,
      };

      if (type === 'select') {
        const { options, placeholder, ...selectProps } = props as FormFieldAsSelect;
        return (
          <div className="relative">
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              {...baseProps}
              {...selectProps}
              className={[inputClasses(error, rightSlot, true), className ?? ''].join(' ').trim()}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );
      }

      if (type === 'textarea') {
        const { ...textareaProps } = props as FormFieldAsTextarea;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...baseProps}
            {...textareaProps}
            className={[inputClasses(error, false), 'resize-y min-h-[80px]', className ?? ''].join(' ').trim()}
          />
        );
      }

      const { ...inputProps } = props as FormFieldAsInput;
      return (
        <div className="relative">
          <input ref={ref as React.Ref<HTMLInputElement>} {...baseProps} {...inputProps} />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              {rightSlot}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
        {renderInput()}
        {error && <p className="text-xs text-red-500 ml-0.5">{error}</p>}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
