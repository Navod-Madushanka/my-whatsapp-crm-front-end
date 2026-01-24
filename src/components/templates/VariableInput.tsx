import React, { useEffect } from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';

interface VariableInputProps {
  bodyText: string;
  samples: string[];
  onChange: (newSamples: string[]) => void;
}

export const VariableInput: React.FC<VariableInputProps> = ({ bodyText, samples, onChange }) => {
  // 1. Find all {{n}} instances
  const variableMatches = bodyText.match(/{{(\d+)}}/g) || [];
  
  // 2. Get unique variables and sort them numerically
  const uniqueVariables = Array.from(new Set(variableMatches)).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numA - numB;
  });

  // 3. Sync Logic: If the number of variables in text decreases, trim the samples array
  useEffect(() => {
    if (samples.length > uniqueVariables.length) {
      onChange(samples.slice(0, uniqueVariables.length));
    }
  }, [uniqueVariables.length, samples.length, onChange, samples]);

  if (uniqueVariables.length === 0) return null;

  // 4. Validation: Check if variables are sequential (1, 2, 3...)
  const isNonSequential = uniqueVariables.some((varName, index) => {
    const num = parseInt(varName.replace(/\D/g, ''));
    return num !== index + 1;
  });

  const handleUpdate = (index: number, value: string) => {
    const updatedSamples = [...samples];
    updatedSamples[index] = value;
    onChange(updatedSamples);
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded-md shadow-sm">
            <HelpCircle size={14} className="text-white" />
          </div>
          <h4 className="text-sm font-bold text-blue-900">Variable Samples</h4>
        </div>
        {isNonSequential && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
            <AlertTriangle size={10} /> Non-Sequential
          </div>
        )}
      </div>
      
      <p className="text-xs text-blue-700 mb-4 leading-relaxed">
        Meta requires a sample value for each placeholder to understand your message context.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {uniqueVariables.map((variable, idx) => (
          <div key={variable} className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold text-blue-500 uppercase tracking-tight">
              Value for {variable}
            </label>
            <input
              type="text"
              placeholder={idx === 0 ? "e.g. Customer Name" : "e.g. Order ID"}
              value={samples[idx] || ""}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              className="w-full bg-white text-sm border-blue-200 rounded-lg py-2 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        ))}
      </div>

      {isNonSequential && (
        <p className="mt-3 text-[10px] text-amber-700 italic">
          Tip: Meta prefers variables in order: {"{{1}}, {{2}}, {{3}}..."}
        </p>
      )}
    </div>
  );
};