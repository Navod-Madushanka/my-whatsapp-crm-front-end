// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileCode, 
  Send, 
  MessageSquare, 
  LogOut,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';

/**
 * ConnectionStatus Component
 * Displays the current Business Name and the health of the Meta API connection
 * derived from the TenantContext.
 */
const ConnectionStatus = () => {
  const { isMetaConnected, businessName, loading } = useTenant();

  return (
    <div className="px-4 py-3 mb-6 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Current Tenant
      </p>
      <p className="text-sm font-semibold text-gray-900 truncate">
        {loading ? 'Loading...' : businessName || 'Unknown Business'}
      </p>
      <div className="flex items-center mt-2">
        {isMetaConnected ? (
          <ShieldCheck className="h-3.5 w-3.5 text-green-500 mr-1.5" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-red-500 mr-1.5" />
        )}
        <span className={`text-xs font-medium ${isMetaConnected ? 'text-green-700' : 'text-red-700'}`}>
          {isMetaConnected ? 'Meta API Active' : 'Action Required'}
        </span>
      </div>
    </div>
  );
};

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Templates', href: '/templates', icon: FileCode },
  { name: 'Campaigns', href: '/campaigns', icon: Send },
  { name: 'Inbox', href: '/inbox', icon: MessageSquare },
];

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
      <div className="flex flex-col grow pt-5 pb-4 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center shrink-0 px-4 mb-6">
          <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">WhatsApp CRM</span>
        </div>
        
        <div className="px-3">
          {/* Business & Meta Connection Info */}
          <ConnectionStatus />

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className={`mr-3 h-5 w-5 shrink-0 ${
                  /* Icon color logic to match active state */
                  'group-hover:text-gray-900'
                }`} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;