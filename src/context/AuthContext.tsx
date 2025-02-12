'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { type TUser } from '@/types/user';

type AuthContextType = {
  user: TUser | null;
  token: string | null;
  setAuth: (user: TUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setAuth = (user: TUser, token: string) => {
    setUser(user);
    setToken(token);

    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
