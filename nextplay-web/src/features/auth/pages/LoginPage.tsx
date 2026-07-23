import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
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
      navigate('/admin', { replace: true });
    } catch (error) {
      setApiError(resolveApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
            <span className="text-xl font-bold text-white">NP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">NextPlay</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your admin portal</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {apiError && (
            <div role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
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
              placeholder="Enter your password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>

            <FormButton type="submit" loading={isLoading} className="w-full">
              {isLoading ? 'Signing in\u2026' : 'Sign in'}
            </FormButton>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} NextPlay. All rights reserved.
        </p>
      </div>
    </div>
  );
}
