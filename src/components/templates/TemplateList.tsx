import React, { useState } from 'react';
import { Search, Plus, Filter, Loader2 } from 'lucide-react';
import { useTemplates } from '../../hooks/useTemplates';
import { TemplateCard } from './TemplateCard';
import { Link } from 'react-router-dom';

export const TemplateList: React.FC = () => {
  const { templates, isLoading } = useTemplates();
  const [search, setSearch] = useState('');

  const filteredTemplates = templates?.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Template Lab</h1>
          <p className="text-gray-500 text-sm">Manage and monitor your Meta-approved message templates.</p>
        </div>
        
        <Link 
          to="/templates/create" 
          className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} />
          Create New Template
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search templates by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all"
          />
        </div>
        <button className="px-4 py-2.5 border border-gray-200 rounded-xl flex items-center gap-2 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Grid State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="text-green-500 animate-spin" size={40} />
          <p className="text-gray-400 font-medium animate-pulse">Fetching templates from Meta...</p>
        </div>
      ) : filteredTemplates?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No templates found</p>
          <p className="text-gray-500 mt-1">Try a different search or create your first template.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates?.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};