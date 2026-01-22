// src/context/AuthContext.tsx
import React, { createContext, useContext, useState} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  businessId: string | null;
  token: string | null;
  login: (token: string, businessId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [businessId, setBusinessId] = useState<string | null>(localStorage.getItem('business_id'));

  const login = (newToken: string, newBizId: string) => {
    setToken(newToken);
    setBusinessId(newBizId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('business_id', newBizId);
  };

  const logout = () => {
    setToken(null);
    setBusinessId(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, businessId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};