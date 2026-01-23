// src/services/metaService.ts
import axios from 'axios';

/**
 * Exchanges the temporary Meta 'code' for a Permanent Access Token.
 * Note: Authentication is handled by the Axios interceptor (JWT)[cite: 29].
 */
export const exchangeMetaCode = async (businessId: string, code: string) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/meta-callback/${businessId}`, {
    code: code,
  });
  return response.data;
};