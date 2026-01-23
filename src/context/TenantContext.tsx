// src/context/TenantContext.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import type { TenantState } from './TenantTypes';
import { TenantContext } from './useTenant';

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  
  const [tenant, setTenant] = useState<Omit<TenantState, 'refreshTenant'>>({
    businessId: null,
    businessName: null,
    isMetaConnected: false,
    phoneNumberId: null,
    wabaId: null,
    loading: true,
  });

  const isMounted = useRef(true);
  
  // Track if we have already performed the initial fetch to avoid loops
  const hasFetched = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const refreshTenant = useCallback(async () => {
    // Return early if not authenticated
    if (!isAuthenticated || !token) {
      if (isMounted.current) {
        setTenant(prev => (prev.loading ? { ...prev, loading: false } : prev));
      }
      return;
    }

    try {
      // Calls the profile endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      
      if (isMounted.current) {
        setTenant({
          businessId: data.id,
          businessName: data.name,
          // Checks presence of WABA ID and Access Token
          isMetaConnected: !!(data.waba_id && data.meta_access_token),
          phoneNumberId: data.phone_number_id,
          wabaId: data.waba_id,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to refresh tenant data", error);
      if (isMounted.current) {
        setTenant(prev => ({ ...prev, loading: false }));
      }
    }
  }, [isAuthenticated, token]);

  // Use a timeout or a microtask to move the execution out of the synchronous effect body
  useEffect(() => {
    if (!hasFetched.current && isAuthenticated && token) {
      const controller = new AbortController();
      
      // Defers execution to the next tick to avoid the "cascading render" warning
      const timeoutId = setTimeout(() => {
        refreshTenant();
        hasFetched.current = true;
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }
  }, [refreshTenant, isAuthenticated, token]);

  return (
    <TenantContext.Provider value={{ ...tenant, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  );
};