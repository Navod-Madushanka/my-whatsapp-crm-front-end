import React from 'react';
import { useWatch, type Control } from 'react-hook-form';
import { CheckCheck, Info } from 'lucide-react';
import type { TemplateComponent, TemplateButton } from '../../api/templates';
import type { TemplateFormValues } from '../../schema/template.schema';

interface TemplatePreviewProps {
  control: Control<TemplateFormValues>;
  name?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ control, name }) => {
  // Directly watch components for real-time preview updates
  const components = useWatch({
    control,
    name: 'components',
  }) as TemplateComponent[];

  const getComponent = (type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS') => {
    return components?.find((c) => c.type === type);
  };

  const header = getComponent('HEADER');
  const body = getComponent('BODY');
  const footer = getComponent('FOOTER');
  const buttonsComp = getComponent('BUTTONS');

  const renderBodyText = () => {
    if (!body?.text) return "Your message body will appear here...";
    
    let text = body.text;
    // Extract samples from the example object in the body component
    const samples = body.example?.body_text?.[0] || [];
    
    // Replace {{n}} placeholders with actual sample values for the preview
    samples.forEach((sample, index) => {
      const placeholder = `{{${index + 1}}}`;
      if (text.includes(placeholder)) {
        text = text.replace(placeholder, sample || placeholder);
      }
    });
    
    return text;
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
      {/* Template Name Badge */}
      <div className="mb-4 flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
        <Info size={14} className="text-blue-500" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest truncate max-w-50">
          {name || "unnamed_template"}
        </span>
      </div>

      {/* Mobile Mockup Frame */}
      <div className="w-[320px] bg-[#E5DDD5] rounded-[40px] border-8 border-gray-900 h-145 relative overflow-hidden shadow-2xl font-sans">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black w-1/3 mx-auto rounded-b-2xl z-10"></div>

        <div className="px-3 pt-10">
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-[92%] relative">
            {/* Header Rendering */}
            {header && (
              <div className="bg-gray-50 border-b border-gray-100">
                {header.format === 'TEXT' ? (
                  <div className="p-3 font-bold text-[13px] text-gray-900 leading-tight">
                    {header.text || "Header Text"}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-200 text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Media {header.format} Placeholder
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Body & Footer Rendering */}
            <div className="p-3 text-[14px] text-gray-800 leading-normal">
              <div className="whitespace-pre-wrap wrap-break-word">
                {renderBodyText()}
              </div>
              
              {footer?.text && (
                <div className="text-[11px] text-gray-400 mt-1.5 leading-tight">
                  {footer.text}
                </div>
              )}

              {/* Timestamp & Status Icons */}
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-400 font-medium">12:45 PM</span>
                <CheckCheck size={15} className="text-blue-400" />
              </div>
            </div>

            {/* Buttons Rendering */}
            {buttonsComp?.buttons && buttonsComp.buttons.length > 0 && (
              <div className="border-t border-gray-100 flex flex-col divide-y divide-gray-100">
                {buttonsComp.buttons.map((btn: TemplateButton, idx: number) => (
                  <div key={idx} className="py-2.5 text-center text-[#00a884] font-semibold text-[13px] hover:bg-gray-50 transition-colors cursor-default">
                    {btn.text || "Button Label"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Background Wallpaper Pattern Overlay (Optional) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
    </div>
  );
};