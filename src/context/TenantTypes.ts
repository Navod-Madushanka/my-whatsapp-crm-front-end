// src/context/TenantTypes.ts
export interface TenantState {
  businessId: string | null;
  businessName: string | null;
  isMetaConnected: boolean;
  phoneNumberId: string | null;
  wabaId: string | null;
  loading: boolean;
  refreshTenant: () => Promise<void>; 
}