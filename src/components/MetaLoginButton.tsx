// src/components/MetaLoginButton.tsx
import React, { useState } from 'react';
import { useMetaSDK } from '../hooks/useMetaSDK';
import { useAuth } from '../context/AuthContext'; 
import { useTenant } from '../context/useTenant';
import { exchangeMetaCode } from '../services/metaService';

export const MetaLoginButton: React.FC = () => {
  const { isLoaded } = useMetaSDK();
  const { businessId } = useAuth(); // Retrieved from AuthContext [cite: 13, 34]
  const { refreshTenant } = useTenant(); // Refresh function from TenantContext 
  
  const [isConnecting, setIsConnecting] = useState(false);

  const handleMetaLogin = () => {
    // Ensure SDK is loaded and business context exists before proceeding [cite: 34]
    if (!isLoaded || !businessId) return;

    setIsConnecting(true);

    // Trigger Meta OAuth popup for Embedded Signup [cite: 108, 111]
    window.FB.login(
      async (response) => {
        // Step 1: Capture the code returned by Meta [cite: 56, 112]
        if (response.authResponse?.code) {
          try {
            // Step 2: POST this code to the /auth/meta-callback/{biz_id} backend endpoint [cite: 56, 113]
            await exchangeMetaCode(businessId, response.authResponse.code);
            
            // Step 3: Refresh global tenant state to get WABA ID and Phone Number ID [cite: 33, 115]
            // This will also turn the Sidebar connection badge green (isMetaConnected: true)
            await refreshTenant(); 
            
            alert("WhatsApp Business Account connected successfully!");
          } catch (err) {
            console.error("Token exchange failed:", err);
            alert("Failed to secure Permanent Access Token. Please try again.");
          } finally {
            setIsConnecting(false);
          }
        } else {
          setIsConnecting(false);
          console.warn("User cancelled login or did not grant necessary permissions.");
        }
      },
      {
        // Required scopes for WABA management as per tech spec [cite: 55]
        scope: 'whatsapp_business_management,whatsapp_business_messaging',
        extras: {
          feature: 'whatsapp_embedded_signup',
          setup: {}
        }
      }
    );
  };

  return (
    <button 
      onClick={handleMetaLogin}
      disabled={!isLoaded || isConnecting}
      className={`flex items-center justify-center px-6 py-2 rounded-lg font-semibold text-white transition-all
        ${isLoaded && !isConnecting 
          ? 'bg-[#1877F2] hover:bg-[#166fe5] shadow-md' 
          : 'bg-gray-400 cursor-not-allowed'}`}
    >
      {isConnecting ? (
        <span className="flex items-center">
          {/* Simple loading spinner could be added here */}
          Linking Account...
        </span>
      ) : (
        'Connect WhatsApp'
      )}
    </button>
  );
};