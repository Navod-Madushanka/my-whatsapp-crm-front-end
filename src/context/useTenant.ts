// src/context/useTenant.ts
import { useContext, createContext } from 'react';
import type { TenantState } from './TenantTypes';

// Create context here or in a third 'Context' file if needed
export const TenantContext = createContext<TenantState | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};