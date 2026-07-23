import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import * as authService from '../services/authService';
import type { AuthContextValue, AuthState, LoginRequest } from '../types';
import { UNAUTHORIZED_EVENT } from '../../../shared/api/client';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const TOKEN_KEY = 'auth_token';

function persistToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setState({ ...initialState, isLoading: false });
        setInitDone(true);
        return;
      }

      try {
        const user = await authService.me();
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        clearToken();
        setState({ ...initialState, isLoading: false });
      } finally {
        setInitDone(true);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (!initDone) return;

    const handleUnauthorized = () => {
      clearToken();
      setState({ ...initialState, isLoading: false });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [initDone]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const { user, token } = await authService.login(credentials);
    persistToken(token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // swallow — backend may already have invalidated the session
    }
    clearToken();
    setState({ ...initialState, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
