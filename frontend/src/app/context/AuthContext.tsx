import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, Role } from '../types';
import { createClient } from '../../utils/supabase/client';

interface AuthContextType {
  user: AuthUser | null;
  socialUser: any | null; // Holds temporary Supabase user for first-time social login
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string | null, role: Role, candidateEmail?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'rishtafy_user';
const API_URL = 'http://localhost:3001/api/auth';
const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [socialUser, setSocialUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth State with our custom user state
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check local storage for existing session
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // 2. Listen for Supabase Auth changes (like Google Login redirect)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const savedUser = localStorage.getItem(STORAGE_KEY);
          if (!savedUser) {
            try {
              const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: session.user.email, isExternal: true })
              });
              const data = await response.json();
              if (response.ok) {
                setUser(data.user);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
                setSocialUser(null);
              } else if (response.status === 404) {
                // User is new! Store their Supabase info to pre-fill registration
                setSocialUser(session.user);
              }
            } catch (err) {
              console.error('Error syncing Google user:', err);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSocialUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      });

      setLoading(false);
      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Could not connect to authentication server.' };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string | null, role: Role, candidateEmail?: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          full_name: name, 
          email, 
          password: password || 'OAUTH_USER', // Backend needs a dummy if using Supabase directly, but our backend handles admin creation
          role, 
          candidateEmail,
          isExternal: !password // Flag for backend to know it's a social user completion
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        setSocialUser(null);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, error: 'Could not connect to authentication server.' };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google sign in failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSocialUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, socialUser, loading, login, register, signInWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
