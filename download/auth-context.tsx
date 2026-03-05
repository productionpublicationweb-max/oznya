'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string | null;
  birthDate: string | null;
  credits: number;
  loyaltyPoints: number;
  level: number;
  xp: number;
  badges: string[];
  totalMessages: number;
  totalSessions: number;
  theme: 'dark' | 'light';
  notifications: boolean;
  referralCode: string | null;
  promoCodes: PromoCode[];
}

export interface PromoCode {
  code: string;
  discount: number;
  source: string;
  expiresAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  addXP: (amount: number) => Promise<void>;
  addLoyaltyPoints: (points: number) => Promise<void>;
  incrementMessages: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  birthDate?: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'nyxia_user_session';

// Custom hook to sync state with localStorage
function useLocalStorageState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with a function to avoid SSR issues
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync to localStorage when state changes
  useEffect(() => {
    try {
      if (state === null || state === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [key, state]);

  return [state, setState];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorageState<User | null>(STORAGE_KEY, null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          ...data.user,
          badges: data.user.badges ? JSON.parse(data.user.badges) : []
        });
        return { success: true };
      }

      return { success: false, error: data.error || 'Erreur de connexion' };
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const register = async (registerData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          ...data.user,
          badges: data.user.badges ? JSON.parse(data.user.badges) : []
        });
        return { success: true };
      }

      return { success: false, error: data.error || 'Erreur d\'inscription' };
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    try {
      await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates })
      });
      return true;
    } catch {
      return false;
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    const xpPerLevel = 100;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;
    
    await updateUser({ xp: newXP, level: newLevel });
  };

  const addLoyaltyPoints = async (points: number) => {
    if (!user) return;
    await updateUser({ loyaltyPoints: user.loyaltyPoints + points });
  };

  const incrementMessages = async () => {
    if (!user) return;
    await updateUser({ totalMessages: user.totalMessages + 1 });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      updateUser,
      addXP,
      addLoyaltyPoints,
      incrementMessages
    }}>
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
