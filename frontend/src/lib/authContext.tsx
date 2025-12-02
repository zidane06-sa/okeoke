import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { loginUser } from './api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  loginWithCredentials?: (email: string, password: string) => Promise<boolean>;
  register?: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Return a default context instead of throwing - safer
    return {
      user: null,
      isAuthenticated: false,
      loading: true,
      login: () => {},
      logout: () => {},
    };
  }
  return ctx;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser') || localStorage.getItem('user');
      if (raw) {
        setUser(JSON.parse(raw) as User);
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('currentUser', JSON.stringify(u));
    localStorage.setItem('user', JSON.stringify(u));
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      if (data && data.success && data.data) {
        const u = data.data;
        const userObj: User = {
          id: u._id || u.id || u.userId || '',
          email: u.email || u.emailAddress || '',
          fullName: u.fullName || u.name || u.namaLengkap || '',
          phoneNumber: u.phoneNumber || u.phone || u.nomorTelepon || '',
          role: u.role || 'parent',
        };
        login(userObj);
        if (data.token) localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('loginWithCredentials error', err);
      return false;
    }
  };

  const register = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem('currentUser') || localStorage.getItem('user');
        setUser(raw ? JSON.parse(raw) as User : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithCredentials,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};