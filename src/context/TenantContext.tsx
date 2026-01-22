// src/context/TenantContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface TenantState {
  businessId: string | null;
  businessName: string | null;
  isMetaConnected: boolean; // Tracks if WABA ID & Access Token exist
  phoneNumberId: string | null;
  wabaId: string | null;
  loading: boolean;
}

const TenantContext = createContext<TenantState | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [tenant, setTenant] = useState<TenantState>({
    businessId: null,
    businessName: null,
    isMetaConnected: false,
    phoneNumberId: null,
    wabaId: null,
    loading: true,
  });

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!isAuthenticated || !token) {
        setTenant(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // This calls a 'System Health' or 'Profile' endpoint [cite: 158]
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data; // Expected: { id, name, waba_id, phone_number_id, meta_access_token }
        
        setTenant({
          businessId: data.id,
          businessName: data.name,
          isMetaConnected: !!data.waba_id && !!data.meta_access_token,
          phoneNumberId: data.phone_number_id,
          wabaId: data.waba_id,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch tenant context", error);
        setTenant(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBusinessProfile();
  }, [isAuthenticated, token]);

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};