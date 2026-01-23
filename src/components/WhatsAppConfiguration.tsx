// src/components/WhatsAppConfiguration.tsx
import React from 'react';
import { useTenant } from '../context/useTenant';
import { MetaLoginButton } from './MetaLoginButton';

export const WhatsAppConfiguration: React.FC = () => {
  const { isMetaConnected, wabaId, phoneNumberId, loading, businessName } = useTenant();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">WhatsApp Integration</h2>
            <p className="text-sm text-gray-500">{businessName}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${
            isMetaConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMetaConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isMetaConnected ? 'Active' : 'Disconnected'}
          </div>
        </div>

        {!isMetaConnected ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-600 mb-4">
                Connect your Meta Business Account to start sending messages and managing templates.
              </p>
              <MetaLoginButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">WhatsApp Business Account ID</label>
                <code className="text-sm text-blue-600 font-mono break-all">{wabaId}</code>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone Number ID</label>
                <code className="text-sm text-green-600 font-mono break-all">{phoneNumberId}</code>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <p><strong>✓ Connection Verified:</strong> Your account is ready for Phase 2.5 (Messaging) and Phase 4 (Campaigns).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};