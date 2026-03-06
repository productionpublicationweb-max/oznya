'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get stored user
function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('nyxia_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('nyxia_user');
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize user from localStorage on client side
    const storedUser = getStoredUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUser) setUser(storedUser);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('nyxia_user', JSON.stringify(data.user));
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Email ou mot de passe incorrect' };
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('nyxia_user', JSON.stringify(data.user));
        return { success: true };
      }
      
      console.error('Erreur inscription:', data);
      return { success: false, error: data.error || 'Erreur lors de l\'inscription' };
    } catch (error) {
      console.error('Exception inscription:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('nyxia_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
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
