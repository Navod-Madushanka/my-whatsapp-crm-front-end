import React from 'react';
import { Clock, CheckCircle2, XCircle, MessageSquare, Globe } from 'lucide-react';
import type { WhatsAppTemplate } from '../../api/templates';

interface TemplateCardProps {
  template: WhatsAppTemplate;
}

const statusConfig = {
  APPROVED: { color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle2 },
  PENDING: { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock },
  REJECTED: { color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle },
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const status = template.status as keyof typeof statusConfig;
  const { color, icon: Icon } = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${color}`}>
          <Icon size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
          <Globe size={14} />
          {template.language}
        </div>
      </div>

      <h3 className="text-gray-900 font-bold text-sm mb-1 truncate group-hover:text-green-600 transition-colors">
        {template.name}
      </h3>
      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tight mb-4">
        {template.category}
      </p>

      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4">
        <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed italic">
          "{template.components.find(c => c.type === 'BODY')?.text}"
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <MessageSquare size={14} />
          <span className="text-[10px] font-bold">
            {template.components.find(c => c.type === 'BUTTONS')?.buttons?.length || 0} Buttons
          </span>
        </div>
        <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};