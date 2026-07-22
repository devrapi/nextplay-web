import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useAuth } from '../hooks/useAuth';

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}

function resolveApiError(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401 || status === 422) {
      return 'Invalid email or password. Please try again.';
    }
    if (status === 429) {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    if (status != null && status >= 500) {
      return 'A server error occurred. Please try again later.';
    }
    if (!error.response) {
      return 'Unable to reach the server. Check your connection.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      await login({ email: values.email, password: values.password });
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setApiError(resolveApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Branding */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold text-yellow-400 tracking-tight">NextPlay</span>
          <p className="mt-1 text-sm text-gray-400">League Management Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-gray-800 p-8 shadow-lg">
          <h1 className="mb-6 text-lg font-semibold text-white">Sign in to your account</h1>

          {apiError && (
            <div role="alert" className="mb-5 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            <FormField
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="admin@nextplay.com"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />

            <FormField
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-yellow-400 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.97 9.97 0 016.375 2.325M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 accent-yellow-400"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>

            <FormButton type="submit" loading={isLoading} disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </FormButton>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} NextPlay. All rights reserved.
        </p>
      </div>
    </div>
  );
}
