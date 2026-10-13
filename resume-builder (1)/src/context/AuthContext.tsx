import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/resume.ts';
import { api, getStoredToken, getStoredUser, removeStoredToken } from '../services/api.ts';
import { signInWithGooglePopup } from '../services/firebaseAuth.ts';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, photo?: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      try {
        const currentUser = await api.getMe();
        setUser(currentUser);
        setToken(storedToken);
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        removeStoredToken();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setToken(res.token);
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const res = await api.register(name, email, password, confirmPassword);
    setUser(res.user);
    setToken(res.token);
  };

  const loginWithGoogle = async () => {
    const firebaseUser = await signInWithGooglePopup();
    if (!firebaseUser.email) {
      throw new Error('No email found in Google account profile.');
    }
    const res = await api.googleAuth({
      email: firebaseUser.email,
      name: firebaseUser.displayName || undefined,
      profilePhoto: firebaseUser.photoURL || undefined,
      googleId: firebaseUser.uid,
    });
    setUser(res.user);
    setToken(res.token);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (name: string, photo?: string) => {
    const updated = await api.updateProfile(name, photo);
    setUser(updated);
  };

  const loginAsDemo = async () => {
    try {
      // Attempt login with demo user
      await login('demo@resumebuilder.io', 'DemoPass123!');
    } catch {
      // If demo user doesn't exist yet, register demo user
      await register('Alex Morgan', 'demo@resumebuilder.io', 'DemoPass123!', 'DemoPass123!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
