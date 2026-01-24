import axios from "axios";

// The VITE_API_URL is pulled from your .env as per Phase 1 requirements
const API_URL = import.meta.env.VITE_API_URL;

/**
 * WhatsApp Template Component Types based on Meta API
 */
export interface TemplateButton {
  type: 'QUICK_REPLY' | 'PHONE_NUMBER' | 'URL' | 'COPY_CODE';
  text: string;
  url?: string;
  phone_number?: string;
  example?: string[];
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  // Replaced any[] with a specific interface
  buttons?: TemplateButton[]; 
  example?: {
    header_handle?: string[];
    header_text?: string[];
    body_text?: string[][]; 
  };
}

export interface WhatsAppTemplate {
    id?: string;
    name: string;
    category: 'MARKETING' | 'UTILITY';
    language: string;
    components: TemplateComponent[];
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/**
 * Template API Service
 * Interacts with templates.router
 */

export const TemplateService = {
    // Fetch all templates for the authenticated business
    getTemplates: async (): Promise<WhatsAppTemplate[]> =>{
        const response = await axios.get(`${API_URL}/templates/`);
        return response.data;
    },

    // Submit a new template for Meta Approval
    createTemplate: async (templateData: WhatsAppTemplate): Promise<WhatsAppTemplate> => {
    // Note: The business_id is handled by the backend JWT dependency
    const response = await axios.post(`${API_URL}/templates/`, templateData);
    return response.data;
    },

    // Delete a template (Only if allowed by Meta status)
    deleteTemplate: async (templateName: string): Promise<void> => {
    await axios.delete(`${API_URL}/templates/${templateName}`);
    },

    // Fetch specific template details/status
    getTemplateStatus: async (templateName: string): Promise<WhatsAppTemplate> => {
    const response = await axios.get(`${API_URL}/templates/${templateName}`);
    return response.data;
    }
}