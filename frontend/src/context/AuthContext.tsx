'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken, getAuthToken } from '@/services/api';

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify authentication state on mount
  useEffect(() => {
    async function checkAuth() {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setTokenState(storedToken);
        const userData = await api.get<User>('/api/auth/me');
        setUser(userData);
      } catch (error) {
        console.error('Failed to authenticate token:', error);
        // Clean up invalid session state
        setTokenState(null);
        setAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', {
        username: usernameOrEmail,
        password,
      });

      setTokenState(response.token);
      setAuthToken(response.token);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', {
        username,
        email,
        password,
      });

      setTokenState(response.token);
      setAuthToken(response.token);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setTokenState(null);
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
