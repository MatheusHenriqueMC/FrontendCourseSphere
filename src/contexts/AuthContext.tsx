import { useState, ReactNode } from 'react';
import api from '../services/api';
import { User, AuthResponse } from '../types';
import { AuthContext } from './AuthContextType';

function getInitialToken(): string | null {
  return localStorage.getItem('token');
}

function getInitialUser(): User | null {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/register', { name, email, password });
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}