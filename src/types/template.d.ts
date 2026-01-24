/**
 * WhatsApp Template Types
 * Based on Meta Business API Specifications
 */

export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';

export type TemplateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'DISABLED';

export type HeaderFormat = 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO';

export type ButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';

export interface TemplateButton {
  type: ButtonType;
  text: string;
  url?: string;
  phone_number?: string;
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: HeaderFormat;
  text?: string;
  buttons?: TemplateButton[];
  example?: {
    header_handle?: string[];
    body_text?: string[][]; // Array of strings for variables {{1}}, {{2}}
  };
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  components: TemplateComponent[];
  last_updated_at?: string;
}

// Helper type for the creation payload
export interface CreateTemplatePayload {
  name: string;
  category: TemplateCategory;
  language: string;
  components: TemplateComponent[];
}