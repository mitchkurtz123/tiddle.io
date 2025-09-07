// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithBubble, signOut, getAuthToken, getUserId } from '@/services/auth';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  error: string | null;
};

type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    error: null,
  });

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userId] = await Promise.all([
        getAuthToken(),
        getUserId()
      ]);

      if (token && userId) {
        setAuth({
          isAuthenticated: true,
          isLoading: false,
          userId,
          error: null,
        });
      } else {
        setAuth({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuth({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        error: null,
      });
    }
  };

  const login = async (email: string, password: string) => {
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { userId } = await signInWithBubble(email, password);
      
      setAuth({
        isAuthenticated: true,
        isLoading: false,
        userId,
        error: null,
      });
    } catch (error) {
      setAuth({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  const logout = async () => {
    console.log('AuthContext: Starting logout...');
    
    // Set loading state during logout
    setAuth(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('AuthContext: Calling signOut service...');
      await signOut();
      
      console.log('AuthContext: Logout successful, updating auth state...');
      setAuth({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        error: null,
      });
    } catch (error) {
      console.error('AuthContext: Logout failed:', error);
      
      // Still clear the auth state even if logout fails
      // This ensures the user gets logged out locally even if there are issues
      setAuth({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        error: 'Logout completed with errors - you have been signed out locally',
      });
    }
  };

  const clearError = () => {
    setAuth(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}