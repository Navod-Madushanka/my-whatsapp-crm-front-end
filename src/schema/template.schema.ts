import { z } from 'zod';

/**
 * Meta's Strict Rules for Phase 3:
 * 1. Name: Lowercase alphanumeric + underscores only.
 * 2. Header: Max 60 chars.
 * 3. Body: Max 1024 chars (Required).
 * 4. Footer: Max 60 chars.
 * 5. Buttons: Max 10 total.
 */

export const TemplateSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[a-z0-9_]+$/, "Name must be lowercase with underscores (e.g., welcome_message)"),
  
  category: z.enum(['MARKETING', 'UTILITY']),
  
  // FIXED: Changed from .default() to a non-optional string to resolve the TS 'undefined' error
  language: z.string().min(1, "Language is required"),

  components: z.array(z.discriminatedUnion('type', [
    // Header Validation
    z.object({
      type: z.literal('HEADER'),
      format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
      text: z.string().max(60, "Header text too long").optional(),
    }),

    // Body Validation
    z.object({
      type: z.literal('BODY'),
      text: z.string()
        .min(1, "Body text is required")
        .max(1024, "Body text exceeds 1024 character limit"),
      example: z.object({
        body_text: z.array(z.array(z.string()))
      }).optional()
    }),

    // Footer Validation
    z.object({
      type: z.literal('FOOTER'),
      text: z.string().max(60, "Footer text too long")
    }),

    // Buttons Validation
    z.object({
      type: z.literal('BUTTONS'),
      buttons: z.array(z.object({
        type: z.enum(['QUICK_REPLY', 'PHONE_NUMBER', 'URL', 'COPY_CODE']),
        text: z.string().max(25, "Button text too long"),
        url: z.string().url("Invalid URL format").optional(),
        phone_number: z.string().optional(),
        example: z.array(z.string()).optional() // Required for COPY_CODE
      })).max(10, "Maximum 10 buttons allowed")
    })
  ]))
});

export type TemplateFormValues = z.infer<typeof TemplateSchema>;