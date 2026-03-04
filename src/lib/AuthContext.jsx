import { createContext, useState, useContext, useEffect } from 'react';
import { appClient } from '@/api/appClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Check current session on mount
    checkUserAuth();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = appClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAuth = async () => {
    try {
      const { data: { session } } = await appClient.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await appClient.auth.signOut();
  };

  const navigateToLogin = () => {
    window.location.href = import.meta.env.VITE_LOGIN_URL || '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false, // no longer needed, kept for compatibility
      authError: null,                // no longer needed, kept for compatibility
      appPublicSettings: null,        // no longer needed, kept for compatibility
      logout,
      navigateToLogin,
      checkAppState: checkUserAuth,   // alias for compatibility
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};