import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, AlertCircle, CheckCircle2, Layout, Plus, Trash2, Globe, Type, Image as ImageIcon } from 'lucide-react';

// Internal Imports
import { TemplateSchema, type TemplateFormValues } from '../../schema/template.schema';
import { useTemplates } from '../../hooks/useTemplates';
import { TemplatePreview } from './TemplatePreview';
import { VariableInput } from './VariableInput';
import { ButtonBuilder } from './ButtonBuilder';
import type { TemplateComponent, WhatsAppTemplate } from '../../api/templates';

const LANGUAGES = [
  { label: 'English (US)', value: 'en_US' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese (BR)', value: 'pt_BR' },
  { label: 'French', value: 'fr' },
];

// Helper type to reference the union members of the components array
type FormComponent = TemplateFormValues['components'][number];

export const TemplateBuilder: React.FC = () => {
  const { createTemplate, isCreating } = useTemplates();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(TemplateSchema),
    defaultValues: {
      name: '',
      category: 'MARKETING',
      language: 'en_US',
      components: [
        { type: 'BODY', text: '', example: { body_text: [[]] } }
      ]
    }
  });

  const watchedName = useWatch({ control, name: 'name' });
  // Casting to TemplateComponent for easier internal logic, 
  // but we use FormComponent when writing back to setValue
  const watchedComponents = useWatch({ control, name: 'components' }) as TemplateComponent[] || [];

  const findCompIdx = (type: TemplateComponent['type']) => 
    watchedComponents.findIndex(c => c.type === type);
  
  const addComponent = (type: 'HEADER' | 'FOOTER') => {
    if (findCompIdx(type) > -1) return;
    
    // Explicitly type as FormComponent to satisfy the Discriminated Union
    const newComp: FormComponent = type === 'HEADER' 
      ? { type: 'HEADER', format: 'TEXT', text: '' } 
      : { type: 'FOOTER', text: '' };
    
    setValue('components', [...watchedComponents, newComp] as TemplateFormValues['components']);
  };

  const removeComponent = (type: TemplateComponent['type']) => {
    const filtered = watchedComponents.filter(c => c.type !== type);
    setValue('components', filtered as TemplateFormValues['components']);
  };

  const onSubmit = async (data: TemplateFormValues) => {
    setIsSuccess(false);
    setSubmitError(null);
    try {
      await createTemplate(data as unknown as WhatsAppTemplate); 
      setIsSuccess(true);
      reset(); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      let errorMsg = "Submission failed. Please check Meta constraints.";
      if (err instanceof Error) {
        errorMsg = err.message;
        const errorWithResponse = err as { response?: { data?: { detail?: string } } };
        if (errorWithResponse.response?.data?.detail) {
          errorMsg = errorWithResponse.response.data.detail;
        }
      }
      setSubmitError(errorMsg);
    }
  };

  const headerIdx = findCompIdx('HEADER');
  const bodyIdx = findCompIdx('BODY');
  const footerIdx = findCompIdx('FOOTER');

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-500">
      
      {/* Feedback Banners */}
      <div className="mb-6 space-y-3">
        {isSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 shadow-sm animate-in slide-in-from-top">
            <CheckCircle2 size={20} />
            <div>
              <p className="text-sm font-bold">Template Submitted!</p>
              <p className="text-xs">It is now pending review in your Template Lab list.</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shadow-sm animate-in slide-in-from-top">
            <AlertCircle size={20} />
            <div>
              <p className="text-sm font-bold">Submission Failed</p>
              <p className="text-xs">{submitError}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Layout size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Template Designer</h1>
              <p className="text-gray-500 text-xs">Configure message components for Meta Approval</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Template Name</label>
              <input 
                {...register('name')} 
                className={`w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-green-500 transition-all ${errors.name ? 'border-red-500 bg-red-50' : ''}`} 
                placeholder="welcome_message" 
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
              <select {...register('category')} className="w-full rounded-lg border-gray-300 text-sm p-2.5">
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Globe size={12}/> Language
              </label>
              <select {...register('language')} className="w-full rounded-lg border-gray-300 text-sm p-2.5">
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 py-2">
            {headerIdx === -1 && (
              <button type="button" onClick={() => addComponent('HEADER')} className="text-[10px] font-bold px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center gap-1 transition-colors">
                <Plus size={12}/> ADD HEADER
              </button>
            )}
            {footerIdx === -1 && (
              <button type="button" onClick={() => addComponent('FOOTER')} className="text-[10px] font-bold px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center gap-1 transition-colors">
                <Plus size={12}/> ADD FOOTER
              </button>
            )}
          </div>

          {headerIdx > -1 && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative animate-in fade-in slide-in-from-left-2">
              <button type="button" onClick={() => removeComponent('HEADER')} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <Trash2 size={16}/>
              </button>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Header Component</label>
              
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="radio" value="TEXT" {...register(`components.${headerIdx}.format` as const)} /> 
                  <Type size={14}/> Text
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input type="radio" value="IMAGE" {...register(`components.${headerIdx}.format` as const)} /> 
                  <ImageIcon size={14}/> Image
                </label>
              </div>

              {watchedComponents[headerIdx]?.format === 'TEXT' && (
                <input 
                  {...register(`components.${headerIdx}.text` as const)} 
                  className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-green-500" 
                  placeholder="e.g. Order Confirmed" 
                />
              )}
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-dashed">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Message Body</label>
              <span className="text-[10px] text-gray-400">Max 1024 chars</span>
            </div>
            <textarea 
              {...register(`components.${bodyIdx}.text` as const)} 
              rows={5} 
              className="w-full rounded-xl border-gray-300 text-sm p-4 focus:ring-2 focus:ring-green-500 outline-none resize-none transition-all"
              placeholder="Hello {{1}}, your order {{2}} is ready!"
            />
            {watchedComponents[bodyIdx]?.type === 'BODY' && (
              <VariableInput 
                bodyText={watchedComponents[bodyIdx].text || ''}
                samples={watchedComponents[bodyIdx].example?.body_text?.[0] || []}
                onChange={(s) => setValue(`components.${bodyIdx}.example`, { body_text: [s] })}
              />
            )}
          </div>

          {footerIdx > -1 && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative animate-in fade-in slide-in-from-left-2">
              <button type="button" onClick={() => removeComponent('FOOTER')} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <Trash2 size={16}/>
              </button>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Footer Text</label>
              <input 
                {...register(`components.${footerIdx}.text` as const)} 
                className="w-full rounded-lg border-gray-300 text-sm p-2.5 mt-1 focus:ring-2 focus:ring-green-500" 
                placeholder="e.g. Reply STOP to opt out" 
              />
            </div>
          )}

          <Controller
            control={control}
            name="components"
            render={({ field }) => {
              const bIdx = field.value.findIndex(c => c.type === 'BUTTONS');
              const buttonsComponent = field.value[bIdx];
              const buttons = (buttonsComponent?.type === 'BUTTONS') ? buttonsComponent.buttons : [];
              
              return (
                <ButtonBuilder 
                  buttons={buttons}
                  onChange={(newBtns) => {
                    const currentComps = [...field.value];
                    
                    // FIX: Typed as member of the form union
                    const btnComp: FormComponent = { 
                      type: 'BUTTONS', 
                      buttons: newBtns 
                    };

                    if (bIdx > -1) {
                      currentComps[bIdx] = btnComp;
                    } else {
                      currentComps.push(btnComp);
                    }
                    setValue('components', currentComps);
                  }}
                />
              );
            }}
          />

          <div className="pt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Submit to Meta Review
                </>
              )}
            </button>
          </div>
        </form>

        <div className="lg:w-100">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Live WhatsApp Preview</p>
            </div>
            <TemplatePreview control={control} name={watchedName} />
          </div>
        </div>
      </div>
    </div>
  );
};