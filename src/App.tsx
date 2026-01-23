// src/App.tsx
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext'; // Added TenantProvider
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Phase 2 Components
import { WhatsAppConfiguration } from './components/WhatsAppConfiguration';

// Placeholder View Components (To be developed in subsequent Phase 2.5 - 4)
const Contacts = () => <div className="p-6">Contact Management & Opt-out Tracking</div>;
const Templates = () => <div className="p-6">Meta Template Builder</div>;
const Campaigns = () => <div className="p-6">Bulk Messaging Engine</div>;
const Inbox = () => <div className="p-6">Real-time Customer Chat</div>;
const Login = () => <div className="flex items-center justify-center h-screen">Login / Meta Embedded Signup</div>;

function App() {
  return (
    <AuthProvider>
      {/* TenantProvider is nested inside AuthProvider so it can 
        access the JWT token for its internal /auth/me fetch.
      */}
      <TenantProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Business Routes [cite: 23] */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Phase 2 Dashboard: Now displays the WhatsApp Configuration 
                  and connection status[cite: 56, 93].
                */}
                <Route path="/dashboard" element={<WhatsAppConfiguration />} />
                
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/inbox" element={<Inbox />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;