import React from 'react';
import { Plus, Trash2, Link, Phone, MessageSquare, Copy } from 'lucide-react';
import type { TemplateButton } from '../../api/templates';

interface ButtonBuilderProps {
  buttons: TemplateButton[];
  onChange: (buttons: TemplateButton[]) => void;
}

export const ButtonBuilder: React.FC<ButtonBuilderProps> = ({ buttons, onChange }) => {
  
  const addButton = (type: TemplateButton['type']) => {
    if (buttons.length >= 10) return;
    
    const newButton: TemplateButton = {
      type,
      text: '',
      ...(type === 'URL' && { url: '' }),
      ...(type === 'PHONE_NUMBER' && { phone_number: '' }),
      // Added empty example array for COPY_CODE as Meta often requires a sample code
      ...(type === 'COPY_CODE' && { example: ['OFFER20'] }), 
    };
    
    onChange([...buttons, newButton]);
  };

  const updateButton = (index: number, updates: Partial<TemplateButton>) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], ...updates };
    onChange(newButtons);
  };

  const removeButton = (index: number) => {
    onChange(buttons.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 border-t pt-6 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Plus size={16} className="text-green-600" /> Buttons (Optional)
        </h3>
        <span className="text-xs text-gray-500">{buttons.length}/10 buttons</span>
      </div>

      {/* Button Type Selector */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addButton('QUICK_REPLY')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium transition-colors"
        >
          <MessageSquare size={14} /> Quick Reply
        </button>
        <button
          type="button"
          onClick={() => addButton('URL')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium transition-colors"
        >
          <Link size={14} /> Website
        </button>
        <button
          type="button"
          onClick={() => addButton('PHONE_NUMBER')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium transition-colors"
        >
          <Phone size={14} /> Call
        </button>
        {/* Now using the Copy icon */}
        <button
          type="button"
          onClick={() => addButton('COPY_CODE')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium transition-colors"
        >
          <Copy size={14} /> Copy Code
        </button>
      </div>

      <div className="space-y-3">
        {buttons.map((btn, idx) => (
          <div key={idx} className="group relative p-4 bg-gray-50 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => removeButton(idx)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={btn.text}
                  onChange={(e) => updateButton(idx, { text: e.target.value })}
                  placeholder={btn.type === 'COPY_CODE' ? "e.g. Copy Code" : "e.g. Visit Website"}
                  className="w-full text-sm border-gray-300 rounded-md focus:ring-green-500"
                />
              </div>

              {/* Conditional Inputs */}
              {btn.type === 'URL' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">URL</label>
                  <input
                    type="url"
                    value={btn.url || ''}
                    onChange={(e) => updateButton(idx, { url: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}
              {btn.type === 'PHONE_NUMBER' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={btn.phone_number || ''}
                    onChange={(e) => updateButton(idx, { phone_number: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}
              {btn.type === 'COPY_CODE' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sample Coupon Code</label>
                  <input
                    type="text"
                    value={btn.example?.[0] || ''}
                    onChange={(e) => updateButton(idx, { example: [e.target.value] })}
                    className="w-full text-sm border-gray-300 rounded-md"
                    placeholder="e.g. SUMMER25"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};