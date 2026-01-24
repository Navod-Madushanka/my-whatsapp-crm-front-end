// src/App.tsx
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Added for Phase 3
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Phase 2 & 3 Components
import { WhatsAppConfiguration } from './components/WhatsAppConfiguration';
import { TemplateList } from './components/templates/TemplateList';    // Real Component
import { TemplateBuilder } from './components/templates/TemplateBuilder'; // Real Component

// Placeholder View Components
const Contacts = () => <div className="p-6">Contact Management & Opt-out Tracking</div>;
const Campaigns = () => <div className="p-6">Bulk Messaging Engine</div>;
const Inbox = () => <div className="p-6">Real-time Customer Chat</div>;
const Login = () => <div className="flex items-center justify-center h-screen">Login / Meta Embedded Signup</div>;

// Initialize TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Business Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/dashboard" element={<WhatsAppConfiguration />} />
                  
                  <Route path="/contacts" element={<Contacts />} />
                  
                  {/* Phase 3: Template Management Routes */}
                  <Route path="/templates">
                    <Route index element={<TemplateList />} />
                    <Route path="create" element={<TemplateBuilder />} />
                  </Route>

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
    </QueryClientProvider>
  );
}

export default App;