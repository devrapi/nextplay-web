import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import * as authService from '../services/authService';
import type { AuthContextValue, AuthState, LoginRequest } from '../types';

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

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await authService.me();
        setState({ user, token: null, isAuthenticated: true, isLoading: false });
      } catch {
        clearToken();
        setState({ ...initialState, isLoading: false });
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const { user, token } = await authService.login(credentials);
    persistToken(token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    clearToken();
    setState({ ...initialState, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
